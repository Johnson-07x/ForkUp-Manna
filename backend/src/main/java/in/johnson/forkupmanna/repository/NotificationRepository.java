package in.johnson.forkupmanna.repository;

import in.johnson.forkupmanna.entity.Notification;
import in.johnson.forkupmanna.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>, JpaSpecificationExecutor<Notification> {

    Optional<Notification> findByNotificationId(String notificationId);

    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);

    long countByUserAndIsRead(User user, boolean isRead);

    List<Notification> findByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
}
