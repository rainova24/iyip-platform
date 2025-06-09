package com.itenas.iyip_platform.security;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component("userSecurity")
@RequiredArgsConstructor
public class UserSecurity {

    // Remove all Transaction-related methods since we don't use Transaction anymore

    /**
     * Check if user owns a resource by comparing user IDs
     */
    public boolean isOwner(Long userId, Long resourceUserId) {
        if (userId == null || resourceUserId == null) {
            return false;
        }
        return userId.equals(resourceUserId);
    }

    /**
     * Check if user is admin or owner of resource
     */
    public boolean isAdminOrOwner(String role, Long userId, Long resourceUserId) {
        return "ADMIN".equals(role) || isOwner(userId, resourceUserId);
    }
}