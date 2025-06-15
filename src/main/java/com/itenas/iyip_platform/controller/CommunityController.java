package com.itenas.iyip_platform.controller;

import com.itenas.iyip_platform.dto.request.CreateCommunityRequest;
import com.itenas.iyip_platform.dto.request.UpdateCommunityRequest;
import com.itenas.iyip_platform.dto.response.CommunityResponse;
import com.itenas.iyip_platform.dto.response.ApiResponse;
import com.itenas.iyip_platform.dto.response.UserCommunityResponse;
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

import java.util.Map;

@RestController
@RequestMapping("/api/communities")
@RequiredArgsConstructor
@Slf4j
public class CommunityController {

    private final CommunityService communityService;

    // ===== PUBLIC ENDPOINTS =====


    /**
     * Get all communities
     * GET /api/communities
     */
    @GetMapping
    public ResponseEntity<?> getAllCommunities() {
        try {
            List<CommunityResponse> communities = communityService.findAll();
            return ResponseEntity.ok(ApiResponse.success("Communities retrieved successfully", communities));
        } catch (Exception e) {
            log.error("Error getting communities", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get communities"));
        }
    }

    /**
     * Get specific community by ID
     * GET /api/communities/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCommunityById(@PathVariable Long id) {
        try {
            CommunityResponse community = communityService.findById(id);
            return ResponseEntity.ok(ApiResponse.success("Community retrieved successfully", community));
        } catch (Exception e) {
            log.error("Error getting community with id: {}", id, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Community not found"));
        }
    }

    /**
     * Get community members
     * GET /api/communities/{id}/members
     */
    @GetMapping("/{id}/members")
    public ResponseEntity<?> getCommunityMembers(@PathVariable Long id) {
        try {
            List<UserCommunityResponse> members = communityService.getCommunityMembers(id);
            return ResponseEntity.ok(ApiResponse.success("Community members retrieved successfully", members));
        } catch (Exception e) {
            log.error("Error getting community members for id: {}", id, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get community members"));
        }
    }

    // ===== USER ENDPOINTS =====




    /**
     * Get user's communities (for logged in user)
     * GET /api/communities/my-communities
     */
    @GetMapping("/my-communities")
    public ResponseEntity<?> getMyUserCommunities(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            // Add null check for userDetails
            if (userDetails == null) {
                log.warn("UserDetails is null - user not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Authentication required"));
            }

            log.debug("Getting communities for user: {}", userDetails.getId());
            List<CommunityResponse> communities = communityService.findByUserId(userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success("User communities retrieved successfully", communities));
        } catch (Exception e) {
            log.error("Error getting user communities for user: {}",
                    userDetails != null ? userDetails.getId() : "null", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get user communities"));
        }
    }

    /**
     * Join a community
     * POST /api/communities/{id}/join
     */
    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinCommunity(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            // Add null check for userDetails
            if (userDetails == null) {
                log.warn("UserDetails is null - user not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Authentication required"));
            }

            log.debug("User {} joining community {}", userDetails.getId(), id);
            communityService.joinCommunity(id, userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success("Successfully joined community", null));
        } catch (IllegalStateException e) {
            log.warn("User {} already member of community {}",
                    userDetails != null ? userDetails.getId() : "null", id);
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(ApiResponse.error("You are already a member of this community"));
        } catch (Exception e) {
            log.error("Error joining community {} for user {}", id,
                    userDetails != null ? userDetails.getId() : "null", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to join community"));
        }
    }

    /**
     * Leave a community
     * DELETE /api/communities/{id}/leave
     */
    @DeleteMapping("/{id}/leave")
    public ResponseEntity<?> leaveCommunity(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            // Add null check for userDetails
            if (userDetails == null) {
                log.warn("UserDetails is null - user not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(ApiResponse.error("Authentication required"));
            }

            log.debug("User {} leaving community {}", userDetails.getId(), id);
            communityService.leaveCommunity(id, userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success("Successfully left community", null));
        } catch (Exception e) {
            log.error("Error leaving community {} for user {}", id,
                    userDetails != null ? userDetails.getId() : "null", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to leave community"));
        }
    }

    @GetMapping("/auth-status")
    public ResponseEntity<?> checkAuthStatus(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Not authenticated"));
        }

        return ResponseEntity.ok(ApiResponse.success("Authenticated",
                Map.of(
                        "userId", userDetails.getId(),
                        "email", userDetails.getEmail(),
                        "name", userDetails.getName()
                )));
    }

    // ===== ADMIN ENDPOINTS =====

    /**
     * Admin: Create new community
     * POST /api/communities
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCommunity(@Valid @RequestBody CreateCommunityRequest request) {
        try {
            log.info("Admin creating community with name: {}", request.getName());
            CommunityResponse community = communityService.create(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Community created successfully", community));
        } catch (Exception e) {
            log.error("Error creating community", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to create community"));
        }
    }

    /**
     * Admin: Update existing community
     * PUT /api/communities/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCommunity(
            @PathVariable Long id,
            @Valid @RequestBody UpdateCommunityRequest request) {
        try {
            log.info("Admin updating community with id: {}", id);
            CommunityResponse community = communityService.update(id, request);
            return ResponseEntity.ok(ApiResponse.success("Community updated successfully", community));
        } catch (Exception e) {
            log.error("Error updating community with id: {}", id, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to update community: " + e.getMessage()));
        }
    }

    /**
     * Admin: Delete community
     * DELETE /api/communities/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCommunity(@PathVariable Long id) {
        try {
            log.info("Admin deleting community with id: {}", id);
            communityService.deleteById(id);
            return ResponseEntity.ok(ApiResponse.success("Community deleted successfully", null));
        } catch (Exception e) {
            log.error("Error deleting community with id: {}", id, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to delete community: " + e.getMessage()));
        }
    }

    /**
     * Admin: Check if user is member of community
     * GET /api/communities/{communityId}/members/{userId}/status
     */
    @GetMapping("/{communityId}/members/{userId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> checkUserMembership(
            @PathVariable Long communityId,
            @PathVariable Long userId) {
        try {
            boolean isMember = communityService.isUserMember(communityId, userId);

            return ResponseEntity.ok(ApiResponse.success("Membership status retrieved",
                    java.util.Map.of(
                            "userId", userId,
                            "communityId", communityId,
                            "isMember", isMember
                    )));
        } catch (Exception e) {
            log.error("Error checking membership for user {} in community {}", userId, communityId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to check membership status"));
        }
    }

    /**
     * Admin: Get all communities with detailed info
     * GET /api/communities/admin/all
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllCommunitiesForAdmin() {
        try {
            List<CommunityResponse> communities = communityService.findAll();
            return ResponseEntity.ok(ApiResponse.success("All communities retrieved for admin", communities));
        } catch (Exception e) {
            log.error("Error getting all communities for admin", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get communities"));
        }
    }
}