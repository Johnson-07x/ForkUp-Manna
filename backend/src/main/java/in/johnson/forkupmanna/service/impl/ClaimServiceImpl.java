package in.johnson.forkupmanna.service.impl;

import in.johnson.forkupmanna.dto.UserSummary;
import in.johnson.forkupmanna.dto.claim.ClaimRequest;
import in.johnson.forkupmanna.dto.claim.ClaimResponse;
import in.johnson.forkupmanna.dto.donation.DonationSummary;
import in.johnson.forkupmanna.entity.Claim;
import in.johnson.forkupmanna.entity.Delivery;
import in.johnson.forkupmanna.entity.Donation;
import in.johnson.forkupmanna.entity.User;
import in.johnson.forkupmanna.enums.ClaimStatus;
import in.johnson.forkupmanna.enums.DonationStatus;
import in.johnson.forkupmanna.enums.NotificationType;
import in.johnson.forkupmanna.enums.UserRole;
import in.johnson.forkupmanna.exception.AppException;
import in.johnson.forkupmanna.repository.ClaimRepository;
import in.johnson.forkupmanna.repository.DeliveryRepository;
import in.johnson.forkupmanna.repository.DonationRepository;
import in.johnson.forkupmanna.repository.UserRepository;
import in.johnson.forkupmanna.service.ClaimService;
import in.johnson.forkupmanna.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClaimServiceImpl implements ClaimService {

    private final ClaimRepository claimRepository;
    private final DonationRepository donationRepository;
    private final DeliveryRepository deliveryRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public ClaimResponse createClaim(ClaimRequest request) {
        User receiver = getCurrentUser();
        if (receiver.getRole() != UserRole.RECEIVER) {
            throw new AppException("Only receivers can claim donations", HttpStatus.FORBIDDEN);
        }

        Donation donation = donationRepository.findByDonationId(request.getDonationId())
                .orElseThrow(() -> new AppException("Donation not found", HttpStatus.NOT_FOUND));

        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new AppException("Donation is not available for claiming", HttpStatus.BAD_REQUEST);
        }

        boolean alreadyClaimed = claimRepository.existsByDonationAndReceiverAndStatusNot(
                donation, receiver, ClaimStatus.CANCELLED);
        if (alreadyClaimed) {
            throw new AppException("You have already claimed this donation", HttpStatus.BAD_REQUEST);
        }

        Claim claim = Claim.builder()
                .donation(donation)
                .receiver(receiver)
                .status(ClaimStatus.PENDING)
                .notes(request.getNotes())
                .build();

        Claim saved = claimRepository.save(claim);
        log.info("Claim created: {} by receiver: {}", saved.getClaimId(), receiver.getEmail());

        // Notify donor
        notificationService.createNotification(
                donation.getDonor(),
                "New Claim on Your Donation",
                receiver.getName() + " has claimed your donation: " + donation.getTitle(),
                NotificationType.DONATION_CLAIMED,
                saved.getClaimId(),
                "CLAIM"
        );

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClaimResponse> getMyClaimsAsReceiver() {
        User receiver = getCurrentUser();
        return claimRepository.findByReceiverOrderByCreatedAtDesc(receiver).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClaimResponse> getClaimsOnMyDonations() {
        User donor = getCurrentUser();
        return claimRepository.findByDonation_DonorOrderByCreatedAtDesc(donor).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ClaimResponse approveClaim(String claimId) {
        User donor = getCurrentUser();
        Claim claim = claimRepository.findByClaimId(claimId)
                .orElseThrow(() -> new AppException("Claim not found", HttpStatus.NOT_FOUND));

        if (!claim.getDonation().getDonor().getId().equals(donor.getId())) {
            throw new AppException("You can only approve claims on your own donations", HttpStatus.FORBIDDEN);
        }
        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new AppException("Only PENDING claims can be approved", HttpStatus.BAD_REQUEST);
        }

        // Approve this claim
        claim.setStatus(ClaimStatus.APPROVED);
        Claim saved = claimRepository.save(claim);

        // Mark donation as CLAIMED
        Donation donation = claim.getDonation();
        donation.setStatus(DonationStatus.CLAIMED);
        donationRepository.save(donation);

        // Reject all other pending claims on the same donation
        List<Claim> otherPendingClaims = claimRepository.findByDonationAndStatus(donation, ClaimStatus.PENDING);
        otherPendingClaims.forEach(c -> c.setStatus(ClaimStatus.REJECTED));
        claimRepository.saveAll(otherPendingClaims);

        // Notify rejected claimants
        otherPendingClaims.forEach(c -> notificationService.createNotification(
                c.getReceiver(),
                "Claim Rejected",
                "Your claim on '" + donation.getTitle() + "' was not selected.",
                NotificationType.CLAIM_REJECTED,
                c.getClaimId(),
                "CLAIM"
        ));

        // Create delivery record (without volunteer assigned yet)
        Delivery delivery = Delivery.builder()
                .claim(saved)
                .build();
        deliveryRepository.save(delivery);
        log.info("Delivery created for claim: {}", claimId);

        // Notify receiver
        notificationService.createNotification(
                claim.getReceiver(),
                "Claim Approved!",
                "Your claim on '" + donation.getTitle() + "' has been approved. A volunteer will be assigned soon.",
                NotificationType.CLAIM_APPROVED,
                claimId,
                "CLAIM"
        );

        log.info("Claim approved: {}", claimId);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public ClaimResponse rejectClaim(String claimId) {
        User donor = getCurrentUser();
        Claim claim = claimRepository.findByClaimId(claimId)
                .orElseThrow(() -> new AppException("Claim not found", HttpStatus.NOT_FOUND));

        if (!claim.getDonation().getDonor().getId().equals(donor.getId())) {
            throw new AppException("You can only reject claims on your own donations", HttpStatus.FORBIDDEN);
        }
        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new AppException("Only PENDING claims can be rejected", HttpStatus.BAD_REQUEST);
        }

        claim.setStatus(ClaimStatus.REJECTED);
        Claim saved = claimRepository.save(claim);

        notificationService.createNotification(
                claim.getReceiver(),
                "Claim Rejected",
                "Your claim on '" + claim.getDonation().getTitle() + "' has been rejected.",
                NotificationType.CLAIM_REJECTED,
                claimId,
                "CLAIM"
        );

        log.info("Claim rejected: {}", claimId);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public ClaimResponse cancelClaim(String claimId) {
        User receiver = getCurrentUser();
        Claim claim = claimRepository.findByClaimId(claimId)
                .orElseThrow(() -> new AppException("Claim not found", HttpStatus.NOT_FOUND));

        if (!claim.getReceiver().getId().equals(receiver.getId())) {
            throw new AppException("You can only cancel your own claims", HttpStatus.FORBIDDEN);
        }
        if (claim.getStatus() != ClaimStatus.PENDING) {
            throw new AppException("Only PENDING claims can be cancelled", HttpStatus.BAD_REQUEST);
        }

        claim.setStatus(ClaimStatus.CANCELLED);
        Claim saved = claimRepository.save(claim);
        log.info("Claim cancelled: {}", claimId);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public ClaimResponse confirmReceived(String claimId) {
        User receiver = getCurrentUser();
        Claim claim = claimRepository.findByClaimId(claimId)
                .orElseThrow(() -> new AppException("Claim not found", HttpStatus.NOT_FOUND));

        if (!claim.getReceiver().getId().equals(receiver.getId())) {
            throw new AppException("You can only confirm receipt for your own claims", HttpStatus.FORBIDDEN);
        }
        if (claim.getStatus() != ClaimStatus.COMPLETED) {
            throw new AppException("Delivery must be completed before you can confirm receipt", HttpStatus.BAD_REQUEST);
        }

        // Notify donor that receiver confirmed receipt
        notificationService.createNotification(
                claim.getDonation().getDonor(),
                "Food Received Confirmed",
                receiver.getName() + " confirmed they received '" + claim.getDonation().getTitle() + "'. Thank you for donating!",
                NotificationType.DELIVERY_COMPLETED,
                claimId,
                "CLAIM"
        );

        log.info("Receiver {} confirmed receipt of claim {}", receiver.getEmail(), claimId);
        return mapToResponse(claim);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClaimResponse> getAllClaims() {
        return claimRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }

    private ClaimResponse mapToResponse(Claim claim) {
        Donation donation = claim.getDonation();
        return ClaimResponse.builder()
                .id(claim.getClaimId())
                .donation(DonationSummary.builder()
                        .id(donation.getDonationId())
                        .title(donation.getTitle())
                        .city(donation.getCity())
                        .address(donation.getAddress())
                        .status(donation.getStatus())
                        .foodType(donation.getFoodType())
                        .donor(UserSummary.builder()
                                .id(donation.getDonor().getUuid())
                                .name(donation.getDonor().getName())
                                .email(donation.getDonor().getEmail())
                                .phone(donation.getDonor().getPhone())
                                .build())
                        .build())
                .receiver(UserSummary.builder()
                        .id(claim.getReceiver().getUuid())
                        .name(claim.getReceiver().getName())
                        .phone(claim.getReceiver().getPhone())
                        .email(claim.getReceiver().getEmail())
                        .build())
                .volunteer(claim.getVolunteer() != null
                        ? UserSummary.builder()
                                .id(claim.getVolunteer().getUuid())
                                .name(claim.getVolunteer().getName())
                                .phone(claim.getVolunteer().getPhone())
                                .email(claim.getVolunteer().getEmail())
                                .build()
                        : null)
                .status(claim.getStatus())
                .notes(claim.getNotes())
                .createdAt(claim.getCreatedAt() != null
                        ? claim.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME)
                        : null)
                .updatedAt(claim.getUpdatedAt() != null
                        ? claim.getUpdatedAt().format(DateTimeFormatter.ISO_DATE_TIME)
                        : null)
                .build();
    }
}
