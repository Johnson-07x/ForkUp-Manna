package in.johnson.forkupmanna.service;

import in.johnson.forkupmanna.dto.UserResponse;
import in.johnson.forkupmanna.dto.user.UpdateProfileRequest;

import java.util.List;

public interface UserService {
    UserResponse getMyProfile();
    UserResponse updateMyProfile(UpdateProfileRequest request);
    List<UserResponse> getAllUsers();
    UserResponse suspendUser(String uuid);
    UserResponse unsuspendUser(String uuid);
}
