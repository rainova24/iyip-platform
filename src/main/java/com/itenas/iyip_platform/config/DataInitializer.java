// src/main/java/com/itenas/iyip_platform/config/DataInitializer.java
// SIMPLE VERSION - sesuai struktur existing dan tambah Journals + Submissions

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

                // Create admin user
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

                // Create regular users dengan nama yang diminta
                String[][] users = {
                        {"Regular User 1", "USER001", "user@iyip.com", "user123", "Jawa Barat", "Bandung"},
                        {"Regular User 2", "USER002", "user2@iyip.com", "user123", "DKI Jakarta", "Jakarta"},
                        {"Sarah Johnson", "USER003", "sarah@iyip.com", "sarah123", "Jawa Timur", "Surabaya"},
                        {"Michael Chen", "USER004", "michael@iyip.com", "michael123", "Jawa Tengah", "Semarang"}
                };

                for (String[] userData : users) {
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
                log.info("- Admin: admin@iyip.com / admin123");
                log.info("- Regular User 1: user@iyip.com / user123");
                log.info("- Regular User 2: user2@iyip.com / user123");
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
                                "A platform for student organizations to network and collaborate on campus initiatives."},

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

                Object[][] events = {
                        {"Tech Innovation Summit 2025",
                                "Annual technology innovation summit featuring the latest trends and industry insights.",
                                LocalDate.of(2025, 8, 15), LocalDate.of(2025, 8, 17), LocalDate.of(2025, 8, 1)},

                        {"Academic Research Conference",
                                "International conference showcasing cutting-edge research methodologies and findings.",
                                LocalDate.of(2025, 9, 10), LocalDate.of(2025, 9, 12), LocalDate.of(2025, 8, 25)},

                        {"Innovation Workshop",
                                "Hands-on workshop designed to foster innovation mindset and entrepreneurial skills.",
                                LocalDate.of(2025, 7, 20), LocalDate.of(2025, 7, 21), LocalDate.of(2025, 7, 10)}
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
        } catch (Exception e) {
            log.error("Error creating events", e);
        }
    }

    private void initializeJournals() {
        try {
            if (journalRepository.count() == 0) {
                log.info("Creating sample journals...");

                Optional<User> sarahOpt = userRepository.findByEmail("sarah@iyip.com");
                Optional<User> michaelOpt = userRepository.findByEmail("michael@iyip.com");
                Optional<User> user1Opt = userRepository.findByEmail("user@iyip.com");

                if (sarahOpt.isPresent() && michaelOpt.isPresent() && user1Opt.isPresent()) {
                    User sarah = sarahOpt.get();
                    User michael = michaelOpt.get();
                    User user1 = user1Opt.get();

                    Object[][] journals = {
                            {sarah, "AI in Healthcare: Revolutionary Approaches",
                                    "This research explores the transformative application of artificial intelligence in modern healthcare systems.",
                                    true, null},

                            {michael, "Blockchain Technology for Financial Security",
                                    "An comprehensive analysis of blockchain implementation in financial systems and security measures.",
                                    true, null},

                            {user1, "Machine Learning in Educational Technology",
                                    "Exploring how machine learning enhances personalized learning experiences in modern education.",
                                    false, null},

                            {sarah, "Cybersecurity Challenges in IoT Devices",
                                    "Analyzing security vulnerabilities in Internet of Things devices and protection mechanisms.",
                                    true, null}
                    };

                    for (Object[] journalData : journals) {
                        Journal journal = new Journal();
                        journal.setUser((User) journalData[0]);
                        journal.setTitle((String) journalData[1]);
                        journal.setContent((String) journalData[2]);
                        journal.setIsPublic((Boolean) journalData[3]);
                        journal.setThumbnailUrl((String) journalData[4]);
                        journalRepository.save(journal);
                    }

                    log.info("Sample journals created successfully");
                }
            }
        } catch (Exception e) {
            log.error("Error creating journals", e);
        }
    }

    private void initializeSubmissions() {
        try {
            if (submissionRepository.count() == 0) {
                log.info("Creating sample submissions...");

                Optional<User> user1Opt = userRepository.findByEmail("user@iyip.com");
                Optional<User> user2Opt = userRepository.findByEmail("user2@iyip.com");
                Optional<User> sarahOpt = userRepository.findByEmail("sarah@iyip.com");

                if (user1Opt.isPresent() && user2Opt.isPresent() && sarahOpt.isPresent()) {
                    User user1 = user1Opt.get();
                    User user2 = user2Opt.get();
                    User sarah = sarahOpt.get();

                    Object[][] submissions = {
                            {user1, Submission.SubmissionType.MATERIAL, "Introduction to Machine Learning",
                                    "Comprehensive educational material covering fundamental concepts of machine learning.",
                                    "https://example.com/ml-material.pdf", Submission.SubmissionStatus.PENDING},

                            {sarah, Submission.SubmissionType.FASILITAS, "Advanced Research Laboratory Equipment",
                                    "Request for state-of-the-art equipment to support ongoing research projects.",
                                    "https://example.com/lab-equipment.pdf", Submission.SubmissionStatus.APPROVED},

                            {user2, Submission.SubmissionType.MATERIAL, "Web Development Course",
                                    "Complete course material for web development covering modern frameworks.",
                                    "https://example.com/web-dev.pdf", Submission.SubmissionStatus.APPROVED},

                            {user1, Submission.SubmissionType.FASILITAS, "Student Collaborative Space",
                                    "Proposal for modern collaborative workspace for student projects.",
                                    "https://example.com/workspace.pdf", Submission.SubmissionStatus.REJECTED}
                    };

                    for (Object[] submissionData : submissions) {
                        Submission submission = new Submission();
                        submission.setUser((User) submissionData[0]);
                        submission.setType((Submission.SubmissionType) submissionData[1]);
                        submission.setTitle((String) submissionData[2]);
                        submission.setContent((String) submissionData[3]);
                        submission.setFileUrl((String) submissionData[4]);
                        submission.setStatus((Submission.SubmissionStatus) submissionData[5]);
                        submissionRepository.save(submission);
                    }

                    log.info("Sample submissions created successfully");
                }
            }
        } catch (Exception e) {
            log.error("Error creating submissions", e);
        }
    }
}