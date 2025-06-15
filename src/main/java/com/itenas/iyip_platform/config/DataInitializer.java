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
    // HAPUS passwordEncoder karena tidak digunakan lagi

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
                // SIMPAN PASSWORD PLAIN TEXT - JANGAN DI HASH!
                adminUser.setPassword("admin123"); // LANGSUNG PLAIN TEXT
                adminUser.setPhone("081234567890");
                adminUser.setBirthDate(LocalDate.of(1985, 1, 1));
                adminUser.setGender(User.Gender.LAKI_LAKI);
                adminUser.setProvince("Jawa Barat");
                adminUser.setCity("Bandung");
                adminUser.setRole(adminRole);
                userRepository.save(adminUser);
                log.info("Admin user created: {} with password: {}", adminUser.getEmail(), "admin123");
            }

            if (userRole != null) {
                // Create regular user
                User regularUser = new User();
                regularUser.setName("Regular User");
                regularUser.setNim("USER001");
                regularUser.setEmail("user@iyip.com");
                // SIMPAN PASSWORD PLAIN TEXT - JANGAN DI HASH!
                regularUser.setPassword("user123"); // LANGSUNG PLAIN TEXT
                regularUser.setPhone("081234567891");
                regularUser.setBirthDate(LocalDate.of(1990, 1, 1));
                regularUser.setGender(User.Gender.PEREMPUAN);
                regularUser.setProvince("Jawa Barat");
                regularUser.setCity("Bandung");
                regularUser.setRole(userRole);
                userRepository.save(regularUser);
                log.info("Regular user created: {} with password: {}", regularUser.getEmail(), "user123");

                // Create additional test user
                User testUser = new User();
                testUser.setName("Test User");
                testUser.setNim("TEST001");
                testUser.setEmail("test@iyip.com");
                testUser.setPassword("test123"); // LANGSUNG PLAIN TEXT
                testUser.setPhone("081234567892");
                testUser.setBirthDate(LocalDate.of(1995, 1, 1));
                testUser.setGender(User.Gender.LAKI_LAKI);
                testUser.setProvince("Jawa Barat");
                testUser.setCity("Bandung");
                testUser.setRole(userRole);
                userRepository.save(testUser);
                log.info("Test user created: {} with password: {}", testUser.getEmail(), "password123");
            }

            log.info("Default users created successfully");
        }
    }

    private void initializeCommunities() {
        if (communityRepository.count() == 0) {
            log.info("Creating sample communities...");

            String[][] communities = {
                    {"Technology Enthusiasts", "Community for technology lovers and professionals"},
                    {"Academic Research", "Community focused on academic research and publications"},
                    {"Student Organizations", "Community for various student organizations"},
                    {"Creative Arts", "Community for artists, designers, and creative professionals"},
                    {"Sports & Recreation", "Community for sports enthusiasts and recreational activities"},
                    {"Environmental Awareness", "Community focused on environmental conservation and sustainability"}
            };

            for (String[] communityData : communities) {
                Community community = new Community();
                community.setName(communityData[0]);
                community.setDescription(communityData[1]);
                communityRepository.save(community);
            }

            log.info("Sample communities created successfully");
        }
    }

    private void initializeEvents() {
        if (eventRepository.count() == 0) {
            log.info("Creating sample events...");

            Object[][] events = {
                    {"Tech Innovation Summit 2025", "Annual technology innovation summit featuring latest trends and technologies",
                            LocalDate.of(2025, 8, 15), LocalDate.of(2025, 8, 17), LocalDate.of(2025, 8, 1)},
                    {"Academic Research Conference", "International conference on academic research methodologies",
                            LocalDate.of(2025, 9, 10), LocalDate.of(2025, 9, 12), LocalDate.of(2025, 8, 25)},
                    {"Creative Arts Workshop", "Workshop series on various creative arts techniques",
                            LocalDate.of(2025, 7, 20), LocalDate.of(2025, 7, 22), LocalDate.of(2025, 7, 10)},
                    {"Student Leadership Forum", "Forum for developing student leadership skills",
                            LocalDate.of(2025, 10, 5), LocalDate.of(2025, 10, 6), LocalDate.of(2025, 9, 20)},
                    {"Environmental Sustainability Seminar", "Seminar on environmental sustainability practices",
                            LocalDate.of(2025, 11, 15), LocalDate.of(2025, 11, 16), LocalDate.of(2025, 11, 1)},
                    {"Sports Tournament 2025", "Annual inter-community sports tournament",
                            LocalDate.of(2025, 12, 1), LocalDate.of(2025, 12, 3), LocalDate.of(2025, 11, 15)}
            };

            for (Object[] eventData : events) {
                Event event = new Event();
                event.setTitle((String) eventData[0]);
                event.setDescription((String) eventData[1]);
                event.setStartDate((LocalDate) eventData[2]);
                event.setEndDate((LocalDate) eventData[3]);
                event.setRegistrationDeadline((LocalDate) eventData[4]);
                eventRepository.save(event);
            }

            log.info("Sample events created successfully");
        }
    }
}