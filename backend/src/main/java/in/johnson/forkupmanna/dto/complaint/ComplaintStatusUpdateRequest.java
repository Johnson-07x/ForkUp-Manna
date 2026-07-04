package in.johnson.forkupmanna.dto.complaint;

import in.johnson.forkupmanna.enums.ComplaintStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ComplaintStatusUpdateRequest {

    @NotNull(message = "Status is required")
    private ComplaintStatus status;

    @Size(max = 2000, message = "Admin notes must not exceed 2000 characters")
    private String adminNotes;
}
