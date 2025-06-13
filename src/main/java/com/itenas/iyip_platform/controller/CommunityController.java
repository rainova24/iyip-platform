package com.itenas.iyip_platform.controller;

import com.itenas.iyip_platform.dto.request.CreateCommunityRequest;
import com.itenas.iyip_platform.dto.request.UpdateCommunityRequest;
import com.itenas.iyip_platform.dto.response.CommunityResponse;
import com.itenas.iyip_platform.dto.response.ApiResponse;
import com.itenas.iyip_platform.security.UserDetailsImpl;
import com.itenas.iyip_platform.service.CommunityService;

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
@RequestMapping("/api/communities")
@RequiredArgsConstructor
@Slf4j
public class CommunityController {

    private final CommunityService communityService;

    @GetMapping
    public ResponseEntity<?> getAllCommunities() {
        try {
            List<CommunityResponse> communities = communityService.findAll();
            return ResponseEntity.ok(ApiResponse.success("Communities retrieved", communities));
        } catch (Exception e) {
            log.error("Error getting communities", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get communities"));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCommunityById(@PathVariable Long id) {
        try {
            CommunityResponse community = communityService.findById(id);
            return ResponseEntity.ok(ApiResponse.success("Community retrieved", community));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Community not found"));
        }
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCommunity(@Valid @RequestBody CreateCommunityRequest request) {
        try {
            CommunityResponse community = communityService.create(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Community created", community));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create community"));
        }
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinCommunity(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            communityService.joinCommunity(id, userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success("Joined community", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to join community"));
        }
    }

    @DeleteMapping("/{id}/leave")
    public ResponseEntity<?> leaveCommunity(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            communityService.leaveCommunity(id, userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success("Left community", null));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to leave community"));
        }
    }
}