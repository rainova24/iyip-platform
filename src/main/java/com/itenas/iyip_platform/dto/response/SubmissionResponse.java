package com.itenas.iyip_platform.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SubmissionResponse {
    private Long submissionId;
    private Long userId;
    private String userName;
    private String type; // MATERIAL or FASILITAS
    private String title;
    private String content;
    private String fileUrl;
    private String status; // PENDING, APPROVED, REJECTED
    private LocalDateTime submittedAt;
    private LocalDateTime updatedAt;
}