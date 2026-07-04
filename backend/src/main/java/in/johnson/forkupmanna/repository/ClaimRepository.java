package in.johnson.forkupmanna.repository;

import in.johnson.forkupmanna.entity.Claim;
import in.johnson.forkupmanna.entity.Donation;
import in.johnson.forkupmanna.entity.User;
import in.johnson.forkupmanna.enums.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long>, JpaSpecificationExecutor<Claim> {

    Optional<Claim> findByClaimId(String claimId);

    List<Claim> findByReceiverOrderByCreatedAtDesc(User receiver);

    List<Claim> findByDonation_DonorOrderByCreatedAtDesc(User donor);

    Optional<Claim> findByDonationAndReceiver(Donation donation, User receiver);

    List<Claim> findByDonationAndStatus(Donation donation, ClaimStatus status);

    boolean existsByDonationAndReceiverAndStatusNot(Donation donation, User receiver, ClaimStatus status);

    long countByStatus(ClaimStatus status);

    long countByReceiver(User receiver);
}
