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
    private String password; // Tambahan field untuk testing/development (password unhashed)
    private String phone;
    private String userType;

    // RegularUser fields
    private String nim;
    private LocalDate birthDate;
    private String gender;
    private String province;
    private String city;

    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Role information - field yang hilang sebelumnya
    private Long roleId;
    private String roleName;

    // Removed: department and accessLevel (tidak ada di TRD)
}