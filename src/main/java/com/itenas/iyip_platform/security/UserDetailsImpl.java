// src/main/java/com/itenas/iyip_platform/security/UserDetailsImpl.java
package com.itenas.iyip_platform.security;

import com.itenas.iyip_platform.entity.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Data
@AllArgsConstructor
@Slf4j
public class UserDetailsImpl implements UserDetails {

    private Long id;
    private String name;
    private String email;
    private String password;
    private Collection<? extends GrantedAuthority> authorities;

    /**
     * Build UserDetailsImpl from User entity with proper null checks
     */
    public static UserDetailsImpl build(User user) {
        // Add defensive null checks
        if (user == null) {
            log.error("Cannot build UserDetailsImpl: User is null");
            throw new IllegalArgumentException("User cannot be null");
        }

        if (user.getRole() == null) {
            log.error("Cannot build UserDetailsImpl: User role is null for user {}", user.getEmail());
            throw new IllegalArgumentException("User role cannot be null");
        }

        if (user.getRole().getName() == null) {
            log.error("Cannot build UserDetailsImpl: Role name is null for user {}", user.getEmail());
            throw new IllegalArgumentException("Role name cannot be null");
        }

        // Create authority with ROLE_ prefix
        String roleName = user.getRole().getName();
        GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + roleName);

        log.debug("Building UserDetailsImpl for user: {} with role: {}", user.getEmail(), roleName);

        return new UserDetailsImpl(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getPassword(),
                Collections.singletonList(authority)
        );
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    /**
     * Helper method to check if user has specific role
     */
    public boolean hasRole(String roleName) {
        return authorities.stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + roleName));
    }

    /**
     * Helper method to check if user is admin
     */
    public boolean isAdmin() {
        return hasRole("ADMIN");
    }

    /**
     * Get role name without ROLE_ prefix
     */
    public String getRoleName() {
        return authorities.stream()
                .findFirst()
                .map(auth -> auth.getAuthority().replace("ROLE_", ""))
                .orElse("USER");
    }

    @Override
    public String toString() {
        return "UserDetailsImpl{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", authorities=" + authorities +
                '}';
    }
}