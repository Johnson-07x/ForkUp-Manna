package in.johnson.forkupmanna.dto.dashboard;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DashboardStatsResponse {

    // ADMIN stats
    private Long totalUsers;
    private Long totalDonors;
    private Long totalReceivers;
    private Long totalVolunteers;
    private Long totalDonations;
    private Long availableDonations;
    private Long claimedDonations;
    private Long deliveredDonations;
    private Long totalClaims;
    private Long pendingClaims;
    private Long approvedClaims;
    private Long totalDeliveries;
    private Long completedDeliveries;

    // DONOR stats
    private Long myDonations;
    private Long myAvailable;
    private Long myClaimed;
    private Long myDelivered;
    private Long claimsOnMyDonations;
    private Long pendingClaimsOnMyDonations;

    // RECEIVER stats
    private Long myTotalClaims;
    private Long myApprovedClaims;
    private Long myPendingClaims;
    private Long myCompletedClaims;

    // VOLUNTEER stats
    private Long myTotalDeliveries;
    private Long myCompletedDeliveries;
    private Long myActiveDeliveries;
}
