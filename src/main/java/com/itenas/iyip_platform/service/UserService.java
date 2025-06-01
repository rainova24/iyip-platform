package com.itenas.iyip_platform.service;

import java.util.List;

import com.itenas.iyip_platform.dto.UserDto;
import com.itenas.iyip_platform.model.entity.User;

public interface UserService {
    UserDto findById(Long id);
    List<UserDto> findAll();
    UserDto save(UserDto userDto);
    void deleteById(Long id);
    UserDto findByEmail(String email);
    User getUserByEmail(String email);
}