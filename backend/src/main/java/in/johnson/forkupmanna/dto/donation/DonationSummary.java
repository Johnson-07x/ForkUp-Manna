package in.johnson.forkupmanna.dto.donation;

import in.johnson.forkupmanna.dto.UserSummary;
import in.johnson.forkupmanna.enums.DonationStatus;
import in.johnson.forkupmanna.enums.FoodType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DonationSummary {
    private String id;
    private String title;
    private String city;
    private String address;
    private DonationStatus status;
    private FoodType foodType;
    private UserSummary donor;
}
