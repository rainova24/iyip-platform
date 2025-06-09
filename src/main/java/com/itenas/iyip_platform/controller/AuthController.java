// src/main/java/com/itenas/iyip_platform/controller/AuthController.java
package com.itenas.iyip_platform.controller;

import com.itenas.iyip_platform.dto.AuthDto;
import com.itenas.iyip_platform.dto.UserDto;
import com.itenas.iyip_platform.model.entity.Role;
import com.itenas.iyip_platform.model.entity.User;
import com.itenas.iyip_platform.repository.RoleRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.security.JwtTokenProvider;
import com.itenas.iyip_platform.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthDto.LoginRequest loginRequest) {
        try {
            // Basic validation
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

            // Authenticate user
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
            AuthDto.LoginResponse response = AuthDto.LoginResponse.builder()
                    .token(token)
                    .user(mapToUserDto(user))
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
    public ResponseEntity<?> register(@RequestBody AuthDto.RegisterRequest registerRequest) {
        try {
            // Basic validation
            if (registerRequest.getName() == null || registerRequest.getName().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Name is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (registerRequest.getEmail() == null || registerRequest.getEmail().trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            if (registerRequest.getPassword() == null || registerRequest.getPassword().length() < 6) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Password must be at least 6 characters");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            log.info("Registration attempt for email: {}", registerRequest.getEmail());

            // Check if user already exists
            if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Email already registered");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Check if NIM already exists (if provided)
            if (registerRequest.getNim() != null && !registerRequest.getNim().trim().isEmpty() &&
                    userRepository.findByNim(registerRequest.getNim()).isPresent()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "NIM already registered");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            // Create new user
            User user = new User();
            user.setName(registerRequest.getName());
            user.setEmail(registerRequest.getEmail());
            user.setNim(registerRequest.getNim());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setPhone(registerRequest.getPhone());
            user.setBirthDate(registerRequest.getBirthDate());
            user.setGender(registerRequest.getGender());
            user.setProvince(registerRequest.getProvince());
            user.setCity(registerRequest.getCity());
            user.setRegisteredAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());

            // Set default role (USER)
            Role defaultRole = roleRepository.findByName("USER")
                    .orElseGet(() -> {
                        Role newRole = new Role();
                        newRole.setName("USER");
                        newRole.setDescription("Default user role");
                        return roleRepository.save(newRole);
                    });
            user.setRole(defaultRole);

            // Save user
            User savedUser = userRepository.save(user);

            // Create response
            AuthDto.RegisterResponse response = AuthDto.RegisterResponse.builder()
                    .user(mapToUserDto(savedUser))
                    .message("Registration successful")
                    .build();

            log.info("User {} registered successfully", registerRequest.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            log.error("Registration failed for email: {}", registerRequest.getEmail(), e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed: " + e.getMessage());
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

            return ResponseEntity.ok(mapToUserDto(user));

        } catch (Exception e) {
            log.error("Failed to get current user", e);
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to get user information");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logout successful");
        return ResponseEntity.ok(response);
    }

    // Helper method to convert User entity to UserDto
    private UserDto mapToUserDto(User user) {
        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setNim(user.getNim());
        dto.setPhone(user.getPhone());
        dto.setBirthDate(user.getBirthDate());
        dto.setGender(user.getGender());
        dto.setProvince(user.getProvince());
        dto.setCity(user.getCity());
        dto.setRegisteredAt(user.getRegisteredAt());
        dto.setUpdatedAt(user.getUpdatedAt());
        if (user.getRole() != null) {
            dto.setRoleName(user.getRole().getName());
        }
        return dto;
    }
}