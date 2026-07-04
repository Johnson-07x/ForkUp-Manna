package in.johnson.forkupmanna.dto.review;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewResponse {
    private String id;
    private ReviewerSummary reviewer;
    private ReviewerSummary reviewee;
    private String donationId;
    private String donationTitle;
    private Integer rating;
    private String comment;
    private String createdAt;

    @Data
    @Builder
    public static class ReviewerSummary {
        private String id;
        private String name;
        private String role;
    }
}
