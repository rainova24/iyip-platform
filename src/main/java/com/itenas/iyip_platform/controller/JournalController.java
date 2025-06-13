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

    @GetMapping("/public")
    public ResponseEntity<?> getPublicJournals() {
        try {
            List<JournalResponse> journals = journalService.findPublicJournals();
            return ResponseEntity.ok(ApiResponse.success("Public journals retrieved", journals));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get journals"));
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllJournals() {
        try {
            List<JournalResponse> journals = journalService.findAll();
            return ResponseEntity.ok(ApiResponse.success("All journals retrieved", journals));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get journals"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getJournalById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            JournalResponse journal = journalService.findById(id);

            // Check if journal is public or user is owner/admin
            if (!journal.getIsPublic() &&
                    !journal.getUserId().equals(userDetails.getId()) &&
                    !userDetails.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Access denied"));
            }

            return ResponseEntity.ok(ApiResponse.success("Journal retrieved", journal));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Journal not found"));
        }
    }

    @GetMapping("/my-journals")
    public ResponseEntity<?> getUserJournals(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            List<JournalResponse> journals = journalService.findByUserId(userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success("User journals retrieved", journals));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get journals"));
        }
    }

    @PostMapping
    public ResponseEntity<?> createJournal(
            @Valid @RequestBody CreateJournalRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            JournalResponse journal = journalService.create(userDetails.getId(), request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Journal created", journal));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create journal"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJournal(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJournalRequest request,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            // Check if user is owner or admin
            if (!journalService.isOwner(id, userDetails.getId()) &&
                    !userDetails.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Access denied"));
            }

            JournalResponse journal = journalService.update(id, request);
            return ResponseEntity.ok(ApiResponse.success("Journal updated", journal));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update journal"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJournal(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            // Check if user is owner or admin
            if (!journalService.isOwner(id, userDetails.getId()) &&
                    !userDetails.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Access denied"));
            }

            journalService.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success("Journal deleted", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete journal"));
        }
    }
}