package in.johnson.forkupmanna.service;

import in.johnson.forkupmanna.dto.notification.NotificationResponse;
import in.johnson.forkupmanna.entity.User;
import in.johnson.forkupmanna.enums.NotificationType;
import org.springframework.data.domain.Page;

public interface NotificationService {
    void createNotification(User user, String title, String message, NotificationType type,
                            String referenceId, String referenceType);
    Page<NotificationResponse> getMyNotifications(int page, int size);
    void markAsRead(String notificationId);
    void markAllAsRead();
    long getUnreadCount();
}
