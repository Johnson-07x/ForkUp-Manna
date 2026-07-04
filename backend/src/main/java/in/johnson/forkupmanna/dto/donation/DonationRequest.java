package in.johnson.forkupmanna.dto.donation;

import in.johnson.forkupmanna.enums.FoodType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Food type is required")
    private FoodType foodType;

    @NotBlank(message = "Quantity is required")
    private String quantity;

    private Integer servesPeople;

    @NotNull(message = "Expiry time is required")
    private LocalDateTime expiryTime;

    @NotBlank(message = "Address is required")
    private String address;

    @NotBlank(message = "City is required")
    private String city;

    @NotBlank(message = "State is required")
    private String state;

    private String pincode;

    private BigDecimal latitude;

    private BigDecimal longitude;

    private String imageUrl;

    private String pickupInstructions;
}
