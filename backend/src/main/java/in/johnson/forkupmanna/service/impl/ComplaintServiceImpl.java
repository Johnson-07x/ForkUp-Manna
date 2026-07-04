package in.johnson.forkupmanna.service.impl;

import in.johnson.forkupmanna.dto.complaint.ComplaintRequest;
import in.johnson.forkupmanna.dto.complaint.ComplaintResponse;
import in.johnson.forkupmanna.dto.complaint.ComplaintStatusUpdateRequest;
import in.johnson.forkupmanna.entity.Complaint;
import in.johnson.forkupmanna.entity.Donation;
import in.johnson.forkupmanna.entity.User;
import in.johnson.forkupmanna.enums.ComplaintStatus;
import in.johnson.forkupmanna.exception.AppException;
import in.johnson.forkupmanna.repository.ComplaintRepository;
import in.johnson.forkupmanna.repository.DonationRepository;
import in.johnson.forkupmanna.repository.UserRepository;
import in.johnson.forkupmanna.service.ComplaintService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ComplaintServiceImpl implements ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final UserRepository userRepository;
    private final DonationRepository donationRepository;

    @Override
    public ComplaintResponse fileComplaint(ComplaintRequest request) {
        User complainant = getCurrentUser();

        User reportedUser = null;
        if (request.getReportedUserId() != null && !request.getReportedUserId().isBlank()) {
            reportedUser = userRepository.findByUuid(request.getReportedUserId())
                    .orElseThrow(() -> new AppException("Reported user not found", HttpStatus.NOT_FOUND));
        }

        Donation donation = null;
        if (request.getDonationId() != null && !request.getDonationId().isBlank()) {
            donation = donationRepository.findByDonationId(request.getDonationId())
                    .orElseThrow(() -> new AppException("Donation not found", HttpStatus.NOT_FOUND));
        }

        Complaint complaint = Complaint.builder()
                .complainant(complainant)
                .reportedUser(reportedUser)
                .donation(donation)
                .subject(request.getSubject())
                .description(request.getDescription())
                .build();

        return mapToResponse(complaintRepository.save(complaint));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getMyComplaints() {
        User user = getCurrentUser();
        return complaintRepository.findByComplainantUuidOrderByCreatedAtDesc(user.getUuid())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getAllComplaints() {
        return complaintRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponse> getComplaintsByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatusOrderByCreatedAtDesc(status)
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    public ComplaintResponse updateComplaintStatus(String complaintUuid, ComplaintStatusUpdateRequest request) {
        Complaint complaint = complaintRepository.findByUuid(complaintUuid)
                .orElseThrow(() -> new AppException("Complaint not found", HttpStatus.NOT_FOUND));
        complaint.setStatus(request.getStatus());
        if (request.getAdminNotes() != null) {
            complaint.setAdminNotes(request.getAdminNotes());
        }
        return mapToResponse(complaintRepository.save(complaint));
    }

    @Override
    @Transactional(readOnly = true)
    public ComplaintResponse getComplaintById(String complaintUuid) {
        Complaint complaint = complaintRepository.findByUuid(complaintUuid)
                .orElseThrow(() -> new AppException("Complaint not found", HttpStatus.NOT_FOUND));
        return mapToResponse(complaint);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
    }

    private ComplaintResponse mapToResponse(Complaint c) {
        DateTimeFormatter fmt = DateTimeFormatter.ISO_DATE_TIME;
        return ComplaintResponse.builder()
                .id(c.getUuid())
                .complainant(toUserSummary(c.getComplainant()))
                .reportedUser(c.getReportedUser() != null ? toUserSummary(c.getReportedUser()) : null)
                .donationId(c.getDonation() != null ? c.getDonation().getDonationId() : null)
                .donationTitle(c.getDonation() != null ? c.getDonation().getTitle() : null)
                .subject(c.getSubject())
                .description(c.getDescription())
                .status(c.getStatus().name())
                .adminNotes(c.getAdminNotes())
                .createdAt(c.getCreatedAt() != null ? c.getCreatedAt().format(fmt) : null)
                .updatedAt(c.getUpdatedAt() != null ? c.getUpdatedAt().format(fmt) : null)
                .build();
    }

    private ComplaintResponse.UserSummary toUserSummary(User u) {
        return ComplaintResponse.UserSummary.builder()
                .id(u.getUuid())
                .name(u.getName())
                .email(u.getEmail())
                .role(u.getRole().name())
                .build();
    }
}
