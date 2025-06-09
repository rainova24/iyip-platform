package com.itenas.iyip_platform.service.impl;

import com.itenas.iyip_platform.dto.SubmissionDto;
import com.itenas.iyip_platform.exception.ResourceNotFoundException;
import com.itenas.iyip_platform.model.entity.Submission;
import com.itenas.iyip_platform.model.entity.User;
import com.itenas.iyip_platform.repository.SubmissionRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    @Override
    public SubmissionDto findById(Long id) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + id));
        return mapToDto(submission);
    }

    @Override
    public List<SubmissionDto> findAll() {
        return submissionRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubmissionDto> findByUserId(Long userId) {
        return submissionRepository.findByUserUserIdOrderBySubmittedAtDesc(userId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubmissionDto> findByStatus(Submission.SubmissionStatus status) {
        return submissionRepository.findByStatusOrderBySubmittedAtDesc(status).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubmissionDto> findByType(Submission.SubmissionType type) {
        return submissionRepository.findByTypeOrderBySubmittedAtDesc(type).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public SubmissionDto save(SubmissionDto submissionDto) {
        Submission submission;
        if (submissionDto.getSubmissionId() != null) {
            submission = submissionRepository.findById(submissionDto.getSubmissionId())
                    .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + submissionDto.getSubmissionId()));
        } else {
            submission = new Submission();
            submission.setSubmittedAt(LocalDateTime.now());
        }

        User user = userRepository.findById(submissionDto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + submissionDto.getUserId()));

        submission.setUser(user);
        submission.setType(submissionDto.getType());
        submission.setTitle(submissionDto.getTitle());
        submission.setContent(submissionDto.getContent());
        submission.setFileUrl(submissionDto.getFileUrl());
        submission.setStatus(submissionDto.getStatus());

        Submission savedSubmission = submissionRepository.save(submission);
        return mapToDto(savedSubmission);
    }

    @Override
    @Transactional
    public SubmissionDto updateStatus(Long id, Submission.SubmissionStatus status) {
        Submission submission = submissionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + id));

        submission.setStatus(status);
        Submission savedSubmission = submissionRepository.save(submission);
        return mapToDto(savedSubmission);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!submissionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Submission not found with id: " + id);
        }
        submissionRepository.deleteById(id);
    }

    private SubmissionDto mapToDto(Submission submission) {
        SubmissionDto dto = new SubmissionDto();
        dto.setSubmissionId(submission.getSubmissionId());
        dto.setUserId(submission.getUser().getUserId());
        dto.setUserName(submission.getUser().getName());
        dto.setType(submission.getType());
        dto.setTitle(submission.getTitle());
        dto.setContent(submission.getContent());
        dto.setFileUrl(submission.getFileUrl());
        dto.setSubmittedAt(submission.getSubmittedAt());
        dto.setStatus(submission.getStatus());
        return dto;
    }
}