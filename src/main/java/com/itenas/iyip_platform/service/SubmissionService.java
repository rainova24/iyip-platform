package com.itenas.iyip_platform.service;

import com.itenas.iyip_platform.dto.request.CreateSubmissionRequest;
import com.itenas.iyip_platform.dto.request.UpdateSubmissionRequest;
import com.itenas.iyip_platform.dto.response.SubmissionResponse;
import com.itenas.iyip_platform.entity.Submission;

import java.util.List;

public interface SubmissionService {
    SubmissionResponse findById(Long id);
    List<SubmissionResponse> findAll();
    List<SubmissionResponse> findByUserId(Long userId);
    List<SubmissionResponse> findByStatus(Submission.SubmissionStatus status);
    List<SubmissionResponse> findByType(Submission.SubmissionType type);
    SubmissionResponse create(Long userId, CreateSubmissionRequest request);
    SubmissionResponse update(Long id, UpdateSubmissionRequest request);
    SubmissionResponse updateStatus(Long id, Submission.SubmissionStatus status);
    void deleteById(Long id);
    boolean isOwner(Long submissionId, Long userId);
}