package in.johnson.forkupmanna.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private String id; // = uuid externally
    private String name;
    private String email;
    private String phone;
    private String role;
    private String status;
    private String createdAt;
}
