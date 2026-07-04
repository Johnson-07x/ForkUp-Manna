package in.johnson.forkupmanna.service.impl;

import in.johnson.forkupmanna.dto.UserSummary;
import in.johnson.forkupmanna.dto.donation.DonationRequest;
import in.johnson.forkupmanna.dto.donation.DonationResponse;
import in.johnson.forkupmanna.entity.Donation;
import in.johnson.forkupmanna.entity.User;
import in.johnson.forkupmanna.enums.DonationStatus;
import in.johnson.forkupmanna.enums.FoodType;
import in.johnson.forkupmanna.enums.UserRole;
import in.johnson.forkupmanna.exception.AppException;
import in.johnson.forkupmanna.repository.DonationRepository;
import in.johnson.forkupmanna.repository.UserRepository;
import in.johnson.forkupmanna.service.DonationService;
import in.johnson.forkupmanna.util.DonationSpecification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
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
public class DonationServiceImpl implements DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public DonationResponse createDonation(DonationRequest request) {
        User donor = getCurrentUser();
        if (donor.getRole() != UserRole.DONOR) {
            throw new AppException("Only donors can create donations", HttpStatus.FORBIDDEN);
        }

        Donation donation = Donation.builder()
                .donor(donor)
                .title(request.getTitle())
                .description(request.getDescription())
                .foodType(request.getFoodType())
                .quantity(request.getQuantity())
                .servesPeople(request.getServesPeople())
                .expiryTime(request.getExpiryTime())
                .address(request.getAddress())
                .city(request.getCity())
                .state(request.getState())
                .pincode(request.getPincode())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .imageUrl(request.getImageUrl())
                .pickupInstructions(request.getPickupInstructions())
                .status(DonationStatus.AVAILABLE)
                .build();

        Donation saved = donationRepository.save(donation);
        log.info("Donation created: {} by donor: {}", saved.getDonationId(), donor.getEmail());
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public DonationResponse getDonationById(String donationId) {
        Donation donation = donationRepository.findByDonationId(donationId)
                .orElseThrow(() -> new AppException("Donation not found", HttpStatus.NOT_FOUND));
        return mapToResponse(donation);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DonationResponse> getAvailableDonations(int page, int size, String city) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        if (city != null && !city.isBlank()) {
            return donationRepository
                    .findByStatusAndCityIgnoreCaseOrderByCreatedAtDesc(DonationStatus.AVAILABLE, city, pageRequest)
                    .map(this::mapToResponse);
        }
        return donationRepository.findByStatusOrderByCreatedAtDesc(DonationStatus.AVAILABLE, pageRequest)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DonationResponse> getMyDonations() {
        User donor = getCurrentUser();
        return donationRepository.findByDonorOrderByCreatedAtDesc(donor).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DonationResponse updateDonation(String donationId, DonationRequest request) {
        User donor = getCurrentUser();
        Donation donation = donationRepository.findByDonationId(donationId)
                .orElseThrow(() -> new AppException("Donation not found", HttpStatus.NOT_FOUND));

        if (!donation.getDonor().getId().equals(donor.getId())) {
            throw new AppException("You can only update your own donations", HttpStatus.FORBIDDEN);
        }
        if (donation.getStatus() != DonationStatus.AVAILABLE) {
            throw new AppException("Only AVAILABLE donations can be updated", HttpStatus.BAD_REQUEST);
        }

        donation.setTitle(request.getTitle());
        donation.setDescription(request.getDescription());
        donation.setFoodType(request.getFoodType());
        donation.setQuantity(request.getQuantity());
        donation.setServesPeople(request.getServesPeople());
        donation.setExpiryTime(request.getExpiryTime());
        donation.setAddress(request.getAddress());
        donation.setCity(request.getCity());
        donation.setState(request.getState());
        donation.setPincode(request.getPincode());
        donation.setLatitude(request.getLatitude());
        donation.setLongitude(request.getLongitude());
        donation.setImageUrl(request.getImageUrl());
        donation.setPickupInstructions(request.getPickupInstructions());

        Donation saved = donationRepository.save(donation);
        log.info("Donation updated: {}", saved.getDonationId());
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void cancelDonation(String donationId) {
        User donor = getCurrentUser();
        Donation donation = donationRepository.findByDonationId(donationId)
                .orElseThrow(() -> new AppException("Donation not found", HttpStatus.NOT_FOUND));

        if (!donation.getDonor().getId().equals(donor.getId())) {
            throw new AppException("You can only cancel your own donations", HttpStatus.FORBIDDEN);
        }
        if (donation.getStatus() == DonationStatus.DELIVERED) {
            throw new AppException("Delivered donations cannot be cancelled", HttpStatus.BAD_REQUEST);
        }

        donation.setStatus(DonationStatus.CANCELLED);
        donationRepository.save(donation);
        log.info("Donation cancelled: {}", donationId);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DonationResponse> searchDonations(String keyword, FoodType foodType, String city, String state,
                                                   Integer expiresWithinHours, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size);
        return donationRepository.findAll(
                DonationSpecification.search(keyword, foodType, city, state, expiresWithinHours),
                pageRequest
        ).map(this::mapToResponse);
    }

    @Override
    @Transactional
    public DonationResponse duplicateDonation(String donationId) {
        User donor = getCurrentUser();
        Donation original = donationRepository.findByDonationId(donationId)
                .orElseThrow(() -> new AppException("Donation not found", HttpStatus.NOT_FOUND));

        if (!original.getDonor().getId().equals(donor.getId())) {
            throw new AppException("You can only duplicate your own donations", HttpStatus.FORBIDDEN);
        }

        Donation duplicate = Donation.builder()
                .donor(donor)
                .title(original.getTitle())
                .description(original.getDescription())
                .foodType(original.getFoodType())
                .quantity(original.getQuantity())
                .servesPeople(original.getServesPeople())
                .expiryTime(LocalDateTime.now().plusHours(24))
                .address(original.getAddress())
                .city(original.getCity())
                .state(original.getState())
                .pincode(original.getPincode())
                .latitude(original.getLatitude())
                .longitude(original.getLongitude())
                .imageUrl(original.getImageUrl())
                .pickupInstructions(original.getPickupInstructions())
                .status(DonationStatus.AVAILABLE)
                .build();

        Donation saved = donationRepository.save(duplicate);
        log.info("Donation duplicated: {} → {}", donationId, saved.getDonationId());
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DonationResponse> getAllDonations() {
        return donationRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt")).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void expireOverdueDonations() {
        List<Donation> overdue = donationRepository.findByStatusAndExpiryTimeBefore(
                DonationStatus.AVAILABLE, LocalDateTime.now());
        if (!overdue.isEmpty()) {
            overdue.forEach(d -> d.setStatus(DonationStatus.EXPIRED));
            donationRepository.saveAll(overdue);
            log.info("Expired {} overdue donations", overdue.size());
        }
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }

    DonationResponse mapToResponse(Donation donation) {
        return DonationResponse.builder()
                .id(donation.getDonationId())
                .donor(UserSummary.builder()
                        .id(donation.getDonor().getUuid())
                        .name(donation.getDonor().getName())
                        .phone(donation.getDonor().getPhone())
                        .email(donation.getDonor().getEmail())
                        .build())
                .title(donation.getTitle())
                .description(donation.getDescription())
                .foodType(donation.getFoodType())
                .quantity(donation.getQuantity())
                .servesPeople(donation.getServesPeople())
                .expiryTime(donation.getExpiryTime() != null
                        ? donation.getExpiryTime().format(DateTimeFormatter.ISO_DATE_TIME)
                        : null)
                .address(donation.getAddress())
                .city(donation.getCity())
                .state(donation.getState())
                .pincode(donation.getPincode())
                .latitude(donation.getLatitude())
                .longitude(donation.getLongitude())
                .status(donation.getStatus())
                .imageUrl(donation.getImageUrl())
                .pickupInstructions(donation.getPickupInstructions())
                .createdAt(donation.getCreatedAt() != null
                        ? donation.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME)
                        : null)
                .updatedAt(donation.getUpdatedAt() != null
                        ? donation.getUpdatedAt().format(DateTimeFormatter.ISO_DATE_TIME)
                        : null)
                .build();
    }
}
