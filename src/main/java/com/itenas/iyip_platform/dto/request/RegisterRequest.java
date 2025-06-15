package com.itenas.iyip_platform.dto.request;

import com.itenas.iyip_platform.entity.User;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3-100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String email;

    @Size(max = 11, message = "NIM must be max 11 characters")
    private String nim;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    @Size(max = 20, message = "Phone number must be max 20 characters")
    private String phone;

    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    private User.Gender gender;

    @Size(max = 100, message = "Province must be max 100 characters")
    private String province;

    @Size(max = 100, message = "City must be max 100 characters")
    private String city;
}