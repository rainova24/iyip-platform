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
    private String phone;
    private String userType;

    // RegularUser fields
    private String nim;
    private LocalDate birthDate;
    private String gender;
    private String province;
    private String city;

    // AdminUser fields
    private String department;
    private Integer accessLevel;

    // Metadata
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
