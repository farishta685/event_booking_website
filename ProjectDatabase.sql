-- MySQL dump 10.13  Distrib 8.0.29, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: ProjectDatabase
-- ------------------------------------------------------
-- Server version	8.0.29-0ubuntu0.20.04.3

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `ProjectDatabase`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `ProjectDatabase` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `ProjectDatabase`;

--
-- Table structure for table `Events`
--

DROP TABLE IF EXISTS `Events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Events` (
  `eventID` varchar(255) NOT NULL DEFAULT (uuid()),
  `eventName` varchar(255) NOT NULL,
  `eventDesc` varchar(555) DEFAULT NULL,
  `eventStatus` varchar(255) NOT NULL DEFAULT (_utf8mb4'Pending'),
  `hostID` smallint unsigned NOT NULL,
  `eventLocation` varchar(255) DEFAULT NULL,
  `eventType` varchar(255) DEFAULT NULL,
  `eventStartTime` varchar(255) DEFAULT NULL,
  `eventEndTime` varchar(255) DEFAULT NULL,
  `eventPoll` smallint unsigned DEFAULT NULL,
  PRIMARY KEY (`eventID`),
  UNIQUE KEY `eventPoll` (`eventPoll`),
  KEY `hostID` (`hostID`),
  CONSTRAINT `Events_ibfk_1` FOREIGN KEY (`hostID`) REFERENCES `Users` (`userID`) ON DELETE CASCADE,
  CONSTRAINT `Events_ibfk_2` FOREIGN KEY (`eventPoll`) REFERENCES `Poll` (`pollID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Events`
--

LOCK TABLES `Events` WRITE;
/*!40000 ALTER TABLE `Events` DISABLE KEYS */;
INSERT INTO `Events` VALUES ('28360e71-e883-11ec-866d-002248572d40','WDC Afterparty','We did it guys! Lets celebrate with cake!','Pending',4,'Somewhere with Cake','Casual',NULL,NULL,2),('e4e6132e-e882-11ec-866d-002248572d40','WDC Project Meeting','We got a project to do guys! Lets do it!','Confirmed',4,'IW Level 2','Casual','2022-06-06T02:30:00.000Z','2022-06-06T07:30:00.000Z',1);
/*!40000 ALTER TABLE `Events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Invitees`
--

DROP TABLE IF EXISTS `Invitees`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Invitees` (
  `inviteesID` smallint unsigned NOT NULL AUTO_INCREMENT,
  `invitees_first_name` varchar(255) DEFAULT NULL,
  `invitees_last_name` varchar(255) DEFAULT NULL,
  `invitees_email` varchar(255) DEFAULT NULL,
  `invitees_username` varchar(255) DEFAULT (_utf8mb4'Guest'),
  `vote_choice1` int DEFAULT NULL,
  `vote_choice2` int DEFAULT NULL,
  `vote_choice3` int DEFAULT NULL,
  `invitees_status` varchar(255) NOT NULL DEFAULT (_utf8mb4'Pending'),
  `eventID` varchar(255) NOT NULL,
  `userID` smallint unsigned DEFAULT NULL,
  PRIMARY KEY (`inviteesID`),
  KEY `eventID` (`eventID`),
  KEY `userID` (`userID`),
  CONSTRAINT `Invitees_ibfk_1` FOREIGN KEY (`eventID`) REFERENCES `Events` (`eventID`) ON DELETE CASCADE,
  CONSTRAINT `Invitees_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Invitees`
--

LOCK TABLES `Invitees` WRITE;
/*!40000 ALTER TABLE `Invitees` DISABLE KEYS */;
INSERT INTO `Invitees` VALUES (1,NULL,NULL,NULL,'Guest',NULL,NULL,NULL,'Going','e4e6132e-e882-11ec-866d-002248572d40',1),(2,NULL,NULL,NULL,'Guest',NULL,NULL,NULL,'Pending','e4e6132e-e882-11ec-866d-002248572d40',2),(3,NULL,NULL,NULL,'Guest',NULL,NULL,NULL,'Pending','e4e6132e-e882-11ec-866d-002248572d40',3),(4,NULL,NULL,NULL,'Guest',NULL,NULL,NULL,'Going','e4e6132e-e882-11ec-866d-002248572d40',4),(5,NULL,NULL,NULL,'Guest',1,1,NULL,'Going','28360e71-e883-11ec-866d-002248572d40',1),(6,NULL,NULL,NULL,'Guest',1,NULL,1,'Going','28360e71-e883-11ec-866d-002248572d40',2),(7,NULL,NULL,NULL,'Guest',1,1,NULL,'Going','28360e71-e883-11ec-866d-002248572d40',3),(8,NULL,NULL,NULL,'Guest',1,NULL,1,'Going','28360e71-e883-11ec-866d-002248572d40',4),(9,'WDC','Guest','guest@example.com','Guest',NULL,1,1,'Going','28360e71-e883-11ec-866d-002248572d40',NULL);
/*!40000 ALTER TABLE `Invitees` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Notifications`
--

DROP TABLE IF EXISTS `Notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Notifications` (
  `notifID` smallint unsigned NOT NULL AUTO_INCREMENT,
  `notifTitle` varchar(255) NOT NULL,
  `notifContent` varchar(2555) NOT NULL,
  `userID` smallint unsigned NOT NULL,
  `timestamp` datetime NOT NULL DEFAULT (now()),
  PRIMARY KEY (`notifID`),
  KEY `userID` (`userID`),
  CONSTRAINT `Notifications_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Notifications`
--

LOCK TABLES `Notifications` WRITE;
/*!40000 ALTER TABLE `Notifications` DISABLE KEYS */;
INSERT INTO `Notifications` VALUES (1,'You have been invited to WDC Project Meeting!','someone has invited you to an event! <a href=http://127.0.0.1:8080/Event.html?eventID=e4e6132e-e882-11ec-866d-002248572d40>Click on this link to respond</a>',1,'2022-06-10 06:02:22'),(2,'You have been invited to WDC Project Meeting!','someone has invited you to an event! <a href=http://127.0.0.1:8080/Event.html?eventID=e4e6132e-e882-11ec-866d-002248572d40>Click on this link to respond</a>',2,'2022-06-10 06:02:23'),(3,'You have been invited to WDC Project Meeting!','someone has invited you to an event! <a href=http://127.0.0.1:8080/Event.html?eventID=e4e6132e-e882-11ec-866d-002248572d40>Click on this link to respond</a>',3,'2022-06-10 06:02:23'),(4,'You have been invited to WDC Project Meeting!','someone has invited you to an event! <a href=http://127.0.0.1:8080/Event.html?eventID=e4e6132e-e882-11ec-866d-002248572d40>Click on this link to respond</a>',1,'2022-06-10 06:02:23'),(5,'You have been invited to WDC Project Meeting!','someone has invited you to an event! <a href=http://127.0.0.1:8080/Event.html?eventID=e4e6132e-e882-11ec-866d-002248572d40>Click on this link to respond</a>',2,'2022-06-10 06:02:23'),(6,'You have been invited to WDC Project Meeting!','someone has invited you to an event! <a href=http://127.0.0.1:8080/Event.html?eventID=e4e6132e-e882-11ec-866d-002248572d40>Click on this link to respond</a>',3,'2022-06-10 06:02:23'),(7,'WDC Project Meeting has been confirmed!','WDC Project Meeting is officially happening on the 06/06/2022  12:00! You can revisit <a href=http://127.0.0.1:8080/Event.html?eventID=e4e6132e-e882-11ec-866d-002248572d40>the event page</a> to add the event to your Google Calendar!',1,'2022-06-10 06:02:30'),(8,'WDC Project Meeting has been confirmed!','WDC Project Meeting is officially happening on the 06/06/2022  12:00! You can revisit <a href=http://127.0.0.1:8080/Event.html?eventID=e4e6132e-e882-11ec-866d-002248572d40>the event page</a> to add the event to your Google Calendar!',4,'2022-06-10 06:02:31'),(9,'WDC Project Meeting has been confirmed!','WDC Project Meeting is officially happening on the 06/06/2022  12:00! You can revisit <a href=http://127.0.0.1:8080/Event.html?eventID=e4e6132e-e882-11ec-866d-002248572d40>the event page</a> to add the event to your Google Calendar!',3,'2022-06-10 06:02:31'),(10,'WDC Project Meeting has been confirmed!','WDC Project Meeting is officially happening on the 06/06/2022  12:00! You can revisit <a href=http://127.0.0.1:8080/Event.html?eventID=e4e6132e-e882-11ec-866d-002248572d40>the event page</a> to add the event to your Google Calendar!',2,'2022-06-10 06:02:31'),(11,'Someone has responded to WDC Project Meeting','Someone has responded to WDC Project Meeting. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=e4e6132e-e882-11ec-866d-002248572d40>the event page</a> to find out who it was!',1,'2022-06-10 06:02:31'),(12,'Someone has responded to WDC Project Meeting','Someone has responded to WDC Project Meeting. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=e4e6132e-e882-11ec-866d-002248572d40>the event page</a> to find out who it was!',2,'2022-06-10 06:02:31'),(13,'You have been invited to WDC Afterparty!','someone has invited you to an event! <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>Click on this link to respond</a>',1,'2022-06-10 06:04:15'),(14,'You have been invited to WDC Afterparty!','someone has invited you to an event! <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>Click on this link to respond</a>',2,'2022-06-10 06:04:16'),(15,'You have been invited to WDC Afterparty!','someone has invited you to an event! <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>Click on this link to respond</a>',3,'2022-06-10 06:04:16'),(16,'You have been invited to WDC Afterparty!','someone has invited you to an event! <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>Click on this link to respond</a>',1,'2022-06-10 06:04:16'),(17,'You have been invited to WDC Afterparty!','someone has invited you to an event! <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>Click on this link to respond</a>',2,'2022-06-10 06:04:16'),(18,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',1,'2022-06-10 06:04:21'),(19,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',2,'2022-06-10 06:04:21'),(20,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',3,'2022-06-10 06:04:21'),(21,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',4,'2022-06-10 06:04:21'),(22,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',1,'2022-06-10 06:05:27'),(23,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',4,'2022-06-10 06:05:27'),(24,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',3,'2022-06-10 06:05:27'),(25,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',2,'2022-06-10 06:05:27'),(26,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',1,'2022-06-10 06:05:46'),(27,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',2,'2022-06-10 06:05:46'),(28,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',4,'2022-06-10 06:05:46'),(29,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',3,'2022-06-10 06:05:46'),(30,'Someone has responded to WDC Project Meeting','Someone has responded to WDC Project Meeting. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=e4e6132e-e882-11ec-866d-002248572d40>the event page</a> to find out who it was!',1,'2022-06-10 06:05:57'),(31,'Someone has responded to WDC Project Meeting','Someone has responded to WDC Project Meeting. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=e4e6132e-e882-11ec-866d-002248572d40>the event page</a> to find out who it was!',2,'2022-06-10 06:05:57'),(32,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',1,'2022-06-10 06:06:46'),(33,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',2,'2022-06-10 06:06:46'),(34,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',3,'2022-06-10 06:06:46'),(35,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=http://127.0.0.1:8080/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',4,'2022-06-10 06:06:46'),(36,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=https://matilda12390-code50-74945479-wrvx67jg6f9547-8080.githubpreview.dev/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',1,'2022-06-10 06:22:48'),(37,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=https://matilda12390-code50-74945479-wrvx67jg6f9547-8080.githubpreview.dev/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',3,'2022-06-10 06:22:48'),(38,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=https://matilda12390-code50-74945479-wrvx67jg6f9547-8080.githubpreview.dev/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',2,'2022-06-10 06:22:48'),(39,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=https://matilda12390-code50-74945479-wrvx67jg6f9547-8080.githubpreview.dev/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',4,'2022-06-10 06:22:48'),(40,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=https://matilda12390-code50-74945479-wrvx67jg6f9547-8080.githubpreview.dev/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',1,'2022-06-10 06:22:48'),(41,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=https://matilda12390-code50-74945479-wrvx67jg6f9547-8080.githubpreview.dev/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',2,'2022-06-10 06:22:48'),(42,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=https://matilda12390-code50-74945479-wrvx67jg6f9547-8080.githubpreview.dev/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',3,'2022-06-10 06:22:48'),(43,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=https://matilda12390-code50-74945479-wrvx67jg6f9547-8080.githubpreview.dev/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',4,'2022-06-10 06:22:49'),(44,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=https://matilda12390-code50-74945479-wrvx67jg6f9547-8080.githubpreview.dev/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',4,'2022-06-10 06:22:49'),(45,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=https://matilda12390-code50-74945479-wrvx67jg6f9547-8080.githubpreview.dev/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',1,'2022-06-10 06:22:49'),(46,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=https://matilda12390-code50-74945479-wrvx67jg6f9547-8080.githubpreview.dev/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',2,'2022-06-10 06:22:49'),(47,'Someone has responded to WDC Afterparty','Someone has responded to WDC Afterparty. Visit <a href=https://matilda12390-code50-74945479-wrvx67jg6f9547-8080.githubpreview.dev/Event.html?eventID=28360e71-e883-11ec-866d-002248572d40>the event page</a> to find out who it was!',3,'2022-06-10 06:22:49');
/*!40000 ALTER TABLE `Notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Poll`
--

DROP TABLE IF EXISTS `Poll`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Poll` (
  `pollID` smallint unsigned NOT NULL AUTO_INCREMENT,
  `pollStartTime1` varchar(255) DEFAULT NULL,
  `pollEndTime1` varchar(255) DEFAULT NULL,
  `pollStartTime2` varchar(255) DEFAULT NULL,
  `pollEndTime2` varchar(255) DEFAULT NULL,
  `pollStartTime3` varchar(255) DEFAULT NULL,
  `pollEndTime3` varchar(255) DEFAULT NULL,
  `eventID` varchar(255) NOT NULL,
  PRIMARY KEY (`pollID`),
  UNIQUE KEY `eventID` (`eventID`),
  CONSTRAINT `Poll_ibfk_1` FOREIGN KEY (`eventID`) REFERENCES `Events` (`eventID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Poll`
--

LOCK TABLES `Poll` WRITE;
/*!40000 ALTER TABLE `Poll` DISABLE KEYS */;
INSERT INTO `Poll` VALUES (1,'2022-06-06T02:30:00.000Z','2022-06-06T07:30:00.000Z','2022-06-22T14:30:00.000Z','2022-06-23T02:30:00.000Z','2022-06-13T14:30:00.000Z','2022-06-16T02:30:00.000Z','e4e6132e-e882-11ec-866d-002248572d40'),(2,'2022-06-13T02:30:00.000Z','2022-06-13T04:30:00.000Z','2022-06-23T02:30:00.000Z','2022-06-23T04:30:00.000Z','2022-06-14T02:30:00.000Z','2022-06-14T04:30:00.000Z','28360e71-e883-11ec-866d-002248572d40');
/*!40000 ALTER TABLE `Poll` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Systems_Admins`
--

DROP TABLE IF EXISTS `Systems_Admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Systems_Admins` (
  `userID` smallint unsigned NOT NULL,
  PRIMARY KEY (`userID`),
  CONSTRAINT `Systems_Admins_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `Users` (`userID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Systems_Admins`
--

LOCK TABLES `Systems_Admins` WRITE;
/*!40000 ALTER TABLE `Systems_Admins` DISABLE KEYS */;
INSERT INTO `Systems_Admins` VALUES (1),(4);
/*!40000 ALTER TABLE `Systems_Admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `userID` smallint unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `googleToken` varchar(255) DEFAULT NULL,
  `prefInvite` varchar(1) DEFAULT (_utf8mb4'1'),
  `prefDelete` varchar(1) DEFAULT (_utf8mb4'1'),
  `prefRespond` varchar(1) DEFAULT (_utf8mb4'1'),
  `prefConfirm` varchar(1) DEFAULT (_utf8mb4'1'),
  PRIMARY KEY (`userID`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'Emily','Miller','Emily1','$argon2i$v=19$m=4096,t=3,p=1$3zan2cNoxxmJCWrvMtv4Fw$4NV22gZJZ6FEs+dMwmhTFPtYLrEJLDylncCP2f3lpho','emily@example.com','NULL','1','1','1','1'),(2,'Farishta','Hashimi','Farishta1','$argon2i$v=19$m=4096,t=3,p=1$UvQ+Jvk2TlhGopQ9DaoUVw$vXahdZHJle2viXEH0GM/8QsbukjtLOgY/BeUG31TpGY','Farishta@example.com','NULL','1','1','1','1'),(3,'Vivien','Heng','Vivien1','$argon2i$v=19$m=4096,t=3,p=1$kShOYABO0WI5o6XVkU1GPw$CrJygk6vI6/2S60VFvJ7+W2hqaU77jhe/N5ZewTq/6I','Vivien@example.com','NULL','1','1','1','1'),(4,'Matilda','Mann','Matilda1','$argon2i$v=19$m=4096,t=3,p=1$MJlyBQOC7vBdl7AZ2sxM7w$T09YX56EQD7OzvDNhiGnPbJ2KRTtj+6h7+LXEHSyjfY','matilda@example.com','NULL','1','1','1','1'),(5,'WDC','Project','WDC Project','$argon2i$v=19$m=4096,t=3,p=1$U8TQLKbHdDsb3Mnq3Ik1HQ$OIyL15kcNo4hjdpb+neKQid43+p5uA1wcYeJFVcaPnA','wdcproject2022sem1@gmail.com','116702110148194299184','1','1','1','1');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-06-10  6:23:14
