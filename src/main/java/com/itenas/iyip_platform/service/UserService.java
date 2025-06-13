package com.itenas.iyip_platform.service;

import com.itenas.iyip_platform.dto.request.RegisterRequest;
import com.itenas.iyip_platform.dto.request.UpdateRegularUserRequest;
import com.itenas.iyip_platform.dto.response.RegularUserResponse;
import com.itenas.iyip_platform.dto.response.CommunityResponse;
import com.itenas.iyip_platform.dto.response.EventResponse;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    RegularUserResponse findById(Long id);
    RegularUserResponse findByEmail(String email);
    Page<RegularUserResponse> findAll(Pageable pageable);
    List<RegularUserResponse> findByUserType(String userType);
    RegularUserResponse createUser(RegisterRequest request);
    RegularUserResponse updateProfile(Long userId, UpdateRegularUserRequest request);
    RegularUserResponse updateUser(Long userId, UpdateRegularUserRequest request);
    void deleteById(Long id);
    boolean existsByEmail(String email);
    List<CommunityResponse> getUserCommunities(Long userId);
    List<EventResponse> getUserEvents(Long userId);
}