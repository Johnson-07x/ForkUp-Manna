package in.johnson.forkupmanna.dto.claim;

import com.fasterxml.jackson.annotation.JsonInclude;
import in.johnson.forkupmanna.dto.UserSummary;
import in.johnson.forkupmanna.dto.donation.DonationSummary;
import in.johnson.forkupmanna.enums.ClaimStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ClaimResponse {
    private String id;
    private DonationSummary donation;
    private UserSummary receiver;
    private UserSummary volunteer;
    private ClaimStatus status;
    private String notes;
    private String createdAt;
    private String updatedAt;
}
