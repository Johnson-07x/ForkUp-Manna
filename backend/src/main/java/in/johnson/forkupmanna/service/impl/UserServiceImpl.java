package in.johnson.forkupmanna.service.impl;

import in.johnson.forkupmanna.dto.UserResponse;
import in.johnson.forkupmanna.dto.user.UpdateProfileRequest;
import in.johnson.forkupmanna.entity.User;
import in.johnson.forkupmanna.exception.AppException;
import in.johnson.forkupmanna.repository.UserRepository;
import in.johnson.forkupmanna.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserResponse getMyProfile() {
        User user = getCurrentUser();
        return mapToUserResponse(user);
    }

    @Override
    @Transactional
    public UserResponse updateMyProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        User saved = userRepository.save(user);
        log.info("Profile updated for user: {}", saved.getEmail());
        return mapToUserResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse suspendUser(String uuid) {
        User user = userRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        user.setStatus("SUSPENDED");
        User saved = userRepository.save(user);
        log.info("User suspended: {}", saved.getEmail());
        return mapToUserResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse unsuspendUser(String uuid) {
        User user = userRepository.findByUuid(uuid)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        user.setStatus("ACTIVE");
        User saved = userRepository.save(user);
        log.info("User unsuspended: {}", saved.getEmail());
        return mapToUserResponse(saved);
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
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
