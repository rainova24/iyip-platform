package com.itenas.iyip.dto.response;

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
    private String phone;
    private String userType; // Role name (ADMIN or USER)

    // User profile fields (sesuai TRD)
    private String nim;
    private LocalDate birthDate;
    private String gender;
    private String province;
    private String city;

    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // TAMBAHAN: Role information for debugging
    private Long roleId;        // Role ID untuk reference
    private String roleName;    // Role name (sama dengan userType)
}