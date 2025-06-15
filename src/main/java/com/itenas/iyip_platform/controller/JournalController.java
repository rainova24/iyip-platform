package com.itenas.iyip_platform.controller;

import com.itenas.iyip_platform.dto.request.CreateJournalRequest;
import com.itenas.iyip_platform.dto.request.UpdateJournalRequest;
import com.itenas.iyip_platform.dto.response.JournalResponse;
import com.itenas.iyip_platform.dto.response.ApiResponse;
import com.itenas.iyip_platform.security.UserDetailsImpl;
import com.itenas.iyip_platform.service.JournalService;

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
@RequestMapping("/api/journals")
@RequiredArgsConstructor
@Slf4j
public class JournalController {

    private final JournalService journalService;

    // ===== PUBLIC ENDPOINTS =====

    /**
     * Get public journals (No authentication required)
     * GET /api/journals/public
     */
    @GetMapping("/public")
    public ResponseEntity<?> getPublicJournals() {
        try {
            List<JournalResponse> journals = journalService.findPublicJournals();
            return ResponseEntity.ok(ApiResponse.success("Public journals retrieved successfully", journals));
        } catch (Exception e) {
            log.error("Error getting public journals", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get public journals"));
        }
    }

    /**
     * Get specific journal by ID (Public journals or owner/admin access)
     * GET /api/journals/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getJournalById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            JournalResponse journal = journalService.findById(id);

            // If journal is public, anyone can read it (even without auth)
            if (journal.getIsPublic()) {
                return ResponseEntity.ok(ApiResponse.success("Public journal retrieved successfully", journal));
            }

            // Private journal - requires authentication and ownership/admin
            if (userDetails == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Authentication required for private journals"));
            }

            // Check if user is owner or admin for private journals
            if (!journal.getUserId().equals(userDetails.getId()) &&
                    !userDetails.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Access denied - Journal is private"));
            }

            return ResponseEntity.ok(ApiResponse.success("Journal retrieved successfully", journal));
        } catch (Exception e) {
            log.error("Error getting journal with id: {}", id, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Journal not found"));
        }
    }

    // ===== USER ENDPOINTS =====

    /**
     * Create new journal (User & Admin)
     * POST /api/journals
     */
    @PostMapping
    public ResponseEntity<?> createJournal(
            @Valid @RequestBody CreateJournalRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            log.info("User {} creating journal with title: {}", userDetails.getId(), request.getTitle());
            JournalResponse journal = journalService.create(userDetails.getId(), request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Journal created successfully", journal));
        } catch (Exception e) {
            log.error("Error creating journal for user {}", userDetails.getId(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create journal: " + e.getMessage()));
        }
    }

    /**
     * Get current user's journals
     * GET /api/journals/my-journals
     */
    @GetMapping("/my-journals")
    public ResponseEntity<?> getUserJournals(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            List<JournalResponse> journals = journalService.findByUserId(userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success("User journals retrieved successfully", journals));
        } catch (Exception e) {
            log.error("Error getting journals for user {}", userDetails.getId(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get user journals"));
        }
    }

    /**
     * Update journal (Owner only)
     * PUT /api/journals/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateJournal(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJournalRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            // Check if user is owner (not admin for regular update)
            if (!journalService.isOwner(id, userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Access denied - You can only update your own journals"));
            }

            log.info("User {} updating journal {}", userDetails.getId(), id);
            JournalResponse journal = journalService.update(id, request);
            return ResponseEntity.ok(ApiResponse.success("Journal updated successfully", journal));
        } catch (Exception e) {
            log.error("Error updating journal {} by user {}", id, userDetails.getId(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update journal: " + e.getMessage()));
        }
    }

    /**
     * Delete journal (Owner only)
     * DELETE /api/journals/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJournal(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            // Check if user is owner (not admin for regular delete)
            if (!journalService.isOwner(id, userDetails.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Access denied - You can only delete your own journals"));
            }

            log.info("User {} deleting journal {}", userDetails.getId(), id);
            journalService.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success("Journal deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting journal {} by user {}", id, userDetails.getId(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete journal: " + e.getMessage()));
        }
    }

    // ===== ADMIN ONLY ENDPOINTS =====

    /**
     * Get all journals (Admin only)
     * GET /api/journals
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllJournals() {
        try {
            List<JournalResponse> journals = journalService.findAll();
            return ResponseEntity.ok(ApiResponse.success("All journals retrieved successfully", journals));
        } catch (Exception e) {
            log.error("Error getting all journals", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get all journals"));
        }
    }

    /**
     * Admin update journal (Admin only - full access)
     * PUT /api/journals/admin/{id}
     */
    @PutMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminUpdateJournal(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJournalRequest request) {
        try {
            log.info("Admin updating journal with id: {}", id);
            JournalResponse journal = journalService.update(id, request);
            return ResponseEntity.ok(ApiResponse.success("Journal updated by admin successfully", journal));
        } catch (Exception e) {
            log.error("Error admin updating journal with id: {}", id, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update journal: " + e.getMessage()));
        }
    }

    /**
     * Admin delete journal (Admin only - can delete any journal)
     * DELETE /api/journals/admin/{id}
     */
    @DeleteMapping("/admin/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> adminDeleteJournal(@PathVariable Long id) {
        try {
            log.info("Admin deleting journal with id: {}", id);
            journalService.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success("Journal deleted by admin successfully", null));
        } catch (Exception e) {
            log.error("Error admin deleting journal with id: {}", id, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete journal: " + e.getMessage()));
        }
    }

    /**
     * Get user's journals by user ID (Admin only)
     * GET /api/journals/user/{userId}
     */
    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getJournalsByUserId(@PathVariable Long userId) {
        try {
            List<JournalResponse> journals = journalService.findByUserId(userId);
            return ResponseEntity.ok(ApiResponse.success("User journals retrieved by admin", journals));
        } catch (Exception e) {
            log.error("Error getting journals for user {}", userId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get user journals"));
        }
    }

    /**
     * Search journals by content (Admin only)
     * GET /api/journals/search?query=keyword
     */
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> searchJournals(@RequestParam String query) {
        try {
            // For now, return all journals with a note that search is not implemented yet
            // You can enhance this with actual search functionality later
            List<JournalResponse> journals = journalService.findAll();

            // Simple filter by title or content containing the query
            List<JournalResponse> filteredJournals = journals.stream()
                    .filter(journal ->
                            (journal.getTitle() != null && journal.getTitle().toLowerCase().contains(query.toLowerCase())) ||
                                    (journal.getContent() != null && journal.getContent().toLowerCase().contains(query.toLowerCase()))
                    )
                    .toList();

            return ResponseEntity.ok(ApiResponse.success("Journal search results for: " + query, filteredJournals));
        } catch (Exception e) {
            log.error("Error searching journals with query: {}", query, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to search journals"));
        }
    }
}