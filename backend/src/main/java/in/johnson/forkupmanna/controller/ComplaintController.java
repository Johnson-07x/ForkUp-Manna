package in.johnson.forkupmanna.controller;

import in.johnson.forkupmanna.common.ApiResponse;
import in.johnson.forkupmanna.dto.complaint.ComplaintRequest;
import in.johnson.forkupmanna.dto.complaint.ComplaintResponse;
import in.johnson.forkupmanna.dto.complaint.ComplaintStatusUpdateRequest;
import in.johnson.forkupmanna.enums.ComplaintStatus;
import in.johnson.forkupmanna.service.ComplaintService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/complaints")
@RequiredArgsConstructor
public class ComplaintController {

    private final ComplaintService complaintService;

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "File a new complaint")
    public ResponseEntity<ApiResponse<ComplaintResponse>> fileComplaint(@Valid @RequestBody ComplaintRequest request) {
        ComplaintResponse response = complaintService.fileComplaint(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Complaint filed successfully", response));
    }

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get my filed complaints")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getMyComplaints() {
        List<ComplaintResponse> complaints = complaintService.getMyComplaints();
        return ResponseEntity.ok(ApiResponse.success("My complaints retrieved successfully", complaints));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all complaints (Admin)")
    public ResponseEntity<ApiResponse<List<ComplaintResponse>>> getAllComplaints(
            @RequestParam(required = false) ComplaintStatus status) {
        List<ComplaintResponse> complaints = status != null
                ? complaintService.getComplaintsByStatus(status)
                : complaintService.getAllComplaints();
        return ResponseEntity.ok(ApiResponse.success("Complaints retrieved successfully", complaints));
    }

    @GetMapping("/{uuid}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get a specific complaint by UUID (Admin)")
    public ResponseEntity<ApiResponse<ComplaintResponse>> getComplaintById(@PathVariable String uuid) {
        ComplaintResponse complaint = complaintService.getComplaintById(uuid);
        return ResponseEntity.ok(ApiResponse.success("Complaint retrieved successfully", complaint));
    }

    @PutMapping("/{uuid}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update complaint status (Admin)")
    public ResponseEntity<ApiResponse<ComplaintResponse>> updateComplaintStatus(
            @PathVariable String uuid,
            @Valid @RequestBody ComplaintStatusUpdateRequest request) {
        ComplaintResponse response = complaintService.updateComplaintStatus(uuid, request);
        return ResponseEntity.ok(ApiResponse.success("Complaint status updated successfully", response));
    }
}
