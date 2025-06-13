package com.itenas.iyip_platform.dto.request;

import com.itenas.iyip_platform.entity.Submission;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class CreateSubmissionRequest {

    @NotNull(message = "Type is required")
    private Submission.SubmissionType type;

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title must be max 150 characters")
    private String title;

    @Size(max = 5000, message = "Content must be max 5000 characters")
    private String content;

    private String fileUrl;
}