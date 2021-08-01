-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 29, 2021 at 03:44 PM
-- Server version: 8.0.26-0ubuntu0.20.04.2
-- PHP Version: 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ramrod_analytics`
--

-- --------------------------------------------------------

--
-- Table structure for table `registry`
--
CREATE TABLE `registry` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip` char(32) NOT NULL,
  `ip_link` int UNSIGNED NULL DEFAULT NULL,
  `time_in` int UNSIGNED NOT NULL,
  `time_out` int UNSIGNED NOT NULL,
  `timezone` varchar(64) NULL DEFAULT NULL,
  `language` varchar(64) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- This saves all different screen resolutions
--
CREATE TABLE `screen` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL,
  `height` int UNSIGNED NOT NULL,
  `width` int UNSIGNED NOT NULL,
  `inner_height` int UNSIGNED NOT NULL,
  `inner_width` int UNSIGNED NOT NULL,
  `color_depth` int UNSIGNED NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- This saves all the referrer urls
--
CREATE TABLE `referrer` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL,
  `referrer` varchar(256) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- This saves all different user agents information
--
CREATE TABLE `user_agent` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL,
  `browser` int UNSIGNED NULL DEFAULT '0',
  `renderer` int UNSIGNED NULL DEFAULT '0',
  `os` int UNSIGNED NULL DEFAULT '0',
  `mobile` BOOLEAN NOT NULL DEFAULT FALSE,
  `details` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


--
-- This saves all different browsers
--
CREATE TABLE `browsers` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `description` varchar(128) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- This saves all different renderes
--
CREATE TABLE `renderers` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `description` varchar(128) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- This saves all different operative systems
--
CREATE TABLE `operative_systems` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `description` varchar(128) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- This saves all ip's geolocations
--
CREATE TABLE `geolocations` (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `ip` varchar(128) NOT NULL,
  `country` varchar(64) NOT NULL,
  `state` varchar(64) NOT NULL,
  `city` varchar(64) NOT NULL,
  `postcode` varchar(32) NOT NULL,
  `continent` varchar(64) NOT NULL,
  `latitude` decimal(12, 8) NOT NULL,
  `longitude` decimal(12, 8) NOT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE (`ip`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Adding constrains
--
ALTER TABLE `user_agent` ADD CONSTRAINT `user_agent_registry_id` FOREIGN KEY (`user_id`) REFERENCES `registry`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 

ALTER TABLE `user_agent` ADD CONSTRAINT `user_agent_browsers_id` FOREIGN KEY (`browser`) REFERENCES `browsers`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE `user_agent` ADD CONSTRAINT `user_agent_renderers_id` FOREIGN KEY (`renderer`) REFERENCES `renderers`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

ALTER TABLE `user_agent` ADD CONSTRAINT `user_agent_os_id` FOREIGN KEY (`os`) REFERENCES `operative_systems`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION; 

ALTER TABLE `screen` ADD CONSTRAINT `screen_registry_id` FOREIGN KEY (`user_id`) REFERENCES `registry`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 

ALTER TABLE `referrer` ADD CONSTRAINT `referrer_registry_id` FOREIGN KEY (`user_id`) REFERENCES `registry`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION; 

ALTER TABLE `registry` ADD CONSTRAINT `registry_geolocations_ip_link` FOREIGN KEY (`ip_link`) REFERENCES `geolocations`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION; 


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
