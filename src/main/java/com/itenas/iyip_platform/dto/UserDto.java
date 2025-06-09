package com.itenas.iyip_platform.dto;

import com.itenas.iyip_platform.model.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class UserDto {
    private Long userId;

    @NotBlank(message = "Name is required")
    private String name;

    @Size(max = 11, message = "NIM must be at most 11 characters")
    private String nim;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    private LocalDate birthDate;
    private User.Gender gender;
    private String phone;
    private String province;
    private String city;
    private LocalDateTime registeredAt;
    private LocalDateTime updatedAt;

    private String roleName;
    private Long roleId;
}