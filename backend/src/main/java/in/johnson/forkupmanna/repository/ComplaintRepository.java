package in.johnson.forkupmanna.repository;

import in.johnson.forkupmanna.entity.Complaint;
import in.johnson.forkupmanna.enums.ComplaintStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {
    List<Complaint> findByComplainantUuidOrderByCreatedAtDesc(String complainantUuid);
    List<Complaint> findByReportedUserUuidOrderByCreatedAtDesc(String reportedUserUuid);
    List<Complaint> findAllByOrderByCreatedAtDesc();
    List<Complaint> findByStatusOrderByCreatedAtDesc(ComplaintStatus status);
    Optional<Complaint> findByUuid(String uuid);
}
