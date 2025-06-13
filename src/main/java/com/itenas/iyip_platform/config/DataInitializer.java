package com.itenas.iyip_platform.config;

import com.itenas.iyip_platform.entity.*;
import com.itenas.iyip_platform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final EventRepository eventRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        log.info("Initializing database data...");

        initializeRoles();
        initializeUsers();
        initializeCommunities();
        initializeEvents();

        log.info("Database initialization completed!");
    }

    private void initializeRoles() {
        if (roleRepository.count() == 0) {
            log.info("Creating default roles...");

            Role adminRole = new Role();
            adminRole.setName("ADMIN");
            adminRole.setDescription("Administrator role with full access");
            roleRepository.save(adminRole);

            Role userRole = new Role();
            userRole.setName("USER");
            userRole.setDescription("Regular user role");
            roleRepository.save(userRole);

            log.info("Default roles created successfully");
        }
    }

    private void initializeUsers() {
        if (userRepository.count() == 0) {
            log.info("Creating default users...");

            Role adminRole = roleRepository.findByName("ADMIN").orElse(null);
            Role userRole = roleRepository.findByName("USER").orElse(null);

            if (adminRole != null) {
                // Create admin user
                User adminUser = new User();
                adminUser.setName("Admin User");
                adminUser.setNim("ADMIN001");
                adminUser.setEmail("admin@iyip.com");
                adminUser.setPassword(passwordEncoder.encode("admin123"));
                adminUser.setRole(adminRole);
                userRepository.save(adminUser);
                log.info("Admin user created: {}", adminUser.getEmail());
            }

            if (userRole != null) {
                // Create regular user
                User regularUser = new User();
                regularUser.setName("Regular User");
                regularUser.setNim("USER001");
                regularUser.setEmail("user@iyip.com");
                regularUser.setPassword(passwordEncoder.encode("user123"));
                regularUser.setBirthDate(LocalDate.of(1990, 1, 1));
                regularUser.setGender(User.Gender.LAKI_LAKI);
                regularUser.setPhone("081234567890");
                regularUser.setProvince("Jawa Barat");
                regularUser.setCity("Bandung");
                regularUser.setRole(userRole);
                userRepository.save(regularUser);
                log.info("Regular user created: {}", regularUser.getEmail());
            }

            log.info("Default users created successfully");
        }
    }

    private void initializeCommunities() {
        if (communityRepository.count() == 0) {
            log.info("Creating default communities...");

            Community techCommunity = new Community();
            techCommunity.setName("Technology Community");
            techCommunity.setDescription("Community for technology enthusiasts");
            communityRepository.save(techCommunity);

            Community sportsCommunity = new Community();
            sportsCommunity.setName("Sports Community");
            sportsCommunity.setDescription("Community for sports lovers");
            communityRepository.save(sportsCommunity);

            log.info("Default communities created successfully");
        }
    }

    private void initializeEvents() {
        if (eventRepository.count() == 0) {
            log.info("Creating default events...");

            Event techEvent = new Event();
            techEvent.setTitle("Tech Conference 2024");
            techEvent.setDescription("Annual technology conference");
            techEvent.setStartDate(LocalDate.now().plusDays(30));
            techEvent.setEndDate(LocalDate.now().plusDays(32));
            techEvent.setRegistrationDeadline(LocalDate.now().plusDays(15));
            eventRepository.save(techEvent);

            Event sportsEvent = new Event();
            sportsEvent.setTitle("Sports Festival 2024");
            sportsEvent.setDescription("Annual sports festival");
            sportsEvent.setStartDate(LocalDate.now().plusDays(45));
            sportsEvent.setEndDate(LocalDate.now().plusDays(47));
            sportsEvent.setRegistrationDeadline(LocalDate.now().plusDays(30));
            eventRepository.save(sportsEvent);

            log.info("Default events created successfully");
        }
    }
}