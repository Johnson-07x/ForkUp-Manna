package in.johnson.forkupmanna.scheduler;

import in.johnson.forkupmanna.service.DonationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DonationExpiryScheduler {

    private final DonationService donationService;

    @Scheduled(fixedDelay = 3_600_000) // every hour
    public void expireOverdueDonations() {
        log.debug("Running donation expiry check...");
        donationService.expireOverdueDonations();
    }
}
