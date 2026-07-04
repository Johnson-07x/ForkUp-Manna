package in.johnson.forkupmanna.dto.complaint;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ComplaintResponse {
    private String id;
    private UserSummary complainant;
    private UserSummary reportedUser;
    private String donationId;
    private String donationTitle;
    private String subject;
    private String description;
    private String status;
    private String adminNotes;
    private String createdAt;
    private String updatedAt;

    @Data
    @Builder
    public static class UserSummary {
        private String id;
        private String name;
        private String email;
        private String role;
    }
}
