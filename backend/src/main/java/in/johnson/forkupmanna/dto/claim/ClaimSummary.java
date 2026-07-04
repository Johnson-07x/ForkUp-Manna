package in.johnson.forkupmanna.dto.claim;

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
public class ClaimSummary {
    private String id;
    private DonationSummary donation;
    private UserSummary receiver;
    private ClaimStatus status;
}
