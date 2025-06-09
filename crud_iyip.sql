-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.30 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6951
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for crud_iyip
CREATE DATABASE IF NOT EXISTS `crud_iyip` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `crud_iyip`;

-- Dumping structure for table crud_iyip.communities
CREATE TABLE IF NOT EXISTS `communities` (
  `community_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`community_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table crud_iyip.communities: ~4 rows (approximately)
INSERT INTO `communities` (`community_id`, `name`, `description`, `created_at`, `updated_at`) VALUES
	(1, 'Technology Enthusiasts', 'Community for technology lovers and professionals', '2025-06-09 13:33:49', '2025-06-09 13:33:49'),
	(2, 'Academic Research', 'Community focused on academic research and publications', '2025-06-09 13:33:49', '2025-06-09 13:33:49'),
	(3, 'Student Organizations', 'Community for various student organizations', '2025-06-09 13:33:49', '2025-06-09 13:33:49'),
	(4, 'Creative Arts', 'Community for artists, designers, and creative professionals', '2025-06-09 13:33:49', '2025-06-09 13:33:49');

-- Dumping structure for table crud_iyip.events
CREATE TABLE IF NOT EXISTS `events` (
  `event_id` bigint NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` text,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `registration_deadline` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_id`),
  KEY `idx_events_start_date` (`start_date`),
  KEY `idx_events_registration_deadline` (`registration_deadline`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table crud_iyip.events: ~4 rows (approximately)
INSERT INTO `events` (`event_id`, `title`, `description`, `start_date`, `end_date`, `registration_deadline`, `created_at`, `updated_at`) VALUES
	(1, 'Tech Innovation Summit 2025', 'Annual technology innovation summit featuring latest trends and technologies', '2025-08-15', '2025-08-17', '2025-08-01', '2025-06-09 13:33:49', '2025-06-09 13:33:49'),
	(2, 'Academic Research Conference', 'International conference on academic research methodologies', '2025-09-10', '2025-09-12', '2025-08-25', '2025-06-09 13:33:49', '2025-06-09 13:33:49'),
	(3, 'Creative Arts Workshop', 'Workshop series on various creative arts techniques', '2025-07-20', '2025-07-22', '2025-07-10', '2025-06-09 13:33:49', '2025-06-09 13:33:49'),
	(4, 'Student Leadership Forum', 'Forum for developing student leadership skills', '2025-10-05', '2025-10-06', '2025-09-20', '2025-06-09 13:33:49', '2025-06-09 13:33:49');

-- Dumping structure for table crud_iyip.event_registrations
CREATE TABLE IF NOT EXISTS `event_registrations` (
  `event_registration_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `event_id` bigint NOT NULL,
  `registered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`event_registration_id`),
  UNIQUE KEY `unique_user_event` (`user_id`,`event_id`),
  KEY `idx_event_registrations_user_id` (`user_id`),
  KEY `idx_event_registrations_event_id` (`event_id`),
  KEY `idx_event_registrations_registered_at` (`registered_at` DESC),
  CONSTRAINT `event_registrations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `event_registrations_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table crud_iyip.event_registrations: ~0 rows (approximately)

-- Dumping structure for table crud_iyip.journals
CREATE TABLE IF NOT EXISTS `journals` (
  `journal_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `title` varchar(150) NOT NULL,
  `content` text,
  `thumbnail_url` text,
  `is_public` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`journal_id`),
  KEY `idx_journals_user_id` (`user_id`),
  KEY `idx_journals_is_public` (`is_public`),
  KEY `idx_journals_created_at` (`created_at` DESC),
  CONSTRAINT `journals_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table crud_iyip.journals: ~0 rows (approximately)

-- Dumping structure for table crud_iyip.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table crud_iyip.roles: ~2 rows (approximately)
INSERT INTO `roles` (`role_id`, `name`, `description`, `created_at`, `updated_at`) VALUES
	(1, 'ADMIN', 'Administrator role with full access', '2025-06-09 13:33:49', '2025-06-09 13:33:49'),
	(2, 'USER', 'Regular user role', '2025-06-09 13:33:49', '2025-06-09 13:33:49');

-- Dumping structure for table crud_iyip.submissions
CREATE TABLE IF NOT EXISTS `submissions` (
  `submission_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `type` enum('MATERIAL','FASILITAS') NOT NULL,
  `title` varchar(150) NOT NULL,
  `content` text,
  `file_url` text,
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('PENDING','APPROVED','REJECTED') DEFAULT 'PENDING',
  PRIMARY KEY (`submission_id`),
  KEY `idx_submissions_user_id` (`user_id`),
  KEY `idx_submissions_status` (`status`),
  KEY `idx_submissions_type` (`type`),
  KEY `idx_submissions_submitted_at` (`submitted_at` DESC),
  CONSTRAINT `submissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table crud_iyip.submissions: ~0 rows (approximately)

-- Dumping structure for table crud_iyip.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `nim` varchar(11) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(100) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `gender` enum('LAKI_LAKI','PEREMPUAN') DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `registered_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nim` (`nim`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table crud_iyip.users: ~2 rows (approximately)
INSERT INTO `users` (`user_id`, `name`, `nim`, `password`, `email`, `birth_date`, `gender`, `phone`, `province`, `city`, `registered_at`, `updated_at`, `role_id`) VALUES
	(1, 'Admin User', 'AA-23-00001', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8LzMHzEw2hl0JneDEG', 'admin@iyip.com', NULL, NULL, NULL, NULL, NULL, '2025-06-09 13:33:49', '2025-06-09 13:36:25', 1),
	(2, 'Regular User', 'UU-23-00001', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8LzMHzEw2hl0JneDEG', 'user@iyip.com', NULL, NULL, NULL, NULL, NULL, '2025-06-09 13:33:49', '2025-06-09 13:36:36', 2);

-- Dumping structure for table crud_iyip.user_communities
CREATE TABLE IF NOT EXISTS `user_communities` (
  `user_community_id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL,
  `community_id` bigint NOT NULL,
  `joined_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_community_id`),
  UNIQUE KEY `unique_user_community` (`user_id`,`community_id`),
  KEY `idx_user_communities_user_id` (`user_id`),
  KEY `idx_user_communities_community_id` (`community_id`),
  CONSTRAINT `user_communities_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `user_communities_ibfk_2` FOREIGN KEY (`community_id`) REFERENCES `communities` (`community_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table crud_iyip.user_communities: ~0 rows (approximately)

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
