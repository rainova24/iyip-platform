package com.itenas.iyip_platform.controller;

import com.itenas.iyip_platform.dto.JournalDto;
import com.itenas.iyip_platform.security.UserDetailsImpl;
import com.itenas.iyip_platform.service.JournalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/journals")
@RequiredArgsConstructor
public class JournalController {

    private final JournalService journalService;

    @GetMapping("/public")
    public ResponseEntity<List<JournalDto>> getPublicJournals() {
        return ResponseEntity.ok(journalService.findPublicJournals());
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<JournalDto>> getAllJournals() {
        return ResponseEntity.ok(journalService.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @journalSecurity.isOwnerOrPublic(#userDetails.id, #id)")
    public ResponseEntity<JournalDto> getJournalById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(journalService.findById(id));
    }

    @GetMapping("/my-journals")
    public ResponseEntity<List<JournalDto>> getUserJournals(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(journalService.findByUserId(userDetails.getId()));
    }

    @PostMapping
    public ResponseEntity<JournalDto> createJournal(
            @Valid @RequestBody JournalDto journalDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        journalDto.setUserId(userDetails.getId());
        return new ResponseEntity<>(journalService.save(journalDto), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @journalSecurity.isOwner(#userDetails.id, #id)")
    public ResponseEntity<JournalDto> updateJournal(
            @PathVariable Long id,
            @Valid @RequestBody JournalDto journalDto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        journalDto.setJournalId(id);
        journalDto.setUserId(userDetails.getId());
        return ResponseEntity.ok(journalService.save(journalDto));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @journalSecurity.isOwner(#userDetails.id, #id)")
    public ResponseEntity<Void> deleteJournal(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        journalService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}