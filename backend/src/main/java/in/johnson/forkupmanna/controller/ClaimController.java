package in.johnson.forkupmanna.controller;

import in.johnson.forkupmanna.common.ApiResponse;
import in.johnson.forkupmanna.dto.claim.ClaimRequest;
import in.johnson.forkupmanna.dto.claim.ClaimResponse;
import in.johnson.forkupmanna.service.ClaimService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    @PostMapping
    @PreAuthorize("hasRole('RECEIVER')")
    public ResponseEntity<ApiResponse<ClaimResponse>> createClaim(@Valid @RequestBody ClaimRequest request) {
        ClaimResponse response = claimService.createClaim(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Claim submitted successfully", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('RECEIVER')")
    public ResponseEntity<ApiResponse<List<ClaimResponse>>> getMyClaimsAsReceiver() {
        List<ClaimResponse> claims = claimService.getMyClaimsAsReceiver();
        return ResponseEntity.ok(ApiResponse.success("My claims retrieved successfully", claims));
    }

    @GetMapping("/on-my-donations")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse<List<ClaimResponse>>> getClaimsOnMyDonations() {
        List<ClaimResponse> claims = claimService.getClaimsOnMyDonations();
        return ResponseEntity.ok(ApiResponse.success("Claims on my donations retrieved successfully", claims));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ClaimResponse>>> getAllClaims() {
        List<ClaimResponse> claims = claimService.getAllClaims();
        return ResponseEntity.ok(ApiResponse.success("All claims retrieved successfully", claims));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse<ClaimResponse>> approveClaim(@PathVariable String id) {
        ClaimResponse response = claimService.approveClaim(id);
        return ResponseEntity.ok(ApiResponse.success("Claim approved successfully", response));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse<ClaimResponse>> rejectClaim(@PathVariable String id) {
        ClaimResponse response = claimService.rejectClaim(id);
        return ResponseEntity.ok(ApiResponse.success("Claim rejected", response));
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize("hasRole('RECEIVER')")
    public ResponseEntity<ApiResponse<ClaimResponse>> cancelClaim(@PathVariable String id) {
        ClaimResponse response = claimService.cancelClaim(id);
        return ResponseEntity.ok(ApiResponse.success("Claim cancelled", response));
    }

    @PutMapping("/{id}/confirm-received")
    @PreAuthorize("hasRole('RECEIVER')")
    public ResponseEntity<ApiResponse<ClaimResponse>> confirmReceived(@PathVariable String id) {
        ClaimResponse response = claimService.confirmReceived(id);
        return ResponseEntity.ok(ApiResponse.success("Receipt confirmed successfully", response));
    }
}
