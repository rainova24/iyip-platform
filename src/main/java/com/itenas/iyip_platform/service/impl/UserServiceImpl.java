package com.itenas.iyip_platform.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.itenas.iyip_platform.dto.UserDto;
import com.itenas.iyip_platform.exception.ResourceNotFoundException;
import com.itenas.iyip_platform.model.entity.Role;
import com.itenas.iyip_platform.model.entity.User;
import com.itenas.iyip_platform.repository.RoleRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.service.UserService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserDto findById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToDto(user);
    }

    @Override
    public List<UserDto> findAll() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public UserDto save(UserDto userDto) {
        User user;
        if (userDto.getUserId() != null) {
            user = userRepository.findById(userDto.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userDto.getUserId()));
            user.setName(userDto.getName());
            user.setEmail(userDto.getEmail());
        } else {
            user = new User();
            user.setName(userDto.getName());
            user.setEmail(userDto.getEmail());
            // Set default password for new users
            user.setPassword(passwordEncoder.encode("password123"));
        }

        // Set role
        Role role = roleRepository.findByName(userDto.getRoleName())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found with name: " + userDto.getRoleName()));
        user.setRole(role);

        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }

    @Override
    public void deleteById(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    @Override
    public UserDto findByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return mapToDto(user);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }

    private UserDto mapToDto(User user) {
        UserDto dto = new UserDto();
        dto.setUserId(user.getUserId());  // Updated to use getUserId()
        dto.setName(user.getName());
        dto.setNim(user.getNim());
        dto.setEmail(user.getEmail());
        dto.setBirthDate(user.getBirthDate());
        dto.setGender(user.getGender());
        dto.setPhone(user.getPhone());
        dto.setProvince(user.getProvince());
        dto.setCity(user.getCity());
        dto.setRegisteredAt(user.getRegisteredAt());
        dto.setUpdatedAt(user.getUpdatedAt());

        if (user.getRole() != null) {
            dto.setRoleName(user.getRole().getName());
            dto.setRoleId(user.getRole().getRoleId());  // Updated to use getRoleId()
        }

        return dto;
    }

    @Override
    public UserDto updateProfile(String email, UserDto userDto) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Update user fields
        user.setName(userDto.getName());
        user.setBirthDate(userDto.getBirthDate());
        user.setGender(userDto.getGender());
        user.setPhone(userDto.getPhone());
        user.setProvince(userDto.getProvince());
        user.setCity(userDto.getCity());

        User savedUser = userRepository.save(user);
        return mapToDto(savedUser);
    }
}