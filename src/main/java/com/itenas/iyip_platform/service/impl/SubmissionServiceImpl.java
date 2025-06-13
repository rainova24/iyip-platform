package com.itenas.iyip_platform.service.impl;

import com.itenas.iyip_platform.dto.request.CreateSubmissionRequest;
import com.itenas.iyip_platform.dto.request.UpdateSubmissionRequest;
import com.itenas.iyip_platform.dto.response.SubmissionResponse;
import com.itenas.iyip_platform.entity.Submission;
import com.itenas.iyip_platform.entity.base.User;
import com.itenas.iyip_platform.exception.ResourceNotFoundException;
import com.itenas.iyip_platform.repository.SubmissionRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.service.SubmissionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    @Override
    public SubmissionResponse findById(Long id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        return mapToResponse(submission);
    }

    @Override
    public List<SubmissionResponse> findAll() {
        return submissionRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubmissionResponse> findByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return submissionRepository.findByUserOrderBySubmittedAtDesc(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubmissionResponse> findByStatus(Submission.SubmissionStatus status) {
        return submissionRepository.findByStatusOrderBySubmittedAtDesc(status).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubmissionResponse> findByType(Submission.SubmissionType type) {
        return submissionRepository.findByTypeOrderBySubmittedAtDesc(type).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SubmissionResponse create(Long userId, CreateSubmissionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Submission submission = new Submission();
        submission.setUser(user);
        submission.setType(request.getType());
        submission.setTitle(request.getTitle());
        submission.setContent(request.getContent());
        submission.setFileUrl(request.getFileUrl());
        submission.setStatus(Submission.SubmissionStatus.PENDING);

        Submission saved = submissionRepository.save(submission);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public SubmissionResponse update(Long id, UpdateSubmissionRequest request) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        if (request.getTitle() != null) {
            submission.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            submission.setContent(request.getContent());
        }
        if (request.getFileUrl() != null) {
            submission.setFileUrl(request.getFileUrl());
        }
        if (request.getStatus() != null) {
            submission.setStatus(request.getStatus());
        }

        Submission updated = submissionRepository.save(submission);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public SubmissionResponse updateStatus(Long id, Submission.SubmissionStatus status) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));

        submission.setStatus(status);
        Submission updated = submissionRepository.save(submission);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!submissionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Submission not found");
        }
        submissionRepository.deleteById(id);
    }

    @Override
    public boolean isOwner(Long submissionId, Long userId) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found"));
        return submission.getUser().getUserId().equals(userId);
    }

    private SubmissionResponse mapToResponse(Submission submission) {
        SubmissionResponse response = new SubmissionResponse();
        response.setSubmissionId(submission.getSubmissionId());
        response.setUserId(submission.getUser().getUserId());
        response.setUserName(submission.getUser().getName());
        response.setType(submission.getType().name());
        response.setTitle(submission.getTitle());
        response.setContent(submission.getContent());
        response.setFileUrl(submission.getFileUrl());
        response.setStatus(submission.getStatus().name());
        response.setSubmittedAt(submission.getSubmittedAt());
        response.setUpdatedAt(submission.getUpdatedAt());
        return response;
    }
}