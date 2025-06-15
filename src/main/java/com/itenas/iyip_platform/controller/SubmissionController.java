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

    // ===== PUBLIC/USER ENDPOINTS =====

    /**
     * Create new submission (User & Admin)
     * POST /api/submissions
     */
    @PostMapping
    public ResponseEntity<?> createSubmission(
            @Valid @RequestBody CreateSubmissionRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            log.info("User {} creating submission with type: {}", userDetails.getId(), request.getType());
            SubmissionResponse submission = submissionService.create(userDetails.getId(), request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Submission created successfully", submission));
        } catch (Exception e) {
            log.error("Error creating submission for user {}", userDetails.getId(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create submission: " + e.getMessage()));
        }
    }

    /**
     * Get specific submission by ID (Owner or Admin only)
     * GET /api/submissions/{id}
     */
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

            return ResponseEntity.ok(ApiResponse.success("Submission retrieved successfully", submission));
        } catch (Exception e) {
            log.error("Error getting submission with id: {}", id, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Submission not found"));
        }
    }

    /**
     * Get current user's submissions
     * GET /api/submissions/my-submissions
     */
    @GetMapping("/my-submissions")
    public ResponseEntity<?> getUserSubmissions(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            List<SubmissionResponse> submissions = submissionService.findByUserId(userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success("User submissions retrieved successfully", submissions));
        } catch (Exception e) {
            log.error("Error getting submissions for user {}", userDetails.getId(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get submissions"));
        }
    }

    /**
     * Get submissions by type (Public access)
     * GET /api/submissions/by-type/{type}
     */
    @GetMapping("/by-type/{type}")
    public ResponseEntity<?> getSubmissionsByType(@PathVariable String type) {
        try {
            Submission.SubmissionType submissionType = Submission.SubmissionType.valueOf(type.toUpperCase());
            List<SubmissionResponse> submissions = submissionService.findByType(submissionType);
            return ResponseEntity.ok(ApiResponse.success("Submissions retrieved successfully", submissions));
        } catch (Exception e) {
            log.error("Error getting submissions by type: {}", type, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid type or failed to get submissions"));
        }
    }

    /**
     * Delete submission (Owner or Admin only)
     * DELETE /api/submissions/{id}
     */
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

            log.info("Deleting submission {} by user {}", id, userDetails.getId());
            submissionService.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success("Submission deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting submission {} by user {}", id, userDetails.getId(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete submission: " + e.getMessage()));
        }
    }

    // ===== ADMIN ONLY ENDPOINTS =====

    /**
     * Get all submissions (Admin only)
     * GET /api/submissions
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllSubmissions() {
        try {
            List<SubmissionResponse> submissions = submissionService.findAll();
            return ResponseEntity.ok(ApiResponse.success("All submissions retrieved successfully", submissions));
        } catch (Exception e) {
            log.error("Error getting all submissions", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get submissions"));
        }
    }

    /**
     * Get submissions by status (Admin only)
     * GET /api/submissions/by-status/{status}
     */
    @GetMapping("/by-status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSubmissionsByStatus(@PathVariable String status) {
        try {
            Submission.SubmissionStatus submissionStatus = Submission.SubmissionStatus.valueOf(status.toUpperCase());
            List<SubmissionResponse> submissions = submissionService.findByStatus(submissionStatus);
            return ResponseEntity.ok(ApiResponse.success("Submissions retrieved successfully", submissions));
        } catch (Exception e) {
            log.error("Error getting submissions by status: {}", status, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Invalid status or failed to get submissions"));
        }
    }

    /**
     * Update submission (Admin only)
     * PUT /api/submissions/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSubmission(
            @PathVariable Long id,
            @Valid @RequestBody UpdateSubmissionRequest request) {
        try {
            log.info("Admin updating submission with id: {}", id);
            SubmissionResponse submission = submissionService.update(id, request);
            return ResponseEntity.ok(ApiResponse.success("Submission updated successfully", submission));
        } catch (Exception e) {
            log.error("Error updating submission with id: {}", id, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update submission: " + e.getMessage()));
        }
    }

    /**
     * Update submission status (Admin only)
     * PUT /api/submissions/{id}/status
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateSubmissionStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        try {
            Submission.SubmissionStatus submissionStatus = Submission.SubmissionStatus.valueOf(status.toUpperCase());
            log.info("Admin updating submission {} status to: {}", id, submissionStatus);
            SubmissionResponse submission = submissionService.updateStatus(id, submissionStatus);
            return ResponseEntity.ok(ApiResponse.success("Submission status updated successfully", submission));
        } catch (Exception e) {
            log.error("Error updating status for submission {}", id, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update status: " + e.getMessage()));
        }
    }

    /**
     * Admin delete submission (any status)
     * DELETE /api/submissions/admin/{id}
     */
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminDeleteSubmission(@PathVariable Long id) {
        try {
            log.info("Admin deleting submission with id: {}", id);
            submissionService.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success("Submission deleted by admin", null));
        } catch (Exception e) {
            log.error("Error admin deleting submission with id: {}", id, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete submission: " + e.getMessage()));
        }
    }
}