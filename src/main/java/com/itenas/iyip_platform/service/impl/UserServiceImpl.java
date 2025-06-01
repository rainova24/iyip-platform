package com.itenas.iyip_platform.service.impl;

import com.itenas.iyip_platform.dto.UserDto;
import com.itenas.iyip_platform.exception.ResourceNotFoundException;
import com.itenas.iyip_platform.model.entity.Role;
import com.itenas.iyip_platform.model.entity.User;
import com.itenas.iyip_platform.repository.RoleRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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
        if (userDto.getId() != null) {
            user = userRepository.findById(userDto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userDto.getId()));
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

        user = userRepository.save(user);
        return mapToDto(user);
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
        dto.setId(user.getId());
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setRoleName(user.getRole().getName());
        return dto;
    }
}