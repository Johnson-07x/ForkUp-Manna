package in.johnson.forkupmanna.dto.delivery;

import com.fasterxml.jackson.annotation.JsonInclude;
import in.johnson.forkupmanna.dto.UserSummary;
import in.johnson.forkupmanna.dto.claim.ClaimSummary;
import in.johnson.forkupmanna.enums.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DeliveryResponse {
    private String id;
    private ClaimSummary claim;
    private UserSummary volunteer;
    private DeliveryStatus status;
    private String pickupTime;
    private String deliveryTime;
    private String notes;
    private String createdAt;
    private String updatedAt;
}
