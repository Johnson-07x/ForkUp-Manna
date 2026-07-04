package in.johnson.forkupmanna.service.impl;

import in.johnson.forkupmanna.dto.AuthResponse;
import in.johnson.forkupmanna.dto.ChangePasswordRequest;
import in.johnson.forkupmanna.dto.ForgotPasswordRequest;
import in.johnson.forkupmanna.dto.LoginRequest;
import in.johnson.forkupmanna.dto.RefreshTokenRequest;
import in.johnson.forkupmanna.dto.RegisterRequest;
import in.johnson.forkupmanna.dto.ResetPasswordRequest;
import in.johnson.forkupmanna.dto.UserResponse;
import in.johnson.forkupmanna.entity.User;
import in.johnson.forkupmanna.enums.UserRole;
import in.johnson.forkupmanna.exception.AppException;
import in.johnson.forkupmanna.repository.UserRepository;
import in.johnson.forkupmanna.security.JwtTokenProvider;
import in.johnson.forkupmanna.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public AuthResponse register(RegisterRequest request) {
        log.info("Registering user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email already registered", HttpStatus.BAD_REQUEST);
        }

        try {
            UserRole role = UserRole.valueOf(request.getRole().toUpperCase());

            User user = User.builder()
                    .name(request.getName())
                    .email(request.getEmail())
                    .password(passwordEncoder.encode(request.getPassword()))
                    .phone(request.getPhone())
                    .role(role)
                    .status("ACTIVE")
                    .build();

            User savedUser = userRepository.save(user);
            log.info("User registered successfully with id: {}", savedUser.getId());

            String accessToken = jwtTokenProvider.generateAccessToken(savedUser);
            String refreshToken = jwtTokenProvider.generateRefreshToken(savedUser);

            return AuthResponse.builder()
                    .success(true)
                    .message("Registration successful")
                    .data(AuthResponse.AuthData.builder()
                            .accessToken(accessToken)
                            .refreshToken(refreshToken)
                            .user(mapToUserResponse(savedUser))
                            .build())
                    .build();
        } catch (IllegalArgumentException e) {
            throw new AppException("Invalid role: " + request.getRole(), HttpStatus.BAD_REQUEST);
        }
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        log.info("Authenticating user with email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException("Invalid email or password", HttpStatus.UNAUTHORIZED);
        }

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshToken = jwtTokenProvider.generateRefreshToken(user);

        log.info("User authenticated successfully with id: {}", user.getId());

        return AuthResponse.builder()
                .success(true)
                .message("Login successful")
                .data(AuthResponse.AuthData.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .user(mapToUserResponse(user))
                        .build())
                .build();
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        log.info("Refreshing token");

        if (!jwtTokenProvider.validateToken(request.getRefreshToken())) {
            throw new AppException("Invalid or expired refresh token", HttpStatus.UNAUTHORIZED);
        }

        String email = jwtTokenProvider.getEmailFromToken(request.getRefreshToken());
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        String newAccessToken = jwtTokenProvider.generateAccessToken(user);

        return AuthResponse.builder()
                .success(true)
                .message("Token refreshed successfully")
                .data(AuthResponse.AuthData.builder()
                        .accessToken(newAccessToken)
                        .build())
                .build();
    }

    @Override
    public String forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return "If an account exists with that email, a reset link has been sent.";
        }
        String token = UUID.randomUUID().toString();
        user.setPasswordResetToken(token);
        user.setPasswordResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);
        log.info("Password reset token generated for: {}", request.getEmail());
        return token;
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new AppException("Invalid or expired reset token", HttpStatus.BAD_REQUEST));

        if (user.getPasswordResetTokenExpiry() == null ||
                user.getPasswordResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new AppException("Reset token has expired. Please request a new one.", HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetTokenExpiry(null);
        userRepository.save(user);
        log.info("Password reset successfully for: {}", user.getEmail());
    }

    @Override
    public void changePassword(ChangePasswordRequest request) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException("Current password is incorrect", HttpStatus.BAD_REQUEST);
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed for user: {}", email);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getUuid())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().toString())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt() != null
                        ? user.getCreatedAt().format(DateTimeFormatter.ISO_DATE_TIME)
                        : null)
                .build();
    }
}
