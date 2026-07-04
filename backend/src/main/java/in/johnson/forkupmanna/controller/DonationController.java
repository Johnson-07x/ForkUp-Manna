package in.johnson.forkupmanna.controller;

import in.johnson.forkupmanna.common.ApiResponse;
import in.johnson.forkupmanna.dto.donation.DonationRequest;
import in.johnson.forkupmanna.dto.donation.DonationResponse;
import in.johnson.forkupmanna.enums.FoodType;
import in.johnson.forkupmanna.service.DonationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donations")
@RequiredArgsConstructor
public class DonationController {

    private final DonationService donationService;

    @PostMapping
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse<DonationResponse>> createDonation(@Valid @RequestBody DonationRequest request) {
        DonationResponse response = donationService.createDonation(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Donation created successfully", response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<DonationResponse>>> getAvailableDonations(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String city) {
        Page<DonationResponse> donations = donationService.getAvailableDonations(page, size, city);
        return ResponseEntity.ok(ApiResponse.success("Available donations retrieved successfully", donations));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<Page<DonationResponse>>> searchDonations(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) FoodType foodType,
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) Integer expiresWithinHours,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {
        Page<DonationResponse> donations = donationService.searchDonations(
                keyword, foodType, city, state, expiresWithinHours, page, size);
        return ResponseEntity.ok(ApiResponse.success("Search results retrieved successfully", donations));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse<List<DonationResponse>>> getMyDonations() {
        List<DonationResponse> donations = donationService.getMyDonations();
        return ResponseEntity.ok(ApiResponse.success("My donations retrieved successfully", donations));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<DonationResponse>>> getAllDonations() {
        List<DonationResponse> donations = donationService.getAllDonations();
        return ResponseEntity.ok(ApiResponse.success("All donations retrieved successfully", donations));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DonationResponse>> getDonationById(@PathVariable String id) {
        DonationResponse response = donationService.getDonationById(id);
        return ResponseEntity.ok(ApiResponse.success("Donation retrieved successfully", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse<DonationResponse>> updateDonation(
            @PathVariable String id,
            @Valid @RequestBody DonationRequest request) {
        DonationResponse response = donationService.updateDonation(id, request);
        return ResponseEntity.ok(ApiResponse.success("Donation updated successfully", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse<Void>> cancelDonation(@PathVariable String id) {
        donationService.cancelDonation(id);
        return ResponseEntity.ok(ApiResponse.success("Donation cancelled successfully"));
    }

    @PostMapping("/{id}/duplicate")
    @PreAuthorize("hasRole('DONOR')")
    public ResponseEntity<ApiResponse<DonationResponse>> duplicateDonation(@PathVariable String id) {
        DonationResponse response = donationService.duplicateDonation(id);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Donation duplicated successfully", response));
    }
}
