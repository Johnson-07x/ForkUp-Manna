package in.johnson.forkupmanna.service;

import in.johnson.forkupmanna.dto.AuthResponse;
import in.johnson.forkupmanna.dto.LoginRequest;
import in.johnson.forkupmanna.dto.RefreshTokenRequest;
import in.johnson.forkupmanna.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
}
