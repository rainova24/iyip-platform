package com.itenas.iyip_platform.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CreateEventRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be max 150 characters")
    private String title;

    @Size(max = 5000, message = "Description must be max 5000 characters")
    private String description;

    @NotNull(message = "Start date is required")
    @Future(message = "Start date must be in the future")
    private LocalDate startDate;

    @NotNull(message = "End date is required")
    @Future(message = "End date must be in the future")
    private LocalDate endDate;

    @Future(message = "Registration deadline must be in the future")
    private LocalDate registrationDeadline;
}