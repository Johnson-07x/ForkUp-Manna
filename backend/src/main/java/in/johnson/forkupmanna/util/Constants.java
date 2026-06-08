package in.johnson.forkupmanna.util;

import org.springframework.stereotype.Component;

@Component
public class Constants {
    public static final String API_BASE_PATH = "/api/v1";
    public static final String TOKEN_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";
    public static final long JWT_EXPIRATION = 86400000;
    public static final long REFRESH_TOKEN_EXPIRATION = 604800000;
}
