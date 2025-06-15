package com.itenas.iyip_platform.dto.request;

import com.itenas.iyip_platform.entity.Submission;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateSubmissionRequest {

    @Size(max = 150, message = "Title must be max 150 characters")
    private String title;

    @Size(max = 5000, message = "Content must be max 5000 characters")
    private String content;

    private String fileUrl;

    // Only admin can update status via separate endpoint
    private Submission.SubmissionStatus status;
}