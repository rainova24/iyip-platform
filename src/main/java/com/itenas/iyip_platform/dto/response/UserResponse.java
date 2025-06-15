package com.itenas.iyip_platform.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponse {
    private Long userId;
    private String name;
    private String email;
    private String password;  // TAMBAH FIELD PASSWORD
    private String phone;
    private String userType;
    private String nim;
    private LocalDate birthDate;
    private String gender;
    private String province;
    private String city;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long roleId;      // TAMBAH FIELD ROLE ID
    private String roleName;  // TAMBAH FIELD ROLE NAME
}