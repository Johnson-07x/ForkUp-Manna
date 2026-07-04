package in.johnson.forkupmanna.repository;

import in.johnson.forkupmanna.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRevieweeUuidOrderByCreatedAtDesc(String revieweeUuid);
    List<Review> findByReviewerUuidOrderByCreatedAtDesc(String reviewerUuid);
    boolean existsByReviewerUuidAndDonationDonationId(String reviewerUuid, String donationId);
    Optional<Review> findByUuid(String uuid);
}
