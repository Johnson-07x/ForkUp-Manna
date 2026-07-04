package in.johnson.forkupmanna.service.impl;

import in.johnson.forkupmanna.dto.dashboard.DashboardStatsResponse;
import in.johnson.forkupmanna.entity.User;
import in.johnson.forkupmanna.enums.ClaimStatus;
import in.johnson.forkupmanna.enums.DeliveryStatus;
import in.johnson.forkupmanna.enums.DonationStatus;
import in.johnson.forkupmanna.enums.UserRole;
import in.johnson.forkupmanna.exception.AppException;
import in.johnson.forkupmanna.repository.ClaimRepository;
import in.johnson.forkupmanna.repository.DeliveryRepository;
import in.johnson.forkupmanna.repository.DonationRepository;
import in.johnson.forkupmanna.repository.UserRepository;
import in.johnson.forkupmanna.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final DonationRepository donationRepository;
    private final ClaimRepository claimRepository;
    private final DeliveryRepository deliveryRepository;

    @Override
    @Transactional(readOnly = true)
    public DashboardStatsResponse getDashboardStats() {
        User user = getCurrentUser();
        return switch (user.getRole()) {
            case ADMIN -> buildAdminStats();
            case DONOR -> buildDonorStats(user);
            case RECEIVER -> buildReceiverStats(user);
            case VOLUNTEER -> buildVolunteerStats(user);
        };
    }

    private DashboardStatsResponse buildAdminStats() {
        return DashboardStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalDonors(userRepository.countByRole(UserRole.DONOR))
                .totalReceivers(userRepository.countByRole(UserRole.RECEIVER))
                .totalVolunteers(userRepository.countByRole(UserRole.VOLUNTEER))
                .totalDonations(donationRepository.count())
                .availableDonations(donationRepository.countByStatus(DonationStatus.AVAILABLE))
                .claimedDonations(donationRepository.countByStatus(DonationStatus.CLAIMED))
                .deliveredDonations(donationRepository.countByStatus(DonationStatus.DELIVERED))
                .totalClaims(claimRepository.count())
                .pendingClaims(claimRepository.countByStatus(ClaimStatus.PENDING))
                .approvedClaims(claimRepository.countByStatus(ClaimStatus.APPROVED))
                .totalDeliveries(deliveryRepository.count())
                .completedDeliveries((long) deliveryRepository.findByStatusOrderByCreatedAtDesc(DeliveryStatus.DELIVERED).size())
                .build();
    }

    private DashboardStatsResponse buildDonorStats(User donor) {
        long myDonations = donationRepository.countByDonor(donor);
        long myAvailable = donationRepository.findByDonorOrderByCreatedAtDesc(donor).stream()
                .filter(d -> d.getStatus() == DonationStatus.AVAILABLE).count();
        long myClaimed = donationRepository.findByDonorOrderByCreatedAtDesc(donor).stream()
                .filter(d -> d.getStatus() == DonationStatus.CLAIMED).count();
        long myDelivered = donationRepository.findByDonorOrderByCreatedAtDesc(donor).stream()
                .filter(d -> d.getStatus() == DonationStatus.DELIVERED).count();
        long claimsOnMine = claimRepository.findByDonation_DonorOrderByCreatedAtDesc(donor).size();
        long pendingClaimsOnMine = claimRepository.findByDonation_DonorOrderByCreatedAtDesc(donor).stream()
                .filter(c -> c.getStatus() == ClaimStatus.PENDING).count();

        return DashboardStatsResponse.builder()
                .myDonations(myDonations)
                .myAvailable(myAvailable)
                .myClaimed(myClaimed)
                .myDelivered(myDelivered)
                .claimsOnMyDonations(claimsOnMine)
                .pendingClaimsOnMyDonations(pendingClaimsOnMine)
                .build();
    }

    private DashboardStatsResponse buildReceiverStats(User receiver) {
        return DashboardStatsResponse.builder()
                .myTotalClaims(claimRepository.countByReceiver(receiver))
                .myApprovedClaims(claimRepository.findByReceiverOrderByCreatedAtDesc(receiver).stream()
                        .filter(c -> c.getStatus() == ClaimStatus.APPROVED).count())
                .myPendingClaims(claimRepository.findByReceiverOrderByCreatedAtDesc(receiver).stream()
                        .filter(c -> c.getStatus() == ClaimStatus.PENDING).count())
                .myCompletedClaims(claimRepository.findByReceiverOrderByCreatedAtDesc(receiver).stream()
                        .filter(c -> c.getStatus() == ClaimStatus.COMPLETED).count())
                .build();
    }

    private DashboardStatsResponse buildVolunteerStats(User volunteer) {
        return DashboardStatsResponse.builder()
                .myTotalDeliveries(deliveryRepository.countByVolunteer(volunteer))
                .myCompletedDeliveries(deliveryRepository.countByVolunteerAndStatus(volunteer, DeliveryStatus.DELIVERED))
                .myActiveDeliveries(deliveryRepository.findByVolunteerOrderByCreatedAtDesc(volunteer).stream()
                        .filter(d -> d.getStatus() != DeliveryStatus.DELIVERED && d.getStatus() != DeliveryStatus.FAILED)
                        .count())
                .build();
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }
}
