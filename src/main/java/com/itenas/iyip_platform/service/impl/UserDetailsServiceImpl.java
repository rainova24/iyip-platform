// CORRECTED LOCATION: backend/src/main/java/com/itenas/iyip/service/impl/UserDetailsServiceImpl.java
package com.itenas.iyip_platform.service.impl;

import com.itenas.iyip_platform.entity.User;
import com.itenas.iyip_platform.repository.UserRepository;
import com.itenas.iyip_platform.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.debug("Loading user by email: {}", email);

        // CORRECTED: Use concrete User class instead of base.User
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> {
                    log.error("User not found with email: {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });

        log.debug("User found: {} with role: {}", user.getEmail(), user.getRoleName());

        return UserDetailsImpl.build(user);
    }
}