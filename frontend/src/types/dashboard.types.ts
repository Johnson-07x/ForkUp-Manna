export interface DashboardStats {
  // Admin fields
  totalUsers?: number;
  totalDonors?: number;
  totalReceivers?: number;
  totalVolunteers?: number;
  totalDonations?: number;
  availableDonations?: number;
  claimedDonations?: number;
  deliveredDonations?: number;
  totalClaims?: number;
  pendingClaims?: number;
  approvedClaims?: number;
  totalDeliveries?: number;
  completedDeliveries?: number;
  // Donor fields
  myDonations?: number;
  myAvailable?: number;
  myClaimed?: number;
  myDelivered?: number;
  claimsOnMyDonations?: number;
  pendingClaimsOnMyDonations?: number;
  // Receiver fields
  myTotalClaims?: number;
  myApprovedClaims?: number;
  myPendingClaims?: number;
  myCompletedClaims?: number;
  // Volunteer fields
  myTotalDeliveries?: number;
  myCompletedDeliveries?: number;
  myActiveDeliveries?: number;
}
