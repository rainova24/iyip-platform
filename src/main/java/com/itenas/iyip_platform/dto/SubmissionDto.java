package com.itenas.iyip_platform.dto;

import com.itenas.iyip_platform.model.entity.Submission;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class SubmissionDto {
    private Long submissionId;
    private Long userId;
    private String userName;

    @NotNull(message = "Type is required")
    private Submission.SubmissionType type;

    @NotBlank(message = "Title is required")
    private String title;

    private String content;
    private String fileUrl;
    private LocalDateTime submittedAt;

    @NotNull(message = "Status is required")
    private Submission.SubmissionStatus status = Submission.SubmissionStatus.PENDING;
}