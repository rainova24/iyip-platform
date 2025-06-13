package com.itenas.iyip_platform.dto.request;

import com.itenas.iyip_platform.entity.RegularUser;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 3, max = 100, message = "Name must be between 3-100 characters")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[a-zA-Z]).*$",
            message = "Password must contain letters and numbers")
    private String password;

    @Size(max = 11, message = "NIM must be max 11 characters")
    private String nim;

    @Size(max = 20, message = "Phone number must be max 20 characters")
    private String phone;

    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    private RegularUser.Gender gender;

    @Size(max = 100, message = "Province must be max 100 characters")
    private String province;

    @Size(max = 100, message = "City must be max 100 characters")
    private String city;

    // For admin registration (optional)
    private String userType = "REGULAR"; // Default REGULAR, bisa ADMIN
    private String department; // Untuk admin
    private Integer accessLevel; // Untuk admin
}