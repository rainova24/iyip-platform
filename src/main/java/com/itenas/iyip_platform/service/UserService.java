package com.itenas.iyip_platform.service;

import com.itenas.iyip_platform.dto.request.UpdateUserRequest;
import com.itenas.iyip_platform.dto.response.UserResponse;
import com.itenas.iyip_platform.dto.response.CommunityResponse;
import com.itenas.iyip_platform.dto.response.EventResponse;
import com.itenas.iyip_platform.entity.User;

import java.util.List;

public interface UserService {

    // Basic CRUD operations
    UserResponse findById(Long id);
    List<UserResponse> findAll(int page, int size);
    UserResponse updateProfile(Long userId, UpdateUserRequest request);
    UserResponse updateUser(Long id, UpdateUserRequest request);
    void deleteById(Long id);

    // Authentication related
    UserResponse findByEmail(String email);
    User getUserByEmail(String email);

    // Role-based queries
    List<UserResponse> findByUserType(String userType);
    List<UserResponse> findAllAdmins();
    List<UserResponse> findAllRegularUsers();

    // Location-based queries
    List<UserResponse> findByProvince(String province);
    List<UserResponse> findByProvinceAndCity(String province, String city);

    // Search functionality
    List<UserResponse> searchUsers(String searchTerm);

    // User-related entities
    List<CommunityResponse> getUserCommunities(Long userId);
    List<EventResponse> getUserEvents(Long userId);

    // Statistics for admin dashboard
    long getTotalAdmins();
    long getTotalRegularUsers();
    long getTotalUsers();
}