package com.itenas.iyip_platform.service.impl;

import com.itenas.iyip_platform.dto.request.RegisterRequest;
import com.itenas.iyip_platform.dto.request.UpdateUserRequest;
import com.itenas.iyip_platform.dto.response.UserResponse;
import com.itenas.iyip_platform.dto.response.CommunityResponse;
import com.itenas.iyip_platform.dto.response.EventResponse;
import com.itenas.iyip_platform.entity.*;
import com.itenas.iyip_platform.entity.base.User;
import com.itenas.iyip_platform.exception.ResourceNotFoundException;
import com.itenas.iyip_platform.repository.*;
import com.itenas.iyip_platform.service.UserService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RegularUserRepository regularUserRepository;
    private final AdminUserRepository adminUserRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponse findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToResponse(user);
    }

    @Override
    public UserResponse findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToResponse(user);
    }

    @Override
    public Page<UserResponse> findAll(Pageable pageable) {
        return userRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Override
    public List<UserResponse> findByUserType(String userType) {
        List<User> users;
        if ("ADMIN".equals(userType)) {
            users = adminUserRepository.findAll().stream()
                    .map(admin -> (User) admin)
                    .collect(Collectors.toList());
        } else {
            users = regularUserRepository.findAll().stream()
                    .map(regular -> (User) regular)
                    .collect(Collectors.toList());
        }
        return users.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserResponse createUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        Role userRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new RuntimeException("User role not found"));

        RegularUser user = new RegularUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(userRole);
        user.setNim(request.getNim());
        user.setPhone(request.getPhone());
        user.setBirthDate(request.getBirthDate());
        user.setGender(request.getGender());
        user.setProvince(request.getProvince());
        user.setCity(request.getCity());

        RegularUser saved = regularUserRepository.save(user);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public UserResponse updateProfile(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Update common fields
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        // Update specific fields based on user type
        if (user instanceof RegularUser) {
            RegularUser regularUser = (RegularUser) user;
            if (request.getNim() != null) {
                regularUser.setNim(request.getNim());
            }
            if (request.getBirthDate() != null) {
                regularUser.setBirthDate(request.getBirthDate());
            }
            if (request.getGender() != null) {
                regularUser.setGender(request.getGender());
            }
            if (request.getProvince() != null) {
                regularUser.setProvince(request.getProvince());
            }
            if (request.getCity() != null) {
                regularUser.setCity(request.getCity());
            }
        } else if (user instanceof AdminUser) {
            AdminUser adminUser = (AdminUser) user;
            if (request.getDepartment() != null) {
                adminUser.setDepartment(request.getDepartment());
            }
            if (request.getAccessLevel() != null) {
                adminUser.setAccessLevel(request.getAccessLevel());
            }
        }

        User updated = userRepository.save(user);
        return mapToResponse(updated);
    }

    @Override
    @Transactional
    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        return updateProfile(userId, request);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found");
        }
        userRepository.deleteById(id);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    public List<CommunityResponse> getUserCommunities(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return user.getCommunities().stream()
                .map(uc -> {
                    CommunityResponse response = new CommunityResponse();
                    Community community = uc.getCommunity();
                    response.setCommunityId(community.getCommunityId());
                    response.setName(community.getName());
                    response.setDescription(community.getDescription());
                    response.setMemberCount(community.getMembers().size());
                    response.setIsMember(true);
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public List<EventResponse> getUserEvents(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return user.getEventRegistrations().stream()
                .map(er -> {
                    EventResponse response = new EventResponse();
                    Event event = er.getEvent();
                    response.setEventId(event.getEventId());
                    response.setTitle(event.getTitle());
                    response.setDescription(event.getDescription());
                    response.setStartDate(event.getStartDate());
                    response.setEndDate(event.getEndDate());
                    response.setRegistrationDeadline(event.getRegistrationDeadline());
                    response.setIsRegistered(true);
                    return response;
                })
                .collect(Collectors.toList());
    }

    private UserResponse mapToResponse(User user) {
        UserResponse response = new UserResponse();
        response.setUserId(user.getUserId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setPhone(user.getPhone());
        response.setUserType(user instanceof AdminUser ? "ADMIN" : "REGULAR");
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        if (user instanceof RegularUser) {
            RegularUser regularUser = (RegularUser) user;
            response.setNim(regularUser.getNim());
            response.setBirthDate(regularUser.getBirthDate());
            response.setGender(regularUser.getGender() != null ?
                    regularUser.getGender().name() : null);
            response.setProvince(regularUser.getProvince());
            response.setCity(regularUser.getCity());
        } else if (user instanceof AdminUser) {
            AdminUser adminUser = (AdminUser) user;
            response.setDepartment(adminUser.getDepartment());
            response.setAccessLevel(adminUser.getAccessLevel());
        }

        return response;
    }
}