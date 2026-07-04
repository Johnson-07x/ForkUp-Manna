package in.johnson.forkupmanna.service;

import in.johnson.forkupmanna.dto.complaint.ComplaintRequest;
import in.johnson.forkupmanna.dto.complaint.ComplaintResponse;
import in.johnson.forkupmanna.dto.complaint.ComplaintStatusUpdateRequest;
import in.johnson.forkupmanna.enums.ComplaintStatus;

import java.util.List;

public interface ComplaintService {
    ComplaintResponse fileComplaint(ComplaintRequest request);
    List<ComplaintResponse> getMyComplaints();
    List<ComplaintResponse> getAllComplaints();
    List<ComplaintResponse> getComplaintsByStatus(ComplaintStatus status);
    ComplaintResponse updateComplaintStatus(String complaintUuid, ComplaintStatusUpdateRequest request);
    ComplaintResponse getComplaintById(String complaintUuid);
}
