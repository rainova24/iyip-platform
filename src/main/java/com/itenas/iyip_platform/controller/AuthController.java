package com.itenas.iyip_platform.controller;

import com.itenas.iyip_platform.dto.request.LoginRequest;
import com.itenas.iyip_platform.dto.request.RegisterRequest;
import com.itenas.iyip_platform.dto.response.JwtResponse;
import com.itenas.iyip_platform.dto.response.RegularUserResponse;
import com.itenas.iyip_platform.dto.response.ApiResponse;
import com.itenas.iyip_platform.entity.Role;
import com.itenas.iyip_platform.entity.RegularUser;
import com.itenas.iyip_platform.repository.RoleRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.repository.RegularUserRepository;
import com.itenas.iyip_platform.security.JwtTokenProvider;
import com.itenas.iyip_platform.security.UserDetailsImpl;

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

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RegularUserRepository regularUserRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            log.info("Login attempt for email: {}", loginRequest.getEmail());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

            JwtResponse response = new JwtResponse(
                    jwt,
                    userDetails.getId(),
                    userDetails.getEmail(),
                    userDetails.getName(),
                    userDetails.getAuthorities().iterator().next().getAuthority()
            );

            log.info("User {} logged in successfully", loginRequest.getEmail());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("Login failed for email: {}", loginRequest.getEmail(), e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Invalid email or password"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            log.info("Registration attempt for email: {}", registerRequest.getEmail());

            // Check if email already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("Email is already registered"));
            }

            // Check if NIM already exists (for regular users)
            if (registerRequest.getNim() != null &&
                    regularUserRepository.existsByNim(registerRequest.getNim())) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.error("NIM is already registered"));
            }

            // Get role
            Role userRole = roleRepository.findByName("USER")
                    .orElseThrow(() -> new RuntimeException("User Role not found"));

            // Create new RegularUser (default for registration)
            RegularUser user = new RegularUser();
            user.setName(registerRequest.getName());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.setRole(userRole);
            user.setNim(registerRequest.getNim());
            user.setPhone(registerRequest.getPhone());
            user.setBirthDate(registerRequest.getBirthDate());
            user.setGender(registerRequest.getGender());
            user.setProvince(registerRequest.getProvince());
            user.setCity(registerRequest.getCity());

            RegularUser savedUser = regularUserRepository.save(user);

            // Create UserResponse
            RegularUserResponse regularUserResponse = new RegularUserResponse();
            regularUserResponse.setUserId(savedUser.getUserId());
            regularUserResponse.setName(savedUser.getName());
            regularUserResponse.setEmail(savedUser.getEmail());
            regularUserResponse.setUserType("REGULAR");
            regularUserResponse.setNim(savedUser.getNim());

            log.info("User {} registered successfully", registerRequest.getEmail());
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(ApiResponse.success("Registration successful", regularUserResponse));

        } catch (Exception e) {
            log.error("Registration failed", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(ApiResponse.success("Logout successful", null));
    }
}