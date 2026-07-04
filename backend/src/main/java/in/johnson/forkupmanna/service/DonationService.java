package in.johnson.forkupmanna.service;

import in.johnson.forkupmanna.dto.donation.DonationRequest;
import in.johnson.forkupmanna.dto.donation.DonationResponse;
import in.johnson.forkupmanna.dto.donation.DonationSearchRequest;
import in.johnson.forkupmanna.enums.FoodType;
import org.springframework.data.domain.Page;

import java.util.List;

public interface DonationService {
    DonationResponse createDonation(DonationRequest request);
    DonationResponse getDonationById(String donationId);
    Page<DonationResponse> getAvailableDonations(int page, int size, String city);
    Page<DonationResponse> searchDonations(String keyword, FoodType foodType, String city, String state, Integer expiresWithinHours, int page, int size);
    List<DonationResponse> getMyDonations();
    DonationResponse updateDonation(String donationId, DonationRequest request);
    void cancelDonation(String donationId);
    DonationResponse duplicateDonation(String donationId);
    List<DonationResponse> getAllDonations();
    void expireOverdueDonations();
}
