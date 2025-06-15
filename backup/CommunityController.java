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

@RestController
@RequestMapping("/api/communities")
@RequiredArgsConstructor
@Slf4j
public class CommunityController {

    private final CommunityService communityService;

    // ===== PUBLIC ENDPOINTS =====

    @GetMapping
    public ResponseEntity<?> getAllCommunities() {
        try {
            List<CommunityResponse> communities = communityService.findAll();
            return ResponseEntity.ok(ApiResponse.success("Communities retrieved successfully", communities));
        } catch (Exception e) {
            log.error("Error getting communities", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get communities: " + e.getMessage()));
        }
    }

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

    @GetMapping("/my-communities")
    public ResponseEntity<?> getMyUserCommunities(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            List<CommunityResponse> communities = communityService.findByUserId(userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success("User communities retrieved successfully", communities));
        } catch (Exception e) {
            log.error("Error getting user communities for user: {}", userDetails.getId(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get user communities"));
        }
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinCommunity(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            communityService.joinCommunity(id, userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success("Successfully joined community", null));
        } catch (Exception e) {
            log.error("Error joining community {} for user {}", id, userDetails.getId(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to join community: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}/leave")
    public ResponseEntity<?> leaveCommunity(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            communityService.leaveCommunity(id, userDetails.getId());
            return ResponseEntity.ok(ApiResponse.success("Successfully left community", null));
        } catch (Exception e) {
            log.error("Error leaving community {} for user {}", id, userDetails.getId(), e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to leave community: " + e.getMessage()));
        }
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
                    .body(ApiResponse.error("Failed to create community: " + e.getMessage()));
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
     * Admin: Get all communities with pagination (optional enhancement)
     * GET /api/communities/admin/all
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllCommunitiesForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        try {
            // Note: You may need to add pagination support in service layer
            List<CommunityResponse> communities = communityService.findAll();
            return ResponseEntity.ok(ApiResponse.success("All communities retrieved for admin", communities));
        } catch (Exception e) {
            log.error("Error getting all communities for admin", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to get communities"));
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
                    new MembershipStatus(userId, communityId, isMember)));
        } catch (Exception e) {
            log.error("Error checking membership for user {} in community {}", userId, communityId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to check membership status"));
        }
    }

    // ===== INNER CLASSES =====

    /**
     * Helper class for membership status response
     */
    public static class MembershipStatus {
        private Long userId;
        private Long communityId;
        private boolean isMember;

        public MembershipStatus(Long userId, Long communityId, boolean isMember) {
            this.userId = userId;
            this.communityId = communityId;
            this.isMember = isMember;
        }

        // Getters
        public Long getUserId() { return userId; }
        public Long getCommunityId() { return communityId; }
        public boolean isMember() { return isMember; }

        // Setters
        public void setUserId(Long userId) { this.userId = userId; }
        public void setCommunityId(Long communityId) { this.communityId = communityId; }
        public void setMember(boolean member) { isMember = member; }
    }
}