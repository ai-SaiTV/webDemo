-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: teacher
-- ------------------------------------------------------
-- Server version	9.2.0

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
-- Table structure for table `class_infor`
--

DROP TABLE IF EXISTS `class_infor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class_infor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL COMMENT '班级名称',
  `grade` varchar(50) NOT NULL COMMENT '年级',
  `subject` varchar(50) NOT NULL COMMENT '学科',
  `stu_sum` int DEFAULT NULL COMMENT '学生总数',
  `teacher_name` varchar(50) DEFAULT NULL COMMENT '教师姓名',
  `textbook` varchar(255) DEFAULT NULL COMMENT '使用教材',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='班级信息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class_infor`
--

/*!40000 ALTER TABLE `class_infor` DISABLE KEYS */;
INSERT INTO `class_infor` VALUES (1,'一年级一班','一','语文',30,'张老师','人教版语文下册','2025-03-27 11:35:01','2025-03-27 11:35:01'),(2,'二年级三班','二','数学',25,'张老师','人教版数学下册','2025-03-27 11:35:01','2025-03-27 11:35:01'),(3,'三年级一班','三','英语',25,'张老师','人教版英语下册','2025-03-27 11:35:01','2025-03-27 11:35:01'),(4,'四年级二班','四','科学',25,'张老师','人教班科学下册','2025-03-27 11:35:01','2025-03-27 11:35:01');
/*!40000 ALTER TABLE `class_infor` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-27 20:01:56
