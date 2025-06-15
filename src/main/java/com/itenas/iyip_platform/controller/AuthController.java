package com.itenas.iyip_platform.controller;

import com.itenas.iyip_platform.dto.request.LoginRequest;
import com.itenas.iyip_platform.dto.request.RegisterRequest;
import com.itenas.iyip_platform.dto.request.ChangePasswordRequest;
import com.itenas.iyip_platform.dto.response.LoginResponse;
import com.itenas.iyip_platform.dto.response.RegisterResponse;
import com.itenas.iyip_platform.dto.response.UserResponse;
import com.itenas.iyip_platform.entity.Role;
import com.itenas.iyip_platform.entity.User;
import com.itenas.iyip_platform.repository.RoleRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
@Validated
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            if (loginRequest.getEmail() == null || loginRequest.getEmail().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (loginRequest.getPassword() == null || loginRequest.getPassword().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Password is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            log.info("Login attempt for email: {}", loginRequest.getEmail());

            // Authenticate user dengan plain text password
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Generate JWT token
            String token = jwtTokenProvider.generateToken(authentication);

            // Get user details
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create response
            LoginResponse response = LoginResponse.builder()
                    .token(token)
                    .user(mapToUserResponse(user))
                    .message("Login successful")
                    .build();

            log.info("User {} logged in successfully", loginRequest.getEmail());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Login failed for email: {}", loginRequest.getEmail(), e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email is already taken!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (registerRequest.getNim() != null && userRepository.existsByNim(registerRequest.getNim())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "NIM is already taken!");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Create new user
            User user = new User();
            user.setName(registerRequest.getName());
            user.setEmail(registerRequest.getEmail());
            user.setNim(registerRequest.getNim());

            // SIMPAN PASSWORD PLAIN TEXT TANPA HASHING
            user.setPassword(registerRequest.getPassword());

            user.setPhone(registerRequest.getPhone());
            user.setBirthDate(registerRequest.getBirthDate());
            user.setGender(registerRequest.getGender());
            user.setProvince(registerRequest.getProvince());
            user.setCity(registerRequest.getCity());

            // Set default role
            Role defaultRole = roleRepository.findByName("USER")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setName("USER");
                        newRole.setDescription("Default user role");
                        return roleRepository.save(newRole);
                    });
            user.setRole(defaultRole);

            User savedUser = userRepository.save(user);

            RegisterResponse response = RegisterResponse.builder()
                    .user(mapToUserResponse(savedUser))
                    .message("Registration successful")
                    .build();

            log.info("User {} registered successfully with password: {}",
                    registerRequest.getEmail(), registerRequest.getPassword());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("Registration failed for email: {}", registerRequest.getEmail(), e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> changePassword(
            Authentication authentication,
            @Valid @RequestBody ChangePasswordRequest request) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            if (!request.isPasswordsMatch()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "New password and confirm password do not match");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // VALIDASI PASSWORD PLAIN TEXT (TANPA HASHING)
            if (!request.getCurrentPassword().equals(user.getPassword())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Current password is incorrect");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // UPDATE PASSWORD PLAIN TEXT (TANPA HASHING)
            user.setPassword(request.getNewPassword());
            userRepository.save(user);

            Map<String, String> response = new HashMap<>();
            response.put("message", "Password changed successfully");
            log.info("Password changed for user: {} from '{}' to '{}'",
                    email, request.getCurrentPassword(), request.getNewPassword());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Password change failed", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Password change failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not authenticated");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
            }

            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return ResponseEntity.ok(mapToUserResponse(user));

        } catch (Exception e) {
            log.error("Failed to get current user", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to get user information");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        try {
            SecurityContextHolder.clearContext();

            Map<String, String> response = new HashMap<>();
            response.put("message", "Logout successful");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Logout error", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Logout failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    // MAPPING METHOD DENGAN PASSWORD PLAIN TEXT
    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());

        // TAMPILKAN PASSWORD ASLI (PLAIN TEXT) DARI DATABASE
        response.setPassword(user.getPassword());

        response.setPhone(user.getPhone());
        response.setNim(user.getNim());
        response.setBirthDate(user.getBirthDate());
        response.setGender(user.getGender() != null ? user.getGender().getDisplayName() : null);
        response.setProvince(user.getProvince());
        response.setCity(user.getCity());
        response.setUserType(user.getRoleName());
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        if (user.getRole() != null) {
            response.setRoleId(user.getRole().getRoleId());
            response.setRoleName(user.getRole().getName());
        }

        return response;
    }
}