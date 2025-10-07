-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 07, 2025 at 04:50 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tracked`
--

-- --------------------------------------------------------

--
-- Table structure for table `tracked_users`
--

CREATE TABLE `tracked_users` (
  `tracked_ID` varchar(20) NOT NULL,
  `tracked_Role` varchar(20) NOT NULL DEFAULT 'Student',
  `tracked_email` varchar(100) NOT NULL,
  `tracked_password` varchar(255) NOT NULL,
  `tracked_fname` varchar(50) NOT NULL,
  `tracked_lname` varchar(50) NOT NULL,
  `tracked_mi` varchar(5) DEFAULT NULL,
  `tracked_program` varchar(50) NOT NULL,
  `tracked_yearandsec` varchar(50) NOT NULL,
  `tracked_bday` date NOT NULL,
  `tracked_gender` varchar(10) DEFAULT NULL,
  `tracked_phone` varchar(15) DEFAULT NULL,
  `tracked_Status` varchar(10) NOT NULL DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tracked_users`
--

INSERT INTO `tracked_users` (`tracked_ID`, `tracked_Role`, `tracked_email`, `tracked_password`, `tracked_fname`, `tracked_lname`, `tracked_mi`, `tracked_program`, `tracked_yearandsec`, `tracked_bday`, `tracked_gender`, `tracked_phone`, `tracked_Status`, `created_at`, `updated_at`) VALUES
('1123', 'Admin', 'admin@cvsu.edu.ph', '$2y$10$1YMz3I5brKKoL.zgSN225ubRTBgeFZ5UT./XRGY3s.SBSQbtBe0la', 'John', 'Admin', 'A', 'BSIT', '', '2000-12-08', 'Male', '09864518549', 'Active', '2025-09-26 05:10:40', '2025-09-26 05:10:40'),
('1156', 'Professor', 'patrick.star@cvsu.edu.ph', '$2y$10$Bb4NrRJAdDRwJO5.js0pjOykrpw4uB3hpN.djd9lNvlfoR544bwxG', 'Patrick', 'Star', 'S', 'BSIT', '', '2001-01-01', 'Male', '94654693438', 'Active', '2025-10-07 11:29:33', '2025-10-07 11:29:33'),
('202218101', 'Student', 'spongebob.squarepants@cvsu.edu.ph', '$2y$10$JfTw/0p6wqh1onqCRuKpL..BBsVDmqSF1tiBirQWXfl.O5b8qM0/K', 'Spongebob', 'Squarepants', 'S', 'BSIT', 'BSIT-4D', '2000-01-01', 'Male', '09357633953', 'Active', '2025-10-07 12:45:51', '2025-10-07 12:45:51');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_ID` varchar(20) NOT NULL,
  `user_Name` varchar(100) NOT NULL,
  `user_Email` varchar(100) NOT NULL,
  `user_Gender` varchar(10) DEFAULT NULL,
  `user_Role` varchar(20) NOT NULL DEFAULT 'Student',
  `YearandSection` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_ID`, `user_Name`, `user_Email`, `user_Gender`, `user_Role`, `YearandSection`) VALUES
('1123', 'Admin', 'admin@cvsu.edu.ph', 'Male', 'Admin', 'Not Applicable'),
('1156', 'Patrick Star', 'patrick.star@cvsu.edu.ph', 'Male', 'Professor', 'Not Applicable'),
('1223', 'Dr. Robert Smith', 'robert.smith@cvsu.edu.ph', 'Male', 'Professor', 'Not Applicable'),
('1233', 'Dr. Lisa Garcia', 'lisa.garcia@cvsu.edu.ph', 'Female', 'Professor', 'Not Applicable'),
('12345', 'System Administrator', 'system.admin@cvsu.edu.ph', 'Male', 'Admin', 'Not Applicable'),
('202210602', 'Dhenize Krista Faith C. Lopez', 'ic.dhenizekristafaith.lopez@cvsu.edu.ph', 'Male', 'Student', 'BSIT-4D'),
('202210718', 'Masarap Syang Tunay Gonzales', 'ic.michaelrhoi.gonzales@cvsu.edu.ph', 'Female', 'Student', 'BSIT-4D'),
('202210784', 'Jeannen K. Basay', 'ic.jeannen.basay@cvsu.edu.ph', 'Female', 'Student', 'BSIT-4D'),
('202210870', 'Xyrill John F. Abreu', 'ic.xyrilljohn.abreu@cvsu.edu.ph', 'Female', 'Student', 'BSIT-4D'),
('202218101', 'Spongebob Squarepants', 'spongebob.squarepants@cvsu.edu.ph', 'Male', 'Student', 'BSIT-4D'),
('20230001', 'Maria Santos', 'maria.santos@cvsu.edu.ph', 'Female', 'Student', 'BSIT-4D'),
('20230002', 'Juan Dela Cruz', 'juan.delacruz@cvsu.edu.ph', 'Male', 'Student', 'BSIT-4D'),
('20230003', 'Ana Reyes', 'ana.reyes@cvsu.edu.ph', 'Female', 'Student', 'BSIT-4D');

--
-- Indexes for dumped tables
--

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
