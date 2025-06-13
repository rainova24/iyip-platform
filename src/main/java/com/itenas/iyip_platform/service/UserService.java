package com.itenas.iyip_platform.service;

import com.itenas.iyip_platform.dto.request.RegisterRequest;
import com.itenas.iyip_platform.dto.request.UpdateUserRequest;
import com.itenas.iyip_platform.dto.response.UserResponse;
import com.itenas.iyip_platform.dto.response.CommunityResponse;
import com.itenas.iyip_platform.dto.response.EventResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    UserResponse findById(Long id);
    UserResponse findByEmail(String email);
    Page<UserResponse> findAll(Pageable pageable);
    List<UserResponse> findByUserType(String userType);
    UserResponse createUser(RegisterRequest request);
    UserResponse updateProfile(Long userId, UpdateUserRequest request);
    UserResponse updateUser(Long userId, UpdateUserRequest request);
    void deleteById(Long id);
    boolean existsByEmail(String email);
    List<CommunityResponse> getUserCommunities(Long userId);
    List<EventResponse> getUserEvents(Long userId);
}