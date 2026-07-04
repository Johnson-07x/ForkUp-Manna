package in.johnson.forkupmanna.repository;

import in.johnson.forkupmanna.entity.Donation;
import in.johnson.forkupmanna.entity.User;
import in.johnson.forkupmanna.enums.DonationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface DonationRepository extends JpaRepository<Donation, Long>, JpaSpecificationExecutor<Donation> {

    Optional<Donation> findByDonationId(String donationId);

    List<Donation> findByDonorOrderByCreatedAtDesc(User donor);

    Page<Donation> findByStatusOrderByCreatedAtDesc(DonationStatus status, Pageable pageable);

    Page<Donation> findByStatusAndCityIgnoreCaseOrderByCreatedAtDesc(DonationStatus status, String city, Pageable pageable);

    List<Donation> findByStatusAndExpiryTimeBefore(DonationStatus status, LocalDateTime expiryTime);

    long countByStatus(DonationStatus status);

    long countByDonor(User donor);
}
