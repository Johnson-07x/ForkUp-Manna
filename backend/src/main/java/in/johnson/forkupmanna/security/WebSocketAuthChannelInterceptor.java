package in.johnson.forkupmanna.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketAuthChannelInterceptor implements ChannelInterceptor {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor =
                MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String authHeader = accessor.getFirstNativeHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                try {
                    if (jwtTokenProvider.validateToken(token)) {
                        Long userId = jwtTokenProvider.getUserIdFromToken(token);
                        // Principal name = userId — used by convertAndSendToUser routing
                        accessor.setUser(() -> String.valueOf(userId));
                        log.debug("[WS] Authenticated user {} via STOMP CONNECT", userId);
                    } else {
                        log.warn("[WS] Invalid JWT token in STOMP CONNECT");
                    }
                } catch (Exception e) {
                    log.warn("[WS] JWT validation failed for STOMP CONNECT: {}", e.getMessage());
                }
            } else {
                log.warn("[WS] No Authorization header in STOMP CONNECT");
            }
        }

        return message;
    }
}
