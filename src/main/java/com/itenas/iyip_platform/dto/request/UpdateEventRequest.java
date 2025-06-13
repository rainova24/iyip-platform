package com.itenas.iyip_platform.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;

@Data
public class UpdateEventRequest {

    @Size(max = 150, message = "Title must be max 150 characters")
    private String title;

    @Size(max = 5000, message = "Description must be max 5000 characters")
    private String description;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate registrationDeadline;
}