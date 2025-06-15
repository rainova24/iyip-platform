package com.itenas.iyip_platform.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class JournalResponse {
    private Long journalId;
    private Long userId;
    private String userName;
    private String title;
    private String content;
    private String thumbnailUrl;
    private Boolean isPublic; // true = public, false = private
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}