package com.itenas.iyip_platform.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateJournalRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be max 150 characters")
    private String title;

    @Size(max = 10000, message = "Content must be max 10000 characters")
    private String content;

    private String thumbnailUrl; // Optional image/thumbnail for journal

    private Boolean isPublic = false; // Default private, user can choose to make public
}