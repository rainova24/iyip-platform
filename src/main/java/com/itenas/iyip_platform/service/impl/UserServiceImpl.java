package com.itenas.iyip_platform.service.impl;

import com.itenas.iyip_platform.dto.request.UpdateUserRequest;
import com.itenas.iyip_platform.dto.response.UserResponse;
import com.itenas.iyip_platform.dto.response.CommunityResponse;
import com.itenas.iyip_platform.dto.response.EventResponse;
import com.itenas.iyip_platform.entity.Role;
import com.itenas.iyip_platform.entity.User;
import com.itenas.iyip_platform.exception.ResourceNotFoundException;
import com.itenas.iyip_platform.repository.RoleRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public UserResponse findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    @Override
    public List<UserResponse> findAll(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> users = userRepository.findAll(pageable);
        return users.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponse updateProfile(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Update basic fields (users can update their own profile)
        updateBasicUserFields(user, request);

        // Role update is NOT allowed in profile update (only admin via updateUser)
        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Override
    public UserResponse updateUser(Long id, UpdateUserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        // Update basic fields
        updateBasicUserFields(user, request);

        // Handle role update (only for admin)
        handleRoleUpdate(user, request, id);

        // JIKA ADA PASSWORD UPDATE, SIMPAN PLAIN TEXT
        if (request.getPassword() != null) {
            log.info("Updating password for user {} from '{}' to '{}'",
                    id, user.getPassword(), request.getPassword());
            user.setPassword(request.getPassword()); // TANPA HASHING
        }

        User savedUser = userRepository.save(user);
        return mapToUserResponse(savedUser);
    }

    @Override
    public void deleteById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }

        // Security check: prevent admin from deleting themselves
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {
            User currentUser = userRepository.findByEmail(auth.getName()).orElse(null);
            if (currentUser != null && currentUser.getUserId().equals(id)) {
                throw new SecurityException("User cannot delete their own account");
            }
        }

        userRepository.deleteById(id);
        log.info("User with id {} has been deleted", id);
    }

    @Override
    public UserResponse findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return mapToUserResponse(user);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    @Override
    public List<UserResponse> findByUserType(String userType) {
        List<User> users;
        if ("ADMIN".equalsIgnoreCase(userType)) {
            users = userRepository.findByRoleName("ADMIN");
        } else if ("USER".equalsIgnoreCase(userType) || "REGULAR".equalsIgnoreCase(userType)) {
            users = userRepository.findByRoleName("USER");
        } else {
            users = userRepository.findAll();
        }

        return users.stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> findAllAdmins() {
        return userRepository.findByRoleName("ADMIN").stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> findAllRegularUsers() {
        return userRepository.findByRoleName("USER").stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> findByProvince(String province) {
        return userRepository.findByProvince(province).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> findByProvinceAndCity(String province, String city) {
        return userRepository.findByProvinceAndCity(province, city).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<UserResponse> searchUsers(String searchTerm) {
        return userRepository.findByNameOrEmailOrNimContaining(searchTerm).stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CommunityResponse> getUserCommunities(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        // TODO: Implement community mapping based on your Community entity structure
        return List.of();
    }

    @Override
    public List<EventResponse> getUserEvents(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        // TODO: Implement event mapping based on your Event entity structure
        return List.of();
    }

    @Override
    public long getTotalAdmins() {
        return userRepository.countAdmins();
    }

    @Override
    public long getTotalRegularUsers() {
        return userRepository.countRegularUsers();
    }

    @Override
    public long getTotalUsers() {
        return userRepository.count();
    }

    // HELPER METHODS
    private void updateBasicUserFields(User user, UpdateUserRequest request) {
        if (request.getName() != null) {
            user.setName(request.getName());
        }
        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }
        if (request.getNim() != null) {
            user.setNim(request.getNim());
        }
        if (request.getBirthDate() != null) {
            user.setBirthDate(request.getBirthDate());
        }
        if (request.getGender() != null) {
            user.setGender(request.getGender());
        }
        if (request.getProvince() != null) {
            user.setProvince(request.getProvince());
        }
        if (request.getCity() != null) {
            user.setCity(request.getCity());
        }
    }

    private void handleRoleUpdate(User user, UpdateUserRequest request, Long userId) {
        // Check if role update is requested
        if (request.getRoleId() == null && request.getRoleName() == null) {
            return; // No role update requested
        }

        // Check if current user is admin
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        boolean isAdmin = auth != null && auth.getAuthorities().stream()
                .anyMatch(authority -> authority.getAuthority().equals("ROLE_ADMIN"));

        if (!isAdmin) {
            log.warn("Non-admin user {} attempted to change role for user {}",
                    auth != null ? auth.getName() : "unknown", userId);
            throw new SecurityException("Only administrators can change user roles");
        }

        // Find the new role
        Role newRole = null;
        if (request.getRoleId() != null) {
            newRole = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with id: " + request.getRoleId()));
        } else if (request.getRoleName() != null) {
            newRole = roleRepository.findByName(request.getRoleName())
                    .orElseThrow(() -> new ResourceNotFoundException("Role not found with name: " + request.getRoleName()));
        }

        if (newRole != null) {
            // Security check: prevent admin from removing their own admin role
            User currentUser = userRepository.findByEmail(auth.getName()).orElse(null);
            if (currentUser != null && currentUser.getUserId().equals(userId) && !"ADMIN".equals(newRole.getName())) {
                throw new SecurityException("Admin cannot remove their own admin privileges");
            }

            String oldRole = user.getRole().getName();
            user.setRole(newRole);

            log.info("ROLE_CHANGE: User {} ({}) role changed from {} to {} by Admin {} at {}",
                    user.getEmail(), user.getUserId(), oldRole, newRole.getName(),
                    auth.getName(), java.time.LocalDateTime.now());
        }
    }

    // MAPPING METHOD DENGAN PASSWORD PLAIN TEXT DAN ROLE INFO
    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();

        // Basic fields
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

        // Role-based userType
        response.setUserType(user.getRoleName());

        // Timestamps
        response.setCreatedAt(user.getCreatedAt());
        response.setUpdatedAt(user.getUpdatedAt());

        // Role information - YANG HILANG SEBELUMNYA
        if (user.getRole() != null) {
            response.setRoleId(user.getRole().getRoleId());
            response.setRoleName(user.getRole().getName());
        }

        return response;
    }
}