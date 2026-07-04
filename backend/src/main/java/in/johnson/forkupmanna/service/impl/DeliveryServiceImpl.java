package in.johnson.forkupmanna.service.impl;

import in.johnson.forkupmanna.dto.UserSummary;
import in.johnson.forkupmanna.dto.claim.ClaimSummary;
import in.johnson.forkupmanna.dto.delivery.DeliveryResponse;
import in.johnson.forkupmanna.dto.donation.DonationSummary;
import in.johnson.forkupmanna.entity.Claim;
import in.johnson.forkupmanna.entity.Delivery;
import in.johnson.forkupmanna.entity.Donation;
import in.johnson.forkupmanna.entity.User;
import in.johnson.forkupmanna.enums.ClaimStatus;
import in.johnson.forkupmanna.enums.DeliveryStatus;
import in.johnson.forkupmanna.enums.DonationStatus;
import in.johnson.forkupmanna.enums.NotificationType;
import in.johnson.forkupmanna.enums.UserRole;
import in.johnson.forkupmanna.exception.AppException;
import in.johnson.forkupmanna.repository.ClaimRepository;
import in.johnson.forkupmanna.repository.DeliveryRepository;
import in.johnson.forkupmanna.repository.DonationRepository;
import in.johnson.forkupmanna.repository.UserRepository;
import in.johnson.forkupmanna.service.DeliveryService;
import in.johnson.forkupmanna.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class DeliveryServiceImpl implements DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final ClaimRepository claimRepository;
    private final DonationRepository donationRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryResponse> getAvailableDeliveries() {
        // Deliveries without a volunteer, waiting to be accepted
        return deliveryRepository.findByVolunteerIsNullAndStatusOrderByCreatedAtDesc(DeliveryStatus.ASSIGNED)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DeliveryResponse acceptDelivery(String deliveryId) {
        User volunteer = getCurrentUser();
        if (volunteer.getRole() != UserRole.VOLUNTEER) {
            throw new AppException("Only volunteers can accept deliveries", HttpStatus.FORBIDDEN);
        }

        Delivery delivery = deliveryRepository.findByDeliveryId(deliveryId)
                .orElseThrow(() -> new AppException("Delivery not found", HttpStatus.NOT_FOUND));

        if (delivery.getVolunteer() != null) {
            throw new AppException("Delivery already accepted by another volunteer", HttpStatus.BAD_REQUEST);
        }
        if (delivery.getStatus() != DeliveryStatus.ASSIGNED) {
            throw new AppException("Delivery is not available for acceptance", HttpStatus.BAD_REQUEST);
        }

        delivery.setVolunteer(volunteer);
        Delivery saved = deliveryRepository.save(delivery);
        log.info("Delivery {} accepted by volunteer: {}", deliveryId, volunteer.getEmail());

        // Notify receiver
        Claim claim = delivery.getClaim();
        notificationService.createNotification(
                claim.getReceiver(),
                "Volunteer Assigned",
                volunteer.getName() + " will deliver your food from '" + claim.getDonation().getTitle() + "'.",
                NotificationType.DELIVERY_ASSIGNED,
                deliveryId,
                "DELIVERY"
        );

        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public DeliveryResponse markPickedUp(String deliveryId) {
        User volunteer = getCurrentUser();
        Delivery delivery = getDeliveryForVolunteer(deliveryId, volunteer);

        if (delivery.getStatus() != DeliveryStatus.ASSIGNED) {
            throw new AppException("Delivery must be in ASSIGNED status to mark as picked up", HttpStatus.BAD_REQUEST);
        }

        delivery.setStatus(DeliveryStatus.PICKED_UP);
        delivery.setPickupTime(LocalDateTime.now());

        // Update donation status
        Donation donation = delivery.getClaim().getDonation();
        donation.setStatus(DonationStatus.PICKED_UP);
        donationRepository.save(donation);

        Delivery saved = deliveryRepository.save(delivery);
        log.info("Delivery {} marked as picked up", deliveryId);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public DeliveryResponse markDelivered(String deliveryId) {
        User volunteer = getCurrentUser();
        Delivery delivery = getDeliveryForVolunteer(deliveryId, volunteer);

        if (delivery.getStatus() != DeliveryStatus.PICKED_UP) {
            throw new AppException("Delivery must be in PICKED_UP status to mark as delivered", HttpStatus.BAD_REQUEST);
        }

        delivery.setStatus(DeliveryStatus.DELIVERED);
        delivery.setDeliveryTime(LocalDateTime.now());

        // Update claim and donation status
        Claim claim = delivery.getClaim();
        claim.setStatus(ClaimStatus.COMPLETED);
        claimRepository.save(claim);

        Donation donation = claim.getDonation();
        donation.setStatus(DonationStatus.DELIVERED);
        donationRepository.save(donation);

        Delivery saved = deliveryRepository.save(delivery);
        log.info("Delivery {} marked as delivered", deliveryId);

        // Notify receiver and donor
        notificationService.createNotification(
                claim.getReceiver(),
                "Food Delivered!",
                "Your food '" + donation.getTitle() + "' has been delivered successfully.",
                NotificationType.DELIVERY_COMPLETED,
                deliveryId,
                "DELIVERY"
        );
        notificationService.createNotification(
                donation.getDonor(),
                "Donation Delivered",
                "Your donation '" + donation.getTitle() + "' has been successfully delivered.",
                NotificationType.DELIVERY_COMPLETED,
                deliveryId,
                "DELIVERY"
        );

        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryResponse> getMyDeliveries() {
        User volunteer = getCurrentUser();
        return deliveryRepository.findByVolunteerOrderByCreatedAtDesc(volunteer).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<DeliveryResponse> getAllDeliveries() {
        return deliveryRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private Delivery getDeliveryForVolunteer(String deliveryId, User volunteer) {
        Delivery delivery = deliveryRepository.findByDeliveryId(deliveryId)
                .orElseThrow(() -> new AppException("Delivery not found", HttpStatus.NOT_FOUND));
        if (delivery.getVolunteer() == null || !delivery.getVolunteer().getId().equals(volunteer.getId())) {
            throw new AppException("This delivery is not assigned to you", HttpStatus.FORBIDDEN);
        }
        return delivery;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }

    private DeliveryResponse mapToResponse(Delivery delivery) {
        Claim claim = delivery.getClaim();
        Donation donation = claim.getDonation();

        return DeliveryResponse.builder()
                .id(delivery.getDeliveryId())
                .claim(ClaimSummary.builder()
                        .id(claim.getClaimId())
                        .donation(DonationSummary.builder()
                                .id(donation.getDonationId())
                                .title(donation.getTitle())
                                .city(donation.getCity())
                                .address(donation.getAddress())
                                .status(donation.getStatus())
                                .foodType(donation.getFoodType())
                                .build())
                        .receiver(UserSummary.builder()
                                .id(claim.getReceiver().getUuid())
                                .name(claim.getReceiver().getName())
                                .phone(claim.getReceiver().getPhone())
                                .email(claim.getReceiver().getEmail())
                                .build())
                        .status(claim.getStatus())
                        .build())
                .volunteer(delivery.getVolunteer() != null
                        ? UserSummary.builder()
                                .id(delivery.getVolunteer().getUuid())
                                .name(delivery.getVolunteer().getName())
                                .phone(delivery.getVolunteer().getPhone())
                                .email(delivery.getVolunteer().getEmail())
                                .build()
                        : null)
                .status(delivery.getStatus())
                .pickupTime(delivery.getPickupTime() != null
                        ? delivery.getPickupTime().format(DateTimeFormatter.ISO_DATE_TIME)
                        : null)
                .deliveryTime(delivery.getDeliveryTime() != null
                        ? delivery.getDeliveryTime().format(DateTimeFormatter.ISO_DATE_TIME)
                        : null)
                .notes(delivery.getNotes())
                .createdAt(delivery.getCreatedAt() != null
                        ? delivery.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME)
                        : null)
                .updatedAt(delivery.getUpdatedAt() != null
                        ? delivery.getUpdatedAt().format(DateTimeFormatter.ISO_DATE_TIME)
                        : null)
                .build();
    }
}
