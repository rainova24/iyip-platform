package com.itenas.iyip_platform.controller;

import com.itenas.iyip_platform.dto.request.UpdateUserRequest;
import com.itenas.iyip_platform.dto.response.UserResponse;
import com.itenas.iyip_platform.dto.response.CommunityResponse;
import com.itenas.iyip_platform.dto.response.EventResponse;
import com.itenas.iyip_platform.security.UserDetailsImpl;
import com.itenas.iyip_platform.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // Get current user profile
    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        UserResponse user = userService.findById(userDetails.getId());
        return ResponseEntity.ok(user);
    }

    // Update current user profile
    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse updated = userService.updateProfile(userDetails.getId(), request);
        return ResponseEntity.ok(updated);
    }

    // Admin: Get all users
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<UserResponse> users = userService.findAll(page, size);
        return ResponseEntity.ok(users);
    }

    // Admin: Get user by ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        UserResponse user = userService.findById(id);
        return ResponseEntity.ok(user);
    }

    // Admin: Update user
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UpdateUserRequest request) {
        UserResponse updated = userService.updateUser(id, request);
        return ResponseEntity.ok(updated);
    }

    // Admin: Delete user
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        // Get user info before deletion for response message
        UserResponse userToDelete = userService.findById(id);

        userService.deleteById(id);

        // Return success message with user info
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User berhasil dihapus");
        response.put("deletedUser", Map.of(
                "userId", userToDelete.getUserId(),
                "name", userToDelete.getName(),
                "email", userToDelete.getEmail()
        ));
        response.put("timestamp", java.time.LocalDateTime.now().toString());

        return ResponseEntity.ok(response);
    }

    // Admin: Get users by type
    @GetMapping("/type/{userType}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getUsersByType(@PathVariable String userType) {
        List<UserResponse> users = userService.findByUserType(userType);
        return ResponseEntity.ok(users);
    }

    // Get user's communities
    @GetMapping("/{id}/communities")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<List<CommunityResponse>> getUserCommunities(@PathVariable Long id) {
        List<CommunityResponse> communities = userService.getUserCommunities(id);
        return ResponseEntity.ok(communities);
    }

    // Get user's events
    @GetMapping("/{id}/events")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<List<EventResponse>> getUserEvents(@PathVariable Long id) {
        List<EventResponse> events = userService.getUserEvents(id);
        return ResponseEntity.ok(events);
    }
}