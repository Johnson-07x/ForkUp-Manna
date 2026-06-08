package in.johnson.forkupmanna.service.impl;

import in.johnson.forkupmanna.dto.AuthResponse;
import in.johnson.forkupmanna.dto.LoginRequest;
import in.johnson.forkupmanna.dto.RefreshTokenRequest;
import in.johnson.forkupmanna.dto.RegisterRequest;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .user(mapToUserResponse(savedUser))
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
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(mapToUserResponse(user))
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
                .accessToken(newAccessToken)
                .build();
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .uuid(user.getUuid())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole().toString())
                .status(user.getStatus())
                .build();
    }
}
