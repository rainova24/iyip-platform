package com.itenas.iyip_platform.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateJournalRequest {

    @Size(max = 150, message = "Title must be max 150 characters")
    private String title;

    @Size(max = 10000, message = "Content must be max 10000 characters")
    private String content;

    private String thumbnailUrl;
    private Boolean isPublic;
}