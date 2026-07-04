package in.johnson.forkupmanna.dto.donation;

import com.fasterxml.jackson.annotation.JsonInclude;
import in.johnson.forkupmanna.dto.UserSummary;
import in.johnson.forkupmanna.enums.DonationStatus;
import in.johnson.forkupmanna.enums.FoodType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DonationResponse {
    private String id;
    private UserSummary donor;
    private String title;
    private String description;
    private FoodType foodType;
    private String quantity;
    private Integer servesPeople;
    private String expiryTime;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private DonationStatus status;
    private String imageUrl;
    private String pickupInstructions;
    private String createdAt;
    private String updatedAt;
}
