package com.itenas.iyip_platform.controller;

import com.itenas.iyip_platform.dto.request.CreateSubmissionRequest;
import com.itenas.iyip_platform.dto.request.UpdateSubmissionRequest;
import com.itenas.iyip_platform.dto.response.SubmissionResponse;
import com.itenas.iyip_platform.dto.response.ApiResponse;
import com.itenas.iyip_platform.entity.Submission;
import com.itenas.iyip_platform.security.UserDetailsImpl;
import com.itenas.iyip_platform.service.SubmissionService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
@Slf4j
public class SubmissionController {

    private final SubmissionService submissionService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllSubmissions() {
        try {
            List<SubmissionResponse> submissions = submissionService.findAll();
            return ResponseEntity.ok(ApiResponse.success("Submissions retrieved", submissions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get submissions"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSubmissionById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            SubmissionResponse submission = submissionService.findById(id);

            // Check if user is owner or admin
            if (!submission.getUserId().equals(userDetails.getId()) &&
                    !userDetails.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Access denied"));
            }

            return ResponseEntity.ok(ApiResponse.success("Submission retrieved", submission));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Submission not found"));
        }
    }

    @GetMapping("/my-submissions")
    public ResponseEntity<?> getUserSubmissions(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            List<SubmissionResponse> submissions = submissionService.findByUserId(userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success("User submissions retrieved", submissions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get submissions"));
        }
    }

    @GetMapping("/by-status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSubmissionsByStatus(@PathVariable String status) {
        try {
            Submission.SubmissionStatus submissionStatus = Submission.SubmissionStatus.valueOf(status.toUpperCase());
            List<SubmissionResponse> submissions = submissionService.findByStatus(submissionStatus);
            return ResponseEntity.ok(ApiResponse.success("Submissions retrieved", submissions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid status or failed to get submissions"));
        }
    }

    @GetMapping("/by-type/{type}")
    public ResponseEntity<?> getSubmissionsByType(@PathVariable String type) {
        try {
            Submission.SubmissionType submissionType = Submission.SubmissionType.valueOf(type.toUpperCase());
            List<SubmissionResponse> submissions = submissionService.findByType(submissionType);
            return ResponseEntity.ok(ApiResponse.success("Submissions retrieved", submissions));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid type or failed to get submissions"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createSubmission(
            @Valid @RequestBody CreateSubmissionRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            SubmissionResponse submission = submissionService.create(userDetails.getId(), request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Submission created", submission));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create submission"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubmission(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSubmissionRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            // Check if user is owner or admin
            if (!submissionService.isOwner(id, userDetails.getId()) &&
                    !userDetails.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Access denied"));
            }

            SubmissionResponse submission = submissionService.update(id, request);
            return ResponseEntity.ok(ApiResponse.success("Submission updated", submission));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update submission"));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSubmissionStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Submission.SubmissionStatus submissionStatus = Submission.SubmissionStatus.valueOf(status.toUpperCase());
            SubmissionResponse submission = submissionService.updateStatus(id, submissionStatus);
            return ResponseEntity.ok(ApiResponse.success("Status updated", submission));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update status"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubmission(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            // Check if user is owner or admin
            if (!submissionService.isOwner(id, userDetails.getId()) &&
                    !userDetails.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Access denied"));
            }

            submissionService.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success("Submission deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete submission"));
        }
    }
}