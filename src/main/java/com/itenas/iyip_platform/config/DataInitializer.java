// src/main/java/com/itenas/iyip_platform/config/DataInitializer.java
// UPDATED VERSION dengan user baru

package com.itenas.iyip_platform.config;

import com.itenas.iyip_platform.entity.*;
import com.itenas.iyip_platform.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.Optional;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CommunityRepository communityRepository;
    private final EventRepository eventRepository;
    private final JournalRepository journalRepository;
    private final SubmissionRepository submissionRepository;

    @Override
    public void run(String... args) throws Exception {
        try {
            log.info("Starting database initialization...");

            initializeRoles();
            initializeUsers();
            initializeCommunities();
            initializeEvents();
            initializeJournals();
            initializeSubmissions();

            log.info("Database initialization completed successfully!");
        } catch (Exception e) {
            log.error("Error during database initialization", e);
        }
    }

    private void initializeRoles() {
        try {
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
        } catch (Exception e) {
            log.error("Error creating roles", e);
        }
    }

    private void initializeUsers() {
        try {
            if (userRepository.count() == 0) {
                log.info("Creating default users...");

                Role adminRole = roleRepository.findByName("ADMIN").orElse(null);
                Role userRole = roleRepository.findByName("USER").orElse(null);

                if (adminRole == null || userRole == null) {
                    log.error("Roles not found, cannot create users");
                    return;
                }

                // Create original admin user
                User adminUser = new User();
                adminUser.setName("Admin User");
                adminUser.setNim("ADMIN001");
                adminUser.setEmail("admin@iyip.com");
                adminUser.setPassword("admin123");
                adminUser.setBirthDate(LocalDate.of(1990, 1, 1));
                adminUser.setGender(User.Gender.LAKI_LAKI);
                adminUser.setPhone("081234567890");
                adminUser.setProvince("DKI Jakarta");
                adminUser.setCity("Jakarta");
                adminUser.setRole(adminRole);
                userRepository.save(adminUser);

                // ============== ADMIN USERS BARU ===============
                // Admin A
                User adminA = new User();
                adminA.setName("Admin A");
                adminA.setNim("admina");  // sesuai username yang diminta
                adminA.setEmail("admina@iyip.com");
                adminA.setPassword("admina123");
                adminA.setBirthDate(LocalDate.of(1988, 5, 15));
                adminA.setGender(User.Gender.PEREMPUAN);
                adminA.setPhone("081234567892");
                adminA.setProvince("Jawa Barat");
                adminA.setCity("Bandung");
                adminA.setRole(adminRole);
                userRepository.save(adminA);

                // Admin B
                User adminB = new User();
                adminB.setName("Admin B");
                adminB.setNim("adminb");  // sesuai username yang diminta
                adminB.setEmail("adminb@iyip.com");
                adminB.setPassword("adminb123");
                adminB.setBirthDate(LocalDate.of(1987, 8, 20));
                adminB.setGender(User.Gender.LAKI_LAKI);
                adminB.setPhone("081234567893");
                adminB.setProvince("DKI Jakarta");
                adminB.setCity("Jakarta");
                adminB.setRole(adminRole);
                userRepository.save(adminB);

                // ============== USER BIASA BARU ===============
                // User A
                User userA = new User();
                userA.setName("User A");
                userA.setNim("usera");  // sesuai username yang diminta
                userA.setEmail("usera@iyip.com");
                userA.setPassword("usera123");
                userA.setBirthDate(LocalDate.of(1998, 3, 10));
                userA.setGender(User.Gender.LAKI_LAKI);
                userA.setPhone("081234567894");
                userA.setProvince("Jawa Timur");
                userA.setCity("Surabaya");
                userA.setRole(userRole);
                userRepository.save(userA);

                // User B
                User userB = new User();
                userB.setName("User B");
                userB.setNim("userb");  // sesuai username yang diminta
                userB.setEmail("userb@iyip.com");
                userB.setPassword("userb123");
                userB.setBirthDate(LocalDate.of(1999, 7, 25));
                userB.setGender(User.Gender.PEREMPUAN);
                userB.setPhone("081234567895");
                userB.setProvince("Jawa Tengah");
                userB.setCity("Semarang");
                userB.setRole(userRole);
                userRepository.save(userB);

                // Create original regular users
                String[][] originalUsers = {
                        {"Regular User 1", "USER001", "user@iyip.com", "user123", "Jawa Barat", "Bandung"},
                        {"Regular User 2", "USER002", "user2@iyip.com", "user123", "DKI Jakarta", "Jakarta"},
                        {"Sarah Johnson", "USER003", "sarah@iyip.com", "sarah123", "Jawa Timur", "Surabaya"},
                        {"Michael Chen", "USER004", "michael@iyip.com", "michael123", "Jawa Tengah", "Semarang"}
                };

                for (String[] userData : originalUsers) {
                    User user = new User();
                    user.setName(userData[0]);
                    user.setNim(userData[1]);
                    user.setEmail(userData[2]);
                    user.setPassword(userData[3]);
                    user.setBirthDate(LocalDate.of(1995, 6, 15));
                    user.setGender(User.Gender.LAKI_LAKI);
                    user.setPhone("081234567891");
                    user.setProvince(userData[4]);
                    user.setCity(userData[5]);
                    user.setRole(userRole);
                    userRepository.save(user);
                }

                log.info("Users created successfully:");
                log.info("=== ADMIN USERS ===");
                log.info("- Original Admin: admin@iyip.com / admin123");
                log.info("- Admin A: admina@iyip.com / admina123");
                log.info("- Admin B: adminb@iyip.com / adminb123");
                log.info("=== REGULAR USERS ===");
                log.info("- User A: usera@iyip.com / usera123");
                log.info("- User B: userb@iyip.com / userb123");
                log.info("- Regular User 1: user@iyip.com / user123");
                log.info("- Regular User 2: user2@iyip.com / user123");
                log.info("- Sarah Johnson: sarah@iyip.com / sarah123");
                log.info("- Michael Chen: michael@iyip.com / michael123");
            }
        } catch (Exception e) {
            log.error("Error creating users", e);
        }
    }

    private void initializeCommunities() {
        try {
            if (communityRepository.count() == 0) {
                log.info("Creating sample communities...");

                // Deskripsi yang lebih rapi dan tidak terlalu panjang
                String[][] communities = {
                        {"Technology Enthusiasts",
                                "A vibrant community for technology lovers, developers, and professionals passionate about innovation."},

                        {"Academic Research",
                                "Connect with fellow researchers, share findings, and collaborate on academic projects."},

                        {"Student Organizations",
                                "Hub for various student organizations, clubs, and extracurricular activities on campus."},

                        {"Creative Arts & Design",
                                "Community for artists, designers, and creative professionals to showcase work and exchange ideas."},

                        {"Sports & Recreation",
                                "Join fellow sports enthusiasts for recreational activities and athletic events on campus."},

                        {"Environmental Awareness",
                                "Dedicated to promoting environmental conservation and sustainability practices."}
                };

                for (String[] communityData : communities) {
                    Community community = new Community();
                    community.setName(communityData[0]);
                    community.setDescription(communityData[1]);
                    communityRepository.save(community);
                }

                log.info("Sample communities created successfully");
            }
        } catch (Exception e) {
            log.error("Error creating communities", e);
        }
    }

    private void initializeEvents() {
        try {
            if (eventRepository.count() == 0) {
                log.info("Creating sample events...");

                // Create sample events
                Event event1 = new Event();
                event1.setTitle("Tech Innovation Summit 2025");
                event1.setDescription("Annual technology innovation summit featuring the latest trends and industry insights.");
                event1.setStartDate(LocalDate.of(2025, 8, 15));
                event1.setEndDate(LocalDate.of(2025, 8, 17));
                event1.setRegistrationDeadline(LocalDate.of(2025, 8, 1));
                eventRepository.save(event1);

                Event event2 = new Event();
                event2.setTitle("Academic Research Conference");
                event2.setDescription("International conference showcasing cutting-edge research methodologies and findings.");
                event2.setStartDate(LocalDate.of(2025, 9, 10));
                event2.setEndDate(LocalDate.of(2025, 9, 12));
                event2.setRegistrationDeadline(LocalDate.of(2025, 8, 25));
                eventRepository.save(event2);

                Event event3 = new Event();
                event3.setTitle("Innovation Workshop");
                event3.setDescription("Hands-on workshop designed to foster innovation mindset and entrepreneurial skills.");
                event3.setStartDate(LocalDate.of(2025, 7, 20));
                event3.setEndDate(LocalDate.of(2025, 7, 21));
                event3.setRegistrationDeadline(LocalDate.of(2025, 7, 10));
                eventRepository.save(event3);

                log.info("Sample events created successfully");
            }
        } catch (Exception e) {
            log.error("Error creating events", e);
        }
    }

    private void initializeJournals() {
        try {
            if (journalRepository.count() == 0) {
                log.info("Creating sample journals...");

                // Get some users for journal creation
                Optional<User> user1 = userRepository.findByEmail("sarah@iyip.com");
                Optional<User> user2 = userRepository.findByEmail("michael@iyip.com");
                Optional<User> user3 = userRepository.findByEmail("user@iyip.com");
                Optional<User> user4 = userRepository.findByEmail("usera@iyip.com");

                if (user1.isPresent()) {
                    Journal journal1 = new Journal();
                    journal1.setTitle("AI in Healthcare: Revolutionary Approaches");
                    journal1.setContent("This research explores the transformative application of artificial intelligence in modern healthcare systems.");
                    journal1.setIsPublic(true);
                    journal1.setUser(user1.get());
                    journalRepository.save(journal1);
                }

                if (user2.isPresent()) {
                    Journal journal2 = new Journal();
                    journal2.setTitle("Blockchain Technology in Financial Systems");
                    journal2.setContent("An comprehensive analysis of blockchain implementation in financial systems and security measures.");
                    journal2.setIsPublic(true);
                    journal2.setUser(user2.get());
                    journalRepository.save(journal2);
                }

                if (user3.isPresent()) {
                    Journal journal3 = new Journal();
                    journal3.setTitle("Sustainable Engineering Practices");
                    journal3.setContent("Exploring sustainable approaches in engineering design and environmental impact reduction.");
                    journal3.setIsPublic(false);
                    journal3.setUser(user3.get());
                    journalRepository.save(journal3);
                }

                if (user4.isPresent()) {
                    Journal journal4 = new Journal();
                    journal4.setTitle("Modern Web Development Frameworks");
                    journal4.setContent("A comprehensive study of contemporary web development frameworks and their practical applications.");
                    journal4.setIsPublic(true);
                    journal4.setUser(user4.get());
                    journalRepository.save(journal4);
                }

                log.info("Sample journals created successfully");
            }
        } catch (Exception e) {
            log.error("Error creating journals", e);
        }
    }

    private void initializeSubmissions() {
        try {
            if (submissionRepository.count() == 0) {
                log.info("Creating sample submissions...");

                // Get some users for submission creation
                Optional<User> user1 = userRepository.findByEmail("user@iyip.com");
                Optional<User> user2 = userRepository.findByEmail("user2@iyip.com");
                Optional<User> user3 = userRepository.findByEmail("usera@iyip.com");
                Optional<User> user4 = userRepository.findByEmail("userb@iyip.com");

                if (user1.isPresent()) {
                    Submission submission1 = new Submission();
                    submission1.setTitle("Research Laboratory Proposal");
                    submission1.setContent("Comprehensive proposal for establishing a state-of-the-art research laboratory.");
                    submission1.setType(Submission.SubmissionType.MATERIAL);
                    submission1.setStatus(Submission.SubmissionStatus.PENDING);
                    submission1.setFileUrl("https://example.com/research-proposal.pdf");
                    submission1.setUser(user1.get());
                    submissionRepository.save(submission1);
                }

                if (user2.isPresent()) {
                    Submission submission2 = new Submission();
                    submission2.setTitle("Advanced Research Laboratory Equipment");
                    submission2.setContent("Request for advanced laboratory equipment for cutting-edge research activities.");
                    submission2.setType(Submission.SubmissionType.FASILITAS);
                    submission2.setStatus(Submission.SubmissionStatus.APPROVED);
                    submission2.setFileUrl("https://example.com/lab-equipment.pdf");
                    submission2.setUser(user2.get());
                    submissionRepository.save(submission2);
                }

                if (user3.isPresent()) {
                    Submission submission3 = new Submission();
                    submission3.setTitle("Web Development Course Materials");
                    submission3.setContent("Complete course material for web development covering modern frameworks and best practices.");
                    submission3.setType(Submission.SubmissionType.MATERIAL);
                    submission3.setStatus(Submission.SubmissionStatus.APPROVED);
                    submission3.setFileUrl("https://example.com/web-dev.pdf");
                    submission3.setUser(user3.get());
                    submissionRepository.save(submission3);
                }

                if (user4.isPresent()) {
                    Submission submission4 = new Submission();
                    submission4.setTitle("Student Collaborative Space");
                    submission4.setContent("Proposal for modern collaborative workspace for student projects and group activities.");
                    submission4.setType(Submission.SubmissionType.FASILITAS);
                    submission4.setStatus(Submission.SubmissionStatus.REJECTED);
                    submission4.setFileUrl("https://example.com/workspace.pdf");
                    submission4.setUser(user4.get());
                    submissionRepository.save(submission4);
                }

                log.info("Sample submissions created successfully");
            }
        } catch (Exception e) {
            log.error("Error creating submissions", e);
        }
    }
}