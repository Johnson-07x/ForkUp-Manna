package in.johnson.forkupmanna.util;

import in.johnson.forkupmanna.entity.Donation;
import in.johnson.forkupmanna.enums.DonationStatus;
import in.johnson.forkupmanna.enums.FoodType;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class DonationSpecification {

    public static Specification<Donation> search(
            String keyword,
            FoodType foodType,
            String city,
            String state,
            Integer expiresWithinHours) {

        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(cb.equal(root.get("status"), DonationStatus.AVAILABLE));

            if (keyword != null && !keyword.isBlank()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), pattern),
                        cb.like(cb.lower(root.get("description")), pattern)
                ));
            }

            if (foodType != null) {
                predicates.add(cb.equal(root.get("foodType"), foodType));
            }

            if (city != null && !city.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("city")), "%" + city.trim().toLowerCase() + "%"));
            }

            if (state != null && !state.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("state")), "%" + state.trim().toLowerCase() + "%"));
            }

            if (expiresWithinHours != null && expiresWithinHours > 0) {
                predicates.add(cb.lessThanOrEqualTo(
                        root.get("expiryTime"),
                        LocalDateTime.now().plusHours(expiresWithinHours)
                ));
            }

            query.orderBy(cb.desc(root.get("createdAt")));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
