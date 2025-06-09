package com.itenas.iyip_platform.service;

import com.itenas.iyip_platform.dto.SubmissionDto;
import com.itenas.iyip_platform.model.entity.Submission;

import java.util.List;

public interface SubmissionService {
    SubmissionDto findById(Long id);
    List<SubmissionDto> findAll();
    List<SubmissionDto> findByUserId(Long userId);
    List<SubmissionDto> findByStatus(Submission.SubmissionStatus status);
    List<SubmissionDto> findByType(Submission.SubmissionType type);
    SubmissionDto save(SubmissionDto submissionDto);
    SubmissionDto updateStatus(Long id, Submission.SubmissionStatus status);
    void deleteById(Long id);
}