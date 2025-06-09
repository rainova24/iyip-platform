package com.itenas.iyip_platform.controller;

import com.itenas.iyip_platform.dto.SubmissionDto;
import com.itenas.iyip_platform.model.entity.Submission;
import com.itenas.iyip_platform.security.UserDetailsImpl;
import com.itenas.iyip_platform.service.SubmissionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SubmissionDto>> getAllSubmissions() {
        return ResponseEntity.ok(submissionService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @submissionSecurity.isOwner(#userDetails.id, #id)")
    public ResponseEntity<SubmissionDto> getSubmissionById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(submissionService.findById(id));
    }

    @GetMapping("/my-submissions")
    public ResponseEntity<List<SubmissionDto>> getUserSubmissions(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(submissionService.findByUserId(userDetails.getId()));
    }

    @GetMapping("/by-status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<SubmissionDto>> getSubmissionsByStatus(
            @PathVariable Submission.SubmissionStatus status) {
        return ResponseEntity.ok(submissionService.findByStatus(status));
    }

    @PostMapping
    public ResponseEntity<SubmissionDto> createSubmission(
            @Valid @RequestBody SubmissionDto submissionDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        submissionDto.setUserId(userDetails.getId());
        return new ResponseEntity<>(submissionService.save(submissionDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @submissionSecurity.isOwner(#userDetails.id, #id)")
    public ResponseEntity<SubmissionDto> updateSubmission(
            @PathVariable Long id,
            @Valid @RequestBody SubmissionDto submissionDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        submissionDto.setSubmissionId(id);
        if (!userDetails.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"))) {
            submissionDto.setUserId(userDetails.getId());
        }
        return ResponseEntity.ok(submissionService.save(submissionDto));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<SubmissionDto> updateSubmissionStatus(
            @PathVariable Long id,
            @RequestParam Submission.SubmissionStatus status) {
        return ResponseEntity.ok(submissionService.updateStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @submissionSecurity.isOwner(#userDetails.id, #id)")
    public ResponseEntity<Void> deleteSubmission(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        submissionService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}