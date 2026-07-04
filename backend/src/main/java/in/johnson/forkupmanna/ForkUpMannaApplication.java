package in.johnson.forkupmanna;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class ForkUpMannaApplication {

    public static void main(String[] args) {
        SpringApplication.run(ForkUpMannaApplication.class, args);
    }
}
