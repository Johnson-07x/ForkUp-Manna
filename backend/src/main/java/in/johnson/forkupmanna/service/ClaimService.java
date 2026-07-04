package in.johnson.forkupmanna.service;

import in.johnson.forkupmanna.dto.claim.ClaimRequest;
import in.johnson.forkupmanna.dto.claim.ClaimResponse;

import java.util.List;

public interface ClaimService {
    ClaimResponse createClaim(ClaimRequest request);
    List<ClaimResponse> getMyClaimsAsReceiver();
    List<ClaimResponse> getClaimsOnMyDonations();
    ClaimResponse approveClaim(String claimId);
    ClaimResponse rejectClaim(String claimId);
    ClaimResponse cancelClaim(String claimId);
    ClaimResponse confirmReceived(String claimId);
    List<ClaimResponse> getAllClaims();
}
