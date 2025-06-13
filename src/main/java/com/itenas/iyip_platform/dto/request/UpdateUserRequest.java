package com.itenas.iyip_platform.dto.request;

import com.itenas.iyip_platform.entity.User;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UpdateUserRequest {

    @Size(min = 3, max = 100, message = "Name must be between 3-100 characters")
    private String name;

    @Size(max = 20, message = "Phone number must be max 20 characters")
    private String phone;

    @Size(max = 11, message = "NIM must be max 11 characters")
    private String nim;

    @Past(message = "Birth date must be in the past")
    private LocalDate birthDate;

    private User.Gender gender;

    @Size(max = 100, message = "Province must be max 100 characters")
    private String province;

    @Size(max = 100, message = "City must be max 100 characters")
    private String city;

    // Removed: department and accessLevel (tidak ada di TRD)
}