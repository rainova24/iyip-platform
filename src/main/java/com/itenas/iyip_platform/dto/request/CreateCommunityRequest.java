package com.itenas.iyip_platform.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateCommunityRequest {

    @NotBlank(message = "Name is required")
    @Size(max = 100, message = "Name must be max 100 characters")
    private String name;

    @Size(max = 1000, message = "Description must be max 1000 characters")
    private String description;
}