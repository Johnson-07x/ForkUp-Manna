package in.johnson.forkupmanna.controller;

import in.johnson.forkupmanna.common.ApiResponse;
import in.johnson.forkupmanna.dto.UserResponse;
import in.johnson.forkupmanna.dto.user.UpdateProfileRequest;
import in.johnson.forkupmanna.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile() {
        UserResponse response = userService.getMyProfile();
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved successfully", response));
    }

    @PutMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> updateMyProfile(@RequestBody UpdateProfileRequest request) {
        UserResponse response = userService.updateMyProfile(request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @PutMapping("/{uuid}/suspend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> suspendUser(@PathVariable String uuid) {
        UserResponse response = userService.suspendUser(uuid);
        return ResponseEntity.ok(ApiResponse.success("User suspended successfully", response));
    }

    @PutMapping("/{uuid}/unsuspend")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> unsuspendUser(@PathVariable String uuid) {
        UserResponse response = userService.unsuspendUser(uuid);
        return ResponseEntity.ok(ApiResponse.success("User unsuspended successfully", response));
    }
}
