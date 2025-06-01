package com.itenas.iyip_platform.config;

import com.itenas.iyip_platform.model.entity.Role;
import com.itenas.iyip_platform.model.entity.User;
import com.itenas.iyip_platform.repository.RoleRepository;
import com.itenas.iyip_platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        if (roleRepository.count() == 0) {
            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            adminRole.setDescription("Administrator role");
            roleRepository.save(adminRole);

            Role userRole = new Role();
            userRole.setName("USER");
            userRole.setDescription("Regular user role");
            roleRepository.save(userRole);

            // Create admin user
            User adminUser = new User();
            adminUser.setName("Admin");
            adminUser.setEmail("admin@iyip.com");
            adminUser.setPassword(passwordEncoder.encode("admin123"));
            adminUser.setRole(adminRole);
            userRepository.save(adminUser);

            // Create regular user
            User regularUser = new User();
            regularUser.setName("User");
            regularUser.setEmail("user@iyip.com");
            regularUser.setPassword(passwordEncoder.encode("user123"));
            regularUser.setRole(userRole);
            userRepository.save(regularUser);
        }
    }
}