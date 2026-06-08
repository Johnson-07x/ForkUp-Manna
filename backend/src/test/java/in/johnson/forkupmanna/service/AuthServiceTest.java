package in.johnson.forkupmanna.service;

import in.johnson.forkupmanna.dto.AuthResponse;
import in.johnson.forkupmanna.dto.LoginRequest;
import in.johnson.forkupmanna.dto.RegisterRequest;
import in.johnson.forkupmanna.dto.RefreshTokenRequest;
import in.johnson.forkupmanna.entity.User;
import in.johnson.forkupmanna.enums.UserRole;
import in.johnson.forkupmanna.exception.AppException;
import in.johnson.forkupmanna.repository.UserRepository;
import in.johnson.forkupmanna.security.JwtTokenProvider;
import in.johnson.forkupmanna.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @InjectMocks
    private AuthServiceImpl authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User testUser;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .name("John Doe")
                .email("john@example.com")
                .password("password123")
                .phone("9876543210")
                .role("DONOR")
                .build();

        loginRequest = LoginRequest.builder()
                .email("john@example.com")
                .password("password123")
                .build();

        testUser = User.builder()
                .id(1L)
                .uuid("test-uuid")
                .name("John Doe")
                .email("john@example.com")
                .password("encoded-password")
                .phone("9876543210")
                .role(UserRole.DONOR)
                .status("ACTIVE")
                .build();
    }

    @Test
    void testRegisterSuccess() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(registerRequest.getPassword())).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtTokenProvider.generateAccessToken(testUser)).thenReturn("access-token");
        when(jwtTokenProvider.generateRefreshToken(testUser)).thenReturn("refresh-token");

        AuthResponse response = authService.register(registerRequest);

        assertTrue(response.isSuccess());
        assertEquals("Registration successful", response.getMessage());
        assertNotNull(response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterDuplicateEmail() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        AppException exception = assertThrows(AppException.class, () -> {
            authService.register(registerRequest);
        });

        assertEquals("Email already registered", exception.getMessage());
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    }

    @Test
    void testRegisterInvalidRole() {
        RegisterRequest invalidRequest = RegisterRequest.builder()
                .name("John Doe")
                .email("john@example.com")
                .password("password123")
                .role("INVALID_ROLE")
                .build();

        when(userRepository.existsByEmail(invalidRequest.getEmail())).thenReturn(false);

        AppException exception = assertThrows(AppException.class, () -> {
            authService.register(invalidRequest);
        });

        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatus());
    }

    @Test
    void testLoginSuccess() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), testUser.getPassword())).thenReturn(true);
        when(jwtTokenProvider.generateAccessToken(testUser)).thenReturn("access-token");
        when(jwtTokenProvider.generateRefreshToken(testUser)).thenReturn("refresh-token");

        AuthResponse response = authService.login(loginRequest);

        assertTrue(response.isSuccess());
        assertEquals("Login successful", response.getMessage());
        assertNotNull(response.getAccessToken());
        assertNotNull(response.getRefreshToken());
    }

    @Test
    void testLoginUserNotFound() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.empty());

        AppException exception = assertThrows(AppException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("Invalid email or password", exception.getMessage());
        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatus());
    }

    @Test
    void testLoginInvalidPassword() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(loginRequest.getPassword(), testUser.getPassword())).thenReturn(false);

        AppException exception = assertThrows(AppException.class, () -> {
            authService.login(loginRequest);
        });

        assertEquals("Invalid email or password", exception.getMessage());
        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatus());
    }

    @Test
    void testRefreshTokenSuccess() {
        RefreshTokenRequest refreshRequest = RefreshTokenRequest.builder()
                .refreshToken("refresh-token")
                .build();

        when(jwtTokenProvider.validateToken(refreshRequest.getRefreshToken())).thenReturn(true);
        when(jwtTokenProvider.getEmailFromToken(refreshRequest.getRefreshToken())).thenReturn("john@example.com");
        when(userRepository.findByEmail("john@example.com")).thenReturn(Optional.of(testUser));
        when(jwtTokenProvider.generateAccessToken(testUser)).thenReturn("new-access-token");

        AuthResponse response = authService.refreshToken(refreshRequest);

        assertTrue(response.isSuccess());
        assertEquals("Token refreshed successfully", response.getMessage());
        assertNotNull(response.getAccessToken());
    }

    @Test
    void testRefreshTokenInvalid() {
        RefreshTokenRequest refreshRequest = RefreshTokenRequest.builder()
                .refreshToken("invalid-token")
                .build();

        when(jwtTokenProvider.validateToken(refreshRequest.getRefreshToken())).thenReturn(false);

        AppException exception = assertThrows(AppException.class, () -> {
            authService.refreshToken(refreshRequest);
        });

        assertEquals("Invalid or expired refresh token", exception.getMessage());
        assertEquals(HttpStatus.UNAUTHORIZED, exception.getStatus());
    }
}
