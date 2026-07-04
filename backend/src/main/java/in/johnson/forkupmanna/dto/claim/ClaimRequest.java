package in.johnson.forkupmanna.dto.claim;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClaimRequest {

    @NotBlank(message = "Donation ID is required")
    private String donationId;

    private String notes;
}
