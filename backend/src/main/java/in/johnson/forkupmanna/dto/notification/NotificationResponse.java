package in.johnson.forkupmanna.dto.notification;

import com.fasterxml.jackson.annotation.JsonInclude;
import in.johnson.forkupmanna.enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class NotificationResponse {
    private String id;
    private String title;
    private String message;
    private NotificationType type;
    private boolean read;
    private String referenceId;
    private String referenceType;
    private String createdAt;
}
