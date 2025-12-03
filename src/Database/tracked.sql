-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Dec 02, 2025 at 08:10 PM
-- Server version: 11.8.3-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u713320770_tracked`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `id` int(11) NOT NULL,
  `subject_code` varchar(10) NOT NULL,
  `professor_ID` varchar(20) NOT NULL,
  `activity_type` varchar(50) NOT NULL,
  `task_number` varchar(50) NOT NULL,
  `title` varchar(255) NOT NULL,
  `instruction` text DEFAULT NULL,
  `link` varchar(500) DEFAULT NULL,
  `points` int(11) DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `archived` tinyint(1) DEFAULT 0,
  `school_work_edited` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`id`, `subject_code`, `professor_ID`, `activity_type`, `task_number`, `title`, `instruction`, `link`, `points`, `deadline`, `created_at`, `updated_at`, `archived`, `school_work_edited`) VALUES
(53, 'DQ1766', '202210602', 'Assignment', 'Assignment', 'Song lyricist', 'Create a musicalkhfilubawlb', '', 10, '2025-11-12 20:45:00', '2025-11-11 12:47:49', '2025-11-11 12:47:49', 0, 0),
(54, 'DQ1766', '202210602', 'Assignment', 'Assignment 2', 'Songerist', 'dubi dubi duwa', '', 20, '2025-11-13 20:58:00', '2025-11-11 12:58:14', '2025-11-11 13:15:59', 1, 0),
(55, 'DQ1766', '202210602', 'Assignment', 'Assignment 2', 'Songerist', 'dubi dubi duwa', '', 20, '2025-11-13 20:58:00', '2025-11-11 12:58:18', '2025-11-11 13:15:54', 1, 0),
(56, 'DQ1766', '202210602', 'Activity', 'Activity 1', 'Dance and Sing', 'Sing along with Elsa.', '', 30, '2025-11-14 22:52:00', '2025-11-11 14:52:26', '2025-11-11 14:52:26', 0, 0),
(57, 'DQ1766', '202210602', 'Project', 'Project 1', 'Idol Project', 'Do a concert', '', 50, '2025-11-14 23:06:00', '2025-11-11 15:06:31', '2025-11-11 15:06:31', 0, 0),
(58, 'DQ1766', '202210602', 'Laboratory', 'Laboratory 1', 'Lab Live', 'work as a team and produce a concert worthy of your fans', '', 50, '2025-11-17 06:42:00', '2025-11-11 22:42:15', '2025-11-11 22:42:15', 0, 0),
(59, 'DQ1766', '202210602', 'Assignment', 'Assignment 5', 'Cover Up', 'Produce a cover song of a famous song', '', 30, '2025-11-19 07:40:00', '2025-11-11 23:40:19', '2025-11-11 23:40:19', 0, 0),
(60, 'DQ1766', '202210602', 'Laboratory', 'Laboratory 2', 'Anonymous Concerto', 'Produce your own concert without the help of your agency', '', 30, '2025-11-20 08:04:00', '2025-11-12 00:04:55', '2025-11-12 00:04:55', 0, 0),
(61, 'DQ1766', '202210602', 'Laboratory', 'Laboratory 3', 'Actingerist', 'Be more than just an Idol', '', 50, '2025-11-15 09:06:00', '2025-11-12 01:06:08', '2025-11-12 01:06:08', 0, 0),
(62, 'DQ1766', '202210602', 'Laboratory', 'Laboratory 4', 'Musical Heart', 'Create a song that brings out your soul', '', 40, '2025-11-18 09:39:00', '2025-11-12 01:39:20', '2025-11-12 01:39:20', 0, 0),
(64, 'DQ1766', '202210602', 'Quiz', 'Quiz 1', 'Fill in the Songs', 'You\'ll be given a song, and you must sing and figure out the lyrics blanked out.', '', 20, '2025-11-18 10:34:00', '2025-11-16 02:34:15', '2025-11-16 02:34:15', 0, 0),
(65, 'AY0822', '202210602', 'Quiz', 'Quiz 1', 'How are you?', 'Simple quiz to test your knowledge.', '', 10, '2025-11-17 14:26:00', '2025-11-16 06:26:13', '2025-11-16 06:26:13', 0, 0),
(66, 'SO0261', '202210602', 'Laboratory', 'Laboratory 1', 'Labubu', 'Make Labubu dance', '', 50, '2025-11-18 06:35:00', '2025-11-16 07:32:41', '2025-11-16 07:32:41', 0, 0),
(67, 'SO0261', '202210602', 'Quiz', 'Quiz 1', 'Quizno', 'Heheyhey fortune cookie', '', 50, '2025-11-18 18:31:00', '2025-11-16 10:31:12', '2025-11-16 10:31:12', 0, 0),
(68, 'DQ1766', '202210602', 'Quiz', '5', 'Birthday', 'happy birthday', '', 20, '2025-12-02 13:19:00', '2025-12-01 05:19:42', '2025-12-01 07:36:26', 1, 0),
(69, 'DQ1766', '202210602', 'Assignment', '5', 'Birthday', 'dryhdfhydf', '', 20, '2025-12-04 15:00:00', '2025-12-01 07:00:48', '2025-12-01 07:00:48', 0, 0),
(70, 'DQ1766', '202210602', 'Quiz', '1', 'h', 'ifyiufyiy', '', 20, '2025-12-11 15:15:00', '2025-12-01 07:16:15', '2025-12-01 07:16:15', 0, 0),
(71, 'DQ1766', '202210602', 'Laboratory', '4', 'bday', 'ifyiufyiy', '', 20, '2025-12-11 15:15:00', '2025-12-01 07:16:53', '2025-12-01 07:16:53', 0, 0),
(72, 'DQ1766', '202210602', 'Assignment', '10', 'abc', 'gmsekgnsgnaeeeeeeeeeeeeeeeoi[iw[[[[[[[[[[[[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[w[jgndijgnjdsgnsjkdgnsgnskjgnjgnsdggsgseggsgsg', '', 100, '2026-01-03 21:33:00', '2025-12-01 09:33:42', '2025-12-01 09:33:42', 0, 0),
(73, 'LV3738', '202210602', 'Assignment', '1', 'SAMPLE', 'SAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLESAMPLE', '', 100, '2025-12-02 23:59:00', '2025-12-02 09:40:03', '2025-12-02 16:28:06', 0, 1),
(74, 'LV3738', '202210602', 'Quiz', '1', 'TESTING', 'TESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTINGTESTING', '', 100, '2025-12-04 10:30:00', '2025-12-02 18:18:19', '2025-12-02 18:18:19', 0, 0);

-- --------------------------------------------------------

--
-- Table structure for table `activity_files`
--

CREATE TABLE `activity_files` (
  `id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `student_id` varchar(20) NOT NULL,
  `file_name` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_url` varchar(500) NOT NULL,
  `file_size` int(11) NOT NULL,
  `file_type` varchar(100) DEFAULT NULL,
  `uploaded_by` varchar(50) DEFAULT 'professor',
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_files`
--

INSERT INTO `activity_files` (`id`, `activity_id`, `student_id`, `file_name`, `original_name`, `file_url`, `file_size`, `file_type`, `uploaded_by`, `uploaded_at`) VALUES
(1, 74, '202210870', '1764704924_692f429ca441c_chae-2.jpg', 'chae-2.jpg', 'https://tracked.6minds.site/TrackEd_Uploads/To_Students/1764704924_692f429ca441c_chae-2.jpg', 1878626, 'image/jpeg', 'professor', '2025-12-02 19:48:44');

-- --------------------------------------------------------

--
-- Table structure for table `activity_grades`
--

CREATE TABLE `activity_grades` (
  `id` int(11) NOT NULL,
  `activity_ID` int(11) NOT NULL,
  `student_ID` varchar(20) NOT NULL,
  `grade` decimal(5,2) DEFAULT NULL,
  `submitted` tinyint(1) DEFAULT 0,
  `submitted_at` timestamp NULL DEFAULT NULL,
  `late` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `uploaded_file_url` varchar(500) DEFAULT NULL,
  `uploaded_file_name` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `announcement_ID` int(11) NOT NULL,
  `professor_ID` varchar(20) NOT NULL,
  `classroom_ID` varchar(10) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `link` varchar(500) DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`announcement_ID`, `professor_ID`, `classroom_ID`, `title`, `description`, `link`, `deadline`, `created_at`, `updated_at`) VALUES
(15, '202210602', 'AY0822', 'SIngerist', 'Baby SHark doo doo', NULL, '2025-11-19 14:43:00', '2025-11-12 06:43:48', '2025-11-20 23:30:36'),
(17, '202210602', 'DQ1766', 'CAPSTONE NA BAKLA', 'fdfsdf', 'facebook.com', NULL, '2025-12-01 05:34:39', '2025-12-01 05:57:20');

-- --------------------------------------------------------

--
-- Table structure for table `attendance`
--

CREATE TABLE `attendance` (
  `id` int(11) NOT NULL,
  `subject_code` varchar(10) NOT NULL,
  `professor_ID` varchar(20) NOT NULL,
  `attendance_date` date NOT NULL,
  `student_ID` varchar(20) NOT NULL,
  `status` enum('present','absent','late') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `attendance`
--

INSERT INTO `attendance` (`id`, `subject_code`, `professor_ID`, `attendance_date`, `student_ID`, `status`, `created_at`, `updated_at`) VALUES
(68, 'LV3738', '202210602', '2025-12-02', '202210870', 'present', '2025-12-02 16:05:14', '2025-12-02 16:05:14'),
(69, 'SO0261', '202210602', '2025-12-02', '202210718', 'present', '2025-12-02 17:14:40', '2025-12-02 17:14:40'),
(70, 'SO0261', '202210602', '2025-12-02', '202210784', 'present', '2025-12-02 17:14:40', '2025-12-02 17:14:40'),
(71, 'SO0261', '202210602', '2025-12-02', '202210870', 'late', '2025-12-02 17:14:40', '2025-12-02 17:14:40');

-- --------------------------------------------------------

--
-- Table structure for table `classes`
--

CREATE TABLE `classes` (
  `subject_code` varchar(10) NOT NULL,
  `year_level` varchar(20) NOT NULL,
  `subject` varchar(100) NOT NULL,
  `subject_semester` varchar(50) NOT NULL,
  `section` varchar(50) NOT NULL,
  `professor_ID` varchar(20) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(10) NOT NULL DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`subject_code`, `year_level`, `subject`, `subject_semester`, `section`, `professor_ID`, `created_at`, `updated_at`, `status`) VALUES
('AY0822', '3rd Year', 'ITEC111', '', 'A', '202210602', '2025-11-16 06:20:18', '2025-11-16 06:20:18', 'Active'),
('CD9416', '1st Year', 'DCIT101', '', 'P', '202210602', '2025-12-01 06:13:33', '2025-12-01 06:13:48', 'Archived'),
('DQ1766', '1st Year', 'Song Class', '', 'A', '202210602', '2025-11-11 07:21:11', '2025-11-30 21:09:22', 'Active'),
('LV3738', '1st Year', 'DCIT101', '', 'B', '202210602', '2025-11-30 13:53:52', '2025-11-30 13:53:52', 'Active'),
('MT7838', '1st Year', 'DCIT101', '', 'B', '202210602', '2025-12-01 05:59:28', '2025-12-01 05:59:43', 'Archived'),
('SO0261', '4th Year', 'OMG789', '', 'B', '202210602', '2025-11-16 07:31:13', '2025-11-16 07:31:13', 'Active'),
('WF1124', '1st Year', 'DCIT102', '', 'B', '202210602', '2025-11-30 13:51:42', '2025-11-30 13:51:42', 'Active'),
('YA5977', '2nd Year', 'DCIT101', '', 'A', '202210602', '2025-11-30 13:42:10', '2025-11-30 13:51:26', 'Archived');

-- --------------------------------------------------------

--
-- Table structure for table `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `tracked_ID` varchar(20) NOT NULL,
  `token` varchar(64) NOT NULL,
  `expiry` datetime NOT NULL,
  `used` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_classes`
--

CREATE TABLE `student_classes` (
  `id` int(11) NOT NULL,
  `student_ID` varchar(20) NOT NULL,
  `subject_code` varchar(10) NOT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `archived` tinyint(1) DEFAULT 0,
  `archived_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_classes`
--

INSERT INTO `student_classes` (`id`, `student_ID`, `subject_code`, `enrolled_at`, `archived`, `archived_at`) VALUES
(8, '202210718', 'DQ1766', '2025-11-11 07:29:15', 0, NULL),
(11, '202210784', 'DQ1766', '2025-11-16 04:58:50', 0, NULL),
(12, '202210784', 'AY0822', '2025-11-16 06:23:55', 0, NULL),
(13, '202210870', 'AY0822', '2025-11-16 06:24:20', 0, NULL),
(14, '202210718', 'AY0822', '2025-11-16 06:24:55', 0, NULL),
(15, '202210784', 'SO0261', '2025-11-16 07:31:25', 0, NULL),
(16, '202210718', 'SO0261', '2025-11-16 07:31:31', 0, NULL),
(17, '202210870', 'SO0261', '2025-11-16 07:31:37', 0, NULL),
(18, '202210870', 'DQ1766', '2025-12-01 05:07:20', 0, NULL),
(19, '202210870', 'LV3738', '2025-12-02 09:40:21', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `tracked_semester`
--

CREATE TABLE `tracked_semester` (
  `semesterID` int(1) NOT NULL,
  `class_semester` varchar(50) NOT NULL,
  `semester_status` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tracked_semester`
--

INSERT INTO `tracked_semester` (`semesterID`, `class_semester`, `semester_status`) VALUES
(1, 'first_sem', 'INACTIVE'),
(2, 'second_sem', 'ACTIVE'),
(3, 'summer_sem', 'INACTIVE');

-- --------------------------------------------------------

--
-- Table structure for table `tracked_users`
--

CREATE TABLE `tracked_users` (
  `tracked_ID` varchar(20) NOT NULL,
  `tracked_Role` varchar(20) NOT NULL DEFAULT 'Student',
  `tracked_email` varchar(100) NOT NULL,
  `tracked_password` varchar(255) NOT NULL,
  `tracked_firstname` varchar(50) NOT NULL,
  `tracked_lastname` varchar(50) NOT NULL,
  `tracked_middlename` varchar(50) DEFAULT NULL,
  `tracked_program` varchar(50) NOT NULL,
  `tracked_yearandsec` varchar(50) NOT NULL,
  `tracked_semester` varchar(50) NOT NULL,
  `tracked_bday` date NOT NULL,
  `tracked_gender` varchar(10) DEFAULT NULL,
  `tracked_phone` varchar(15) DEFAULT NULL,
  `tracked_Status` varchar(10) NOT NULL DEFAULT 'Active',
  `temporary_password` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tracked_users`
--

INSERT INTO `tracked_users` (`tracked_ID`, `tracked_Role`, `tracked_email`, `tracked_password`, `tracked_firstname`, `tracked_lastname`, `tracked_middlename`, `tracked_program`, `tracked_yearandsec`, `tracked_semester`, `tracked_bday`, `tracked_gender`, `tracked_phone`, `tracked_Status`, `temporary_password`, `created_at`, `updated_at`) VALUES
('1035', 'Professor', 'sherilyn.fajutagana@cvsu.edu.ph', '$2y$10$dmfo0xXTOqRVR6gOV50YSOBhCcGtBndDiy2eXzntdJDiNrlMYbA2O', 'Sherilyn', 'Fajutagana', 'Fontelo', 'Information Technology', 'Not Applicable', 'Not Applicable', '1993-08-15', 'Female', '9933302365', 'Active', '1993-08-15Professor10355XU', '2025-11-30 08:03:44', '2025-12-02 18:42:09'),
('12345', 'Admin', 'ic.brielle.balatayo@cvsu.edu.ph', '$2y$10$X02sc4F0wAaSQu7hUV92lO8jAbJeABQXso2X.KGXGD7PQzEP/hZPC', 'Brielle Edrian', 'Balatayo', 'Ana', 'Not Applicable', 'Not Applicable', 'Not Applicable', '2002-08-18', 'Male', '9153406553', 'Active', '', '2025-11-10 18:51:38', '2025-12-02 12:45:40'),
('202210602', 'Professor', 'ic.dhenizekristafaith.lopez@cvsu.edu.ph', '$2y$10$fs1xz27ArfH5sko9lE4JTeD526kP0h3KiqKwzeNuqh5JPdnpCHIj6', 'Dhenize Krista Faith', 'Lopez', 'Cabardo', 'Information Technology', 'Not Applicable', 'Not Applicable', '2004-11-24', 'Male', '9988262316', 'Active', '11242004Professor202210602RDO', '2025-11-10 18:51:38', '2025-11-30 21:08:58'),
('202210718', 'Student', 'ic.michaelrhoi.gonzales@cvsu.edu.ph', '$2y$10$lpU4wtviArsHNWnSZYaUOeYLxrsMnI5RKrMg8zN7lEAaWF6msmG1a', 'Michael Rhoi', 'Gonzales', 'Ladrica', 'BSIT', '4D', 'FIRST', '2004-06-20', 'Female', '9085527790', 'Active', '06202004Student202210718RK0', '2025-11-12 06:13:21', '2025-11-30 08:03:51'),
('202210781', 'Student', 'ic.cherlyvic.bakilid@cvsu.edu.ph', '$2y$10$kbrlN6VPTmT5vmJyQZMRH.wU/PpZR7FKFurLxMqucKtDuW8rU9sP6', 'Cherly Vic', 'Bakilid', 'C', 'Information Technology', '4D', 'FIRST', '2002-11-17', 'Female', '9168773102', 'Active', '2002-11-17Student202210781JRI', '2025-11-30 08:03:55', '2025-11-30 08:22:13'),
('202210784', 'Student', 'ic.jeannen.basay@cvsu.edu.ph', '$2y$10$Y8QljkEcyQRr0QBbKc8FqO1o1whehjnplAonKds8Wy1pSVmA6pSqW', 'Jeannen', 'Basay', 'Kummer', 'BSIT', '4D', 'SECOND', '2002-03-24', 'Female', '0', 'Active', '03242002Student202210784U3A', '2025-11-10 18:51:38', '2025-11-30 08:03:58'),
('202210838', 'Student', 'ic.katejustine.pades@cvsu.edu.ph', '$2y$10$qbyDvbBvhPWSopmVKpT9VOEr3ZothGXnHUmToGaKew/Pyf5OJjAhS', 'Kate Justine', 'Pades', 'B', 'Information Technology', '4D', 'FIRST', '2003-05-13', 'Female', '9777429816', 'Active', '2003-05-13Student202210838PT2', '2025-11-30 08:04:01', '2025-11-30 08:22:20'),
('202210868', 'Student', 'ic.cristelnicole.vergara@cvsu.edu.ph', '$2y$10$5AixCxR0i1j2cTJQfEAMVeyIIWn63PapELYekn/SYeVE.KyxTqzqi', 'Cristel Nicole', 'Vergara', 'S', 'Information Technology', '4D', 'FIRST', '2003-06-21', 'Female', '9234400863', 'Active', '2003-06-21Student202210868EPJ', '2025-11-30 08:04:04', '2025-11-30 08:29:18'),
('202210870', 'Student', 'ic.xyrilljohn.abreu@cvsu.edu.ph', '$2y$10$Fby1oL4QMAWABEui1Kjrh.HMxuSfnX4asnfNRPwv3gr.ky/dh9Bmy', 'Xyrill John', 'Abreu', 'Fecundo', 'BSIT', '4D', 'FIRST', '2003-08-03', 'Female', '9422169425', 'Active', '08032003Student202210870TWN', '2025-11-10 18:51:39', '2025-11-30 18:50:33'),
('20230003', 'Student', 'ic.juliaann.fajardo@cvsu.edu.ph', '$2y$10$5K50hKPFr/Lb636q0/V0u.4JibNRoke9sGzWBkwlOv1oxNbThf/OO', 'Julia Ann', 'Fajardo', 'Sisno', 'Information Technology', 'Not Applicable', 'Not Applicable', '2001-06-07', 'Female', '9679532083', 'Active', '06072001Professor20230003VFR', '2025-11-10 18:51:39', '2025-11-30 08:12:28');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_ID` varchar(20) NOT NULL,
  `user_firstname` varchar(50) NOT NULL,
  `user_middlename` varchar(50) NOT NULL,
  `user_lastname` varchar(50) NOT NULL,
  `user_Email` varchar(100) NOT NULL,
  `user_phonenumber` bigint(11) NOT NULL,
  `user_bday` varchar(50) NOT NULL,
  `user_Gender` varchar(10) DEFAULT NULL,
  `user_Role` varchar(20) NOT NULL DEFAULT 'Student',
  `user_yearandsection` varchar(50) NOT NULL,
  `user_program` varchar(50) NOT NULL,
  `user_semester` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_ID`, `user_firstname`, `user_middlename`, `user_lastname`, `user_Email`, `user_phonenumber`, `user_bday`, `user_Gender`, `user_Role`, `user_yearandsection`, `user_program`, `user_semester`) VALUES
('1035', 'Sherilyn', 'Fontelo', 'Fajutagana', 'sherilyn.fajutagana@cvsu.edu.ph', 9933302365, '1993-08-15', 'Female', 'Professor', 'Not Applicable', 'Information Technology', 'Not Applicable'),
('12345', 'Brielle Edrian', 'Ana', 'Balatayo', 'ic.brielle.balatayo@cvsu.edu.ph', 9153406553, '08/18/2002', 'Male', 'Admin', 'Not Applicable', 'Not Applicable', 'Not Applicable'),
('202111683', 'Noerjan', 'Catayong', 'Cleofe', 'ic.noerjan.cleofe@cvsu.edu.ph', 91234567891, '2002-10-17', 'Male', 'Student', '4D', 'Information Technology', 'FIRST'),
('202210602', 'Dhenize Krista Faith', 'Cabardo', 'Lopez', 'ic.dhenizekristafaith.lopez@cvsu.edu.ph', 9988262316, '11/24/2004', 'Male', 'Professor', 'Not Applicable', 'Information Technology', 'Not Applicable'),
('202210609', 'Matthew Keane', 'Yap', 'Mariano', 'ic.matthewkeane.mariano@cvsu.edu.ph', 91234567891, '2002-10-29', 'Male', 'Student', '4D', 'Information Technology', 'FIRST'),
('202210625', 'Ken Clarence', 'Roque', 'Orosco', 'ic.kenclarence.orosco@cvsu.edu.ph', 91234567891, '2003-12-23', 'Male', 'Student', '4D', 'Information Technology', 'FIRST'),
('202210631', 'Marc Edlin', 'Reyes', 'Pasquin', 'ic.marcedlin.pasquin.cvsu.edu.ph', 91234567891, '2003-12-02', 'Male', 'Student', '4D', 'Information Technology', 'FIRST'),
('202210669', 'Geruel', 'Hilado', 'Alcaraz', 'ic.geruel.alcaraz@cvsu.edu.ph', 91234567891, '2002-12-09', 'Male', 'Student', '4G', 'Information Technology', 'FIRST'),
('202210700', 'John Car Michael', 'Delos Santos', 'Delos Reyes', 'ic.johncarmichael.delosreyes@cvsu.edu.ph', 91234567891, '2002-05-18', 'Male', 'Student', '4G', 'Information Technology', 'FIRST'),
('202210718', 'Michael Rhoi', 'Ladrica', 'Gonzales', 'ic.michaelrhoi.gonzales@cvsu.edu.ph', 9085527790, '06/20/2004', 'Female', 'Student', '4D', 'Information Technology', 'FIRST'),
('202210781', 'Cherly Vic', 'C', 'Bakilid', 'ic.cherlyvic.bakilid@cvsu.edu.ph', 9168773102, '2002-11-17', 'Female', 'Student', '4F', 'Information Technology', 'FIRST'),
('202210784', 'Jeannen', 'Kummer', 'Basay', 'ic.jeannen.basay@cvsu.edu.ph', 0, '03/24/2002', 'Female', 'Student', '4F', 'Information Technology', 'FIRST'),
('202210808', 'Walid Binsaid', 'Lucman', 'Dimao', 'ic.walidbinsaid.dimao@cvsu.edu.ph', 91234567891, '2003-05-18', 'Male', 'Student', '4E', 'Information Technology', 'FIRST'),
('202210834', 'Shaun Russelle', 'Merano', 'Obseñares', 'ic.shaunrusselle.obsenares@cvsu.edu.ph', 91234567891, '2002-07-31', 'Male', 'Student', '4E', 'Information Technology', 'FIRST'),
('202210836', 'Ferdinand', 'Villamor', 'Olaira', 'ic.ferdinand.olaira@cvsu.edu.ph', 91234567891, '2004-12-04', 'Male', 'Student', '4D', 'Information Technology', 'FIRST'),
('202210838', 'Kate Justine', 'B', 'Pades', 'ic.katejustine.pades@cvsu.edu.ph', 9777429816, '2003-05-13', 'Female', 'Student', '4D', 'Information Technology', 'FIRST'),
('202210844', 'Reween', 'Ocampo', 'Rambonanza', 'ic.reween.rambonanza@cvsu.edu.ph', 91234567891, '2000-12-25', 'Male', 'Student', '4C', 'Information Technology', 'FIRST'),
('202210867', 'Erwin', 'Manalo', 'Vallez', 'ic.erwin.vallez@cvsu.edu.ph', 91234567891, '2003-11-24', 'Male', 'Student', '4C', 'Information Technology', 'FIRST'),
('202210868', 'Cristel Nicole', 'S', 'Vergara', 'ic.cristelnicole.vergara@cvsu.edu.ph', 9234400863, '2003-06-21', 'Female', 'Student', '4B', 'Information Technology', 'First'),
('202210870', 'Xyrill John', 'Fecundo', 'Abreu', 'ic.xyrilljohn.abreu@cvsu.edu.ph', 9422169425, '08/03/2003', 'Female', 'Student', '4B', 'Information Technology', 'FIRST'),
('202210881', 'Gerandy Ernest', 'Jamanila', 'Buensuceso', 'ic.gerandyernest.buensuceso@cvsu.edu.ph', 91234567891, '2004-12-09', 'Male', 'Student', '4A', 'Information Technology', 'FIRST'),
('202211199', 'Jeann', 'Boaw', 'Desalit', 'ic.desalit.jeann@cvsu.edu.ph', 91234567891, '2002-01-07', 'Female', 'Student', '4A', 'Information Technology', 'FIRST'),
('20230003', 'Julia Ann', 'Sisno', 'Fajardo', 'ic.juliaann.fajardo@cvsu.edu.ph', 9679532083, '06/07/2001', 'Female', 'Professor', 'Not Applicable', 'Information Technology', 'Not Applicable');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject_code` (`subject_code`),
  ADD KEY `professor_ID` (`professor_ID`);

--
-- Indexes for table `activity_files`
--
ALTER TABLE `activity_files`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_id` (`activity_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `activity_grades`
--
ALTER TABLE `activity_grades`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_activity_student` (`activity_ID`,`student_ID`),
  ADD KEY `student_ID` (`student_ID`);

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`announcement_ID`),
  ADD KEY `professor_ID` (`professor_ID`),
  ADD KEY `classroom_ID` (`classroom_ID`);

--
-- Indexes for table `attendance`
--
ALTER TABLE `attendance`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_attendance_record` (`subject_code`,`attendance_date`,`student_ID`),
  ADD KEY `professor_ID` (`professor_ID`),
  ADD KEY `student_ID` (`student_ID`);

--
-- Indexes for table `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`subject_code`),
  ADD UNIQUE KEY `subject_code` (`subject_code`),
  ADD KEY `professor_ID` (`professor_ID`);

--
-- Indexes for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`),
  ADD UNIQUE KEY `unique_user_reset` (`tracked_ID`);

--
-- Indexes for table `student_classes`
--
ALTER TABLE `student_classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_student_subject` (`student_ID`,`subject_code`),
  ADD KEY `subject_code` (`subject_code`);

--
-- Indexes for table `tracked_semester`
--
ALTER TABLE `tracked_semester`
  ADD PRIMARY KEY (`semesterID`);

--
-- Indexes for table `tracked_users`
--
ALTER TABLE `tracked_users`
  ADD PRIMARY KEY (`tracked_ID`),
  ADD UNIQUE KEY `tracked_email` (`tracked_email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_ID`),
  ADD UNIQUE KEY `user_Email` (`user_Email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `activity_files`
--
ALTER TABLE `activity_files`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `activity_grades`
--
ALTER TABLE `activity_grades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=385;

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `announcement_ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `attendance`
--
ALTER TABLE `attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=72;

--
-- AUTO_INCREMENT for table `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `student_classes`
--
ALTER TABLE `student_classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `activities_ibfk_1` FOREIGN KEY (`subject_code`) REFERENCES `classes` (`subject_code`) ON DELETE CASCADE,
  ADD CONSTRAINT `activities_ibfk_2` FOREIGN KEY (`professor_ID`) REFERENCES `tracked_users` (`tracked_ID`) ON DELETE CASCADE;

--
-- Constraints for table `activity_files`
--
ALTER TABLE `activity_files`
  ADD CONSTRAINT `activity_files_ibfk_1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `activity_files_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `tracked_users` (`tracked_ID`);

--
-- Constraints for table `activity_grades`
--
ALTER TABLE `activity_grades`
  ADD CONSTRAINT `activity_grades_ibfk_1` FOREIGN KEY (`activity_ID`) REFERENCES `activities` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `activity_grades_ibfk_2` FOREIGN KEY (`student_ID`) REFERENCES `tracked_users` (`tracked_ID`);

--
-- Constraints for table `announcements`
--
ALTER TABLE `announcements`
  ADD CONSTRAINT `announcements_ibfk_1` FOREIGN KEY (`professor_ID`) REFERENCES `tracked_users` (`tracked_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `announcements_ibfk_2` FOREIGN KEY (`classroom_ID`) REFERENCES `classes` (`subject_code`) ON DELETE CASCADE;

--
-- Constraints for table `attendance`
--
ALTER TABLE `attendance`
  ADD CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`subject_code`) REFERENCES `classes` (`subject_code`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_2` FOREIGN KEY (`professor_ID`) REFERENCES `tracked_users` (`tracked_ID`) ON DELETE CASCADE,
  ADD CONSTRAINT `attendance_ibfk_3` FOREIGN KEY (`student_ID`) REFERENCES `tracked_users` (`tracked_ID`);

--
-- Constraints for table `classes`
--
ALTER TABLE `classes`
  ADD CONSTRAINT `classes_ibfk_1` FOREIGN KEY (`professor_ID`) REFERENCES `tracked_users` (`tracked_ID`) ON DELETE CASCADE;

--
-- Constraints for table `password_resets`
--
ALTER TABLE `password_resets`
  ADD CONSTRAINT `password_resets_ibfk_1` FOREIGN KEY (`tracked_ID`) REFERENCES `tracked_users` (`tracked_ID`) ON DELETE CASCADE;

--
-- Constraints for table `student_classes`
--
ALTER TABLE `student_classes`
  ADD CONSTRAINT `student_classes_ibfk_2` FOREIGN KEY (`subject_code`) REFERENCES `classes` (`subject_code`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_classes_ibfk_3` FOREIGN KEY (`student_ID`) REFERENCES `tracked_users` (`tracked_ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
