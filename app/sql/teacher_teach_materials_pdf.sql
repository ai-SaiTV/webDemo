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
-- Table structure for table `teach_materials_pdf`
--

DROP TABLE IF EXISTS `teach_materials_pdf`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teach_materials_pdf` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL COMMENT '文档名称',
  `path` varchar(255) NOT NULL COMMENT '文档存储路径',
  `cover` varchar(255) DEFAULT NULL COMMENT '文档封面图片路径',
  `description` text COMMENT '文档描述',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `update_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='PDF教学文档资料表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teach_materials_pdf`
--

/*!40000 ALTER TABLE `teach_materials_pdf` DISABLE KEYS */;
INSERT INTO `teach_materials_pdf` VALUES (1,'二年级上册教师用书','/assets/Doc2.pdf','/assets/zh2vo.png','一本关于二年级语文上册的教师用书。','2025-03-27 11:40:20','2025-03-27 11:40:20'),(2,'三年级上册教师用书','/assets/Doc3.pdf','/assets/zh3vo.png','一本关于三年级语文上册的教师用书。','2025-03-27 11:40:20','2025-03-27 11:40:20'),(3,'四年级上册教师用书','/assets/Doc4.pdf','/assets/zh4vo.png','一本关于四年级语文上册的教师用书。','2025-03-27 11:40:20','2025-03-27 11:40:20'),(4,'五年级上册教师用书','/assets/Doc5.pdf','/assets/zh5vo.png','一本关于五年级语文上册的教师用书。','2025-03-27 11:40:20','2025-03-27 11:40:20');
/*!40000 ALTER TABLE `teach_materials_pdf` ENABLE KEYS */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-27 20:02:56
