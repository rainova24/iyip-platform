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
CREATE DATABASE IF NOT EXISTS `crud_iyip` /*!40100 DEFAULT CHARACTER SET latin1 */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `crud_iyip`;

-- Dumping structure for table crud_iyip.communities
CREATE TABLE IF NOT EXISTS `communities` (
  `community_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `description` text,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`community_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table crud_iyip.communities: ~6 rows (approximately)
INSERT INTO `communities` (`community_id`, `created_at`, `updated_at`, `description`, `name`) VALUES
	(1, '2025-06-15 13:55:35.230137', '2025-06-15 13:55:35.230137', 'A vibrant community for technology lovers, developers, and professionals passionate about innovation.', 'Technology Enthusiasts'),
	(2, '2025-06-15 13:55:35.235840', '2025-06-15 13:55:35.235840', 'Connect with fellow researchers, share findings, and collaborate on academic projects.', 'Academic Research'),
	(3, '2025-06-15 13:55:35.237854', '2025-06-15 13:55:35.237854', 'A platform for student organizations to network and collaborate on campus initiatives.', 'Student Organizations'),
	(4, '2025-06-15 13:55:35.239851', '2025-06-15 13:55:35.239851', 'Community for artists, designers, and creative professionals to showcase work and exchange ideas.', 'Creative Arts & Design'),
	(5, '2025-06-15 13:55:35.240841', '2025-06-15 13:55:35.240841', 'Join fellow sports enthusiasts for recreational activities and athletic events on campus.', 'Sports & Recreation'),
	(6, '2025-06-15 13:55:35.242841', '2025-06-15 13:55:35.242841', 'Dedicated to promoting environmental conservation and sustainability practices.', 'Environmental Awareness');

-- Dumping structure for table crud_iyip.events
CREATE TABLE IF NOT EXISTS `events` (
  `event_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `description` text,
  `end_date` date NOT NULL,
  `registration_deadline` date DEFAULT NULL,
  `start_date` date NOT NULL,
  `title` varchar(150) NOT NULL,
  PRIMARY KEY (`event_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

-- Dumping data for table crud_iyip.events: ~3 rows (approximately)
INSERT INTO `events` (`event_id`, `created_at`, `updated_at`, `description`, `end_date`, `registration_deadline`, `start_date`, `title`) VALUES
	(1, '2025-06-15 13:55:35.247867', '2025-06-15 13:55:35.247867', 'Annual technology innovation summit featuring the latest trends and industry insights.', '2025-08-17', '2025-08-01', '2025-08-15', 'Tech Innovation Summit 2025'),
	(2, '2025-06-15 13:55:35.250876', '2025-06-15 13:55:35.250876', 'International conference showcasing cutting-edge research methodologies and findings.', '2025-09-12', '2025-08-25', '2025-09-10', 'Academic Research Conference'),
	(3, '2025-06-15 13:55:35.252881', '2025-06-15 13:55:35.252881', 'Hands-on workshop designed to foster innovation mindset and entrepreneurial skills.', '2025-07-21', '2025-07-10', '2025-07-20', 'Innovation Workshop');

-- Dumping structure for table crud_iyip.event_registrations
CREATE TABLE IF NOT EXISTS `event_registrations` (
  `event_registration_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `registered_at` datetime(6) NOT NULL,
  `event_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`event_registration_id`),
  KEY `FK6eykq6wu4n23qhn5vwb8kyut5` (`event_id`),
  KEY `FKnk7jh3bmmv11csoxkjnb6av4h` (`user_id`),
  CONSTRAINT `FK6eykq6wu4n23qhn5vwb8kyut5` FOREIGN KEY (`event_id`) REFERENCES `events` (`event_id`),
  CONSTRAINT `FKnk7jh3bmmv11csoxkjnb6av4h` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

-- Dumping data for table crud_iyip.event_registrations: ~0 rows (approximately)
INSERT INTO `event_registrations` (`event_registration_id`, `created_at`, `updated_at`, `registered_at`, `event_id`, `user_id`) VALUES
	(1, '2025-06-15 14:04:18.257362', '2025-06-15 14:04:18.257362', '2025-06-15 14:04:18.259332', 2, 2);

-- Dumping structure for table crud_iyip.journals
CREATE TABLE IF NOT EXISTS `journals` (
  `journal_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `content` text,
  `is_public` bit(1) NOT NULL,
  `thumbnail_url` text,
  `title` varchar(150) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`journal_id`),
  KEY `FK7h9nack4wfpjbgm0queg0q3em` (`user_id`),
  CONSTRAINT `FK7h9nack4wfpjbgm0queg0q3em` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

-- Dumping data for table crud_iyip.journals: ~4 rows (approximately)
INSERT INTO `journals` (`journal_id`, `created_at`, `updated_at`, `content`, `is_public`, `thumbnail_url`, `title`, `user_id`) VALUES
	(1, '2025-06-15 13:55:35.269947', '2025-06-15 13:55:35.269947', 'This research explores the transformative application of artificial intelligence in modern healthcare systems.', b'1', NULL, 'AI in Healthcare: Revolutionary Approaches', 4),
	(2, '2025-06-15 13:55:35.272955', '2025-06-15 13:55:35.272955', 'An comprehensive analysis of blockchain implementation in financial systems and security measures.', b'1', NULL, 'Blockchain Technology for Financial Security', 5),
	(3, '2025-06-15 13:55:35.275947', '2025-06-15 16:23:43.766585', '(SUDAH DIEDIT) Exploring how machine learning enhances personalized learning experiences in modern education.', b'1', '', 'Machine Learning in Educational Technology (SUDAH DIEDIT)', 2),
	(4, '2025-06-15 13:55:35.277202', '2025-06-15 13:55:35.277202', 'Analyzing security vulnerabilities in Internet of Things devices and protection mechanisms.', b'1', NULL, 'Cybersecurity Challenges in IoT Devices', 4);

-- Dumping structure for table crud_iyip.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` bigint NOT NULL AUTO_INCREMENT,
  `description` text,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`role_id`),
  UNIQUE KEY `UKofx66keruapi6vyqpv6f2or37` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

-- Dumping data for table crud_iyip.roles: ~2 rows (approximately)
INSERT INTO `roles` (`role_id`, `description`, `name`) VALUES
	(1, 'Administrator role with full access', 'ADMIN'),
	(2, 'Regular user role', 'USER');

-- Dumping structure for table crud_iyip.submissions
CREATE TABLE IF NOT EXISTS `submissions` (
  `submission_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `content` text,
  `file_url` text,
  `status` enum('APPROVED','PENDING','REJECTED') NOT NULL,
  `submitted_at` datetime(6) NOT NULL,
  `title` varchar(150) NOT NULL,
  `type` enum('FASILITAS','MATERIAL') NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`submission_id`),
  KEY `FK760bgu69957phd7hax608jdms` (`user_id`),
  CONSTRAINT `FK760bgu69957phd7hax608jdms` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table crud_iyip.submissions: ~5 rows (approximately)
INSERT INTO `submissions` (`submission_id`, `created_at`, `updated_at`, `content`, `file_url`, `status`, `submitted_at`, `title`, `type`, `user_id`) VALUES
	(1, '2025-06-15 13:55:35.288218', '2025-06-15 13:55:35.288218', 'Comprehensive educational material covering fundamental concepts of machine learning.', 'https://example.com/ml-material.pdf', 'PENDING', '2025-06-15 13:55:35.290233', 'Introduction to Machine Learning', 'MATERIAL', 2),
	(2, '2025-06-15 13:55:35.292227', '2025-06-15 13:55:35.292227', 'Request for state-of-the-art equipment to support ongoing research projects.', 'https://example.com/lab-equipment.pdf', 'APPROVED', '2025-06-15 13:55:35.292227', 'Advanced Research Laboratory Equipment', 'FASILITAS', 4),
	(3, '2025-06-15 13:55:35.294218', '2025-06-15 13:55:35.294218', 'Complete course material for web development covering modern frameworks.', 'https://example.com/web-dev.pdf', 'APPROVED', '2025-06-15 13:55:35.294218', 'Web Development Course', 'MATERIAL', 3),
	(4, '2025-06-15 13:55:35.296734', '2025-06-15 13:55:35.296734', 'Proposal for modern collaborative workspace for student projects.', 'https://example.com/workspace.pdf', 'REJECTED', '2025-06-15 13:55:35.296734', 'Student Collaborative Space', 'FASILITAS', 2),
	(5, '2025-06-15 14:01:51.791926', '2025-06-15 14:01:51.791926', 'Rancangan Laboratorium Penelitian', 'https://storage.example.com/research-paper.pdf', 'PENDING', '2025-06-15 14:01:51.791926', 'Laboratorium Penelitian', 'FASILITAS', 5),
	(6, '2025-06-15 16:28:18.291825', '2025-06-15 16:28:18.291825', 'Laboratorium Penelitian untuk percobaan menarik', '', 'PENDING', '2025-06-15 16:28:18.292847', 'Laboratorium Penelitian', 'FASILITAS', 2);

-- Dumping structure for table crud_iyip.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `birth_date` date DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `gender` enum('LAKI_LAKI','PEREMPUAN') DEFAULT NULL,
  `name` varchar(100) NOT NULL,
  `nim` varchar(11) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `registered_at` datetime(6) DEFAULT NULL,
  `role_id` bigint NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`),
  UNIQUE KEY `UKh5k5eqgbwmq6sh7k3nqfr1439` (`nim`),
  KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`),
  CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=latin1;

-- Dumping data for table crud_iyip.users: ~5 rows (approximately)
INSERT INTO `users` (`user_id`, `created_at`, `updated_at`, `birth_date`, `city`, `email`, `gender`, `name`, `nim`, `password`, `phone`, `province`, `registered_at`, `role_id`) VALUES
	(1, '2025-06-15 13:55:35.205631', '2025-06-15 13:55:35.205631', '1990-01-01', 'Jakarta', 'admin@iyip.com', 'LAKI_LAKI', 'Admin User', 'ADMIN001', 'admin123', '081234567890', 'DKI Jakarta', '2025-06-15 13:55:35.205631', 1),
	(2, '2025-06-15 13:55:35.218244', '2025-06-15 13:55:35.218244', '1995-06-15', 'Bandung', 'user@iyip.com', 'LAKI_LAKI', 'Regular User 1', 'USER001', 'user123', '081234567891', 'Jawa Barat', '2025-06-15 13:55:35.218244', 2),
	(3, '2025-06-15 13:55:35.221209', '2025-06-15 13:55:35.221209', '1995-06-15', 'Jakarta', 'user2@iyip.com', 'LAKI_LAKI', 'Regular User 2', 'USER002', 'user123', '081234567891', 'DKI Jakarta', '2025-06-15 13:55:35.221209', 2),
	(4, '2025-06-15 13:55:35.223247', '2025-06-15 13:55:35.223247', '1995-06-15', 'Surabaya', 'sarah@iyip.com', 'LAKI_LAKI', 'Sarah Johnson', 'USER003', 'sarah123', '081234567891', 'Jawa Timur', '2025-06-15 13:55:35.223247', 2),
	(5, '2025-06-15 13:55:35.224175', '2025-06-15 13:55:35.224175', '1995-06-15', 'Semarang', 'michael@iyip.com', 'LAKI_LAKI', 'Michael Chen', 'USER004', 'michael123', '081234567891', 'Jawa Tengah', '2025-06-15 13:55:35.224175', 2),
	(6, '2025-06-15 16:18:16.850532', '2025-06-15 16:18:16.851948', '2006-01-11', 'Kab. Subang', 'hasby@example.com', 'LAKI_LAKI', 'Hasby', '152023072', '123456', '085174370106', 'Jawa Barat', '2025-06-15 16:18:16.851948', 2);

-- Dumping structure for table crud_iyip.user_communities
CREATE TABLE IF NOT EXISTS `user_communities` (
  `user_community_id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `joined_at` datetime(6) NOT NULL,
  `community_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`user_community_id`),
  UNIQUE KEY `UKplhvm6qsws84f5tp6jxee2yfa` (`user_id`,`community_id`),
  KEY `FKsn40v9iqkrib7liwgarwpmuk` (`community_id`),
  CONSTRAINT `FK9913atxlxuoeu814eyoupytvs` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `FKsn40v9iqkrib7liwgarwpmuk` FOREIGN KEY (`community_id`) REFERENCES `communities` (`community_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- Dumping data for table crud_iyip.user_communities: ~0 rows (approximately)
INSERT INTO `user_communities` (`user_community_id`, `created_at`, `updated_at`, `joined_at`, `community_id`, `user_id`) VALUES
	(3, '2025-06-15 16:24:33.477403', '2025-06-15 16:24:33.477403', '2025-06-15 16:24:33.481364', 1, 2),
	(7, '2025-06-15 16:25:10.863014', '2025-06-15 16:25:10.863014', '2025-06-15 16:25:10.863014', 2, 2);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
