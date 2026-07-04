package in.johnson.forkupmanna.repository;

import in.johnson.forkupmanna.entity.Claim;
import in.johnson.forkupmanna.entity.Delivery;
import in.johnson.forkupmanna.entity.User;
import in.johnson.forkupmanna.enums.DeliveryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long>, JpaSpecificationExecutor<Delivery> {

    Optional<Delivery> findByDeliveryId(String deliveryId);

    List<Delivery> findByVolunteerOrderByCreatedAtDesc(User volunteer);

    Optional<Delivery> findByClaim(Claim claim);

    List<Delivery> findByStatusOrderByCreatedAtDesc(DeliveryStatus status);

    List<Delivery> findByVolunteerIsNullAndStatusOrderByCreatedAtDesc(DeliveryStatus status);

    long countByVolunteer(User volunteer);

    long countByVolunteerAndStatus(User volunteer, DeliveryStatus status);
}
