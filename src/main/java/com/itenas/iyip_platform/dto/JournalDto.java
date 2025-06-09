package com.itenas.iyip_platform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JournalDto {
    private Long journalId;
    private Long userId;
    private String userName;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    private String thumbnailUrl;

    @NotNull(message = "Public status is required")
    private Boolean isPublic = false;

    private LocalDateTime createdAt;
}