package in.johnson.forkupmanna.dto.donation;

import in.johnson.forkupmanna.enums.FoodType;
import lombok.Data;

@Data
public class DonationSearchRequest {
    private String keyword;
    private FoodType foodType;
    private String city;
    private String state;
    private Integer expiresWithinHours;
    private int page = 0;
    private int size = 12;
}
