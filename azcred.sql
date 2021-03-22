-- MySQL dump 10.13  Distrib 8.0.23, for Win64 (x86_64)
--
-- Host: localhost    Database: azcred
-- ------------------------------------------------------
-- Server version	5.7.33-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `acesso_corretor`
--

DROP TABLE IF EXISTS `acesso_corretor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acesso_corretor` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `banco` varchar(30) DEFAULT NULL,
  `usuario` varchar(200) DEFAULT NULL,
  `senha` varchar(30) DEFAULT NULL,
  `codigo_agente` varchar(30) DEFAULT NULL,
  `operador` varchar(30) DEFAULT NULL,
  `corretor_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `corretor_id` (`corretor_id`),
  CONSTRAINT `acesso_corretor_fk1` FOREIGN KEY (`corretor_id`) REFERENCES `corretor` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acesso_corretor`
--

LOCK TABLES `acesso_corretor` WRITE;
/*!40000 ALTER TABLE `acesso_corretor` DISABLE KEYS */;
/*!40000 ALTER TABLE `acesso_corretor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `acessos`
--

DROP TABLE IF EXISTS `acessos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `acessos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `banco` varchar(200) NOT NULL,
  `emprestimo` varchar(200) NOT NULL,
  `login` varchar(50) NOT NULL,
  `senha` varchar(50) NOT NULL,
  `link` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `acessos_idx1` (`banco`,`emprestimo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `acessos`
--

LOCK TABLES `acessos` WRITE;
/*!40000 ALTER TABLE `acessos` DISABLE KEYS */;
/*!40000 ALTER TABLE `acessos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `activity_log`
--

DROP TABLE IF EXISTS `activity_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `log_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `subject_id` int(11) DEFAULT NULL,
  `subject_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `causer_id` int(11) DEFAULT NULL,
  `causer_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `properties` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `activity_log_log_name_index` (`log_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity_log`
--

LOCK TABLES `activity_log` WRITE;
/*!40000 ALTER TABLE `activity_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `activity_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `banco`
--

DROP TABLE IF EXISTS `banco`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banco` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `ativo` char(1) NOT NULL DEFAULT 'S',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `nome` (`nome`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `banco`
--

LOCK TABLES `banco` WRITE;
/*!40000 ALTER TABLE `banco` DISABLE KEYS */;
/*!40000 ALTER TABLE `banco` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bancopg`
--

DROP TABLE IF EXISTS `bancopg`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bancopg` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nome` varchar(35) NOT NULL,
  `ativo` char(1) NOT NULL DEFAULT 'S',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `nome` (`nome`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bancopg`
--

LOCK TABLES `bancopg` WRITE;
/*!40000 ALTER TABLE `bancopg` DISABLE KEYS */;
/*!40000 ALTER TABLE `bancopg` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracao`
--

DROP TABLE IF EXISTS `configuracao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `empresa` varchar(20) DEFAULT NULL,
  `cidade` varchar(30) DEFAULT NULL,
  `estado` char(2) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracao`
--

LOCK TABLES `configuracao` WRITE;
/*!40000 ALTER TABLE `configuracao` DISABLE KEYS */;
INSERT INTO `configuracao` VALUES (1,'AZCred','CAMPO GRANDE','MS',NULL);
/*!40000 ALTER TABLE `configuracao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `configuracao_comissao`
--

DROP TABLE IF EXISTS `configuracao_comissao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuracao_comissao` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `real_percentual` tinyint(1) NOT NULL DEFAULT '0',
  `perc_pago_inicio` float(9,2) NOT NULL DEFAULT '0.00',
  `perc_pago_fim` float(9,2) NOT NULL DEFAULT '0.00',
  `comissao` float(9,2) NOT NULL DEFAULT '0.00',
  `perfil_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `configuracao_comissao_idx1` (`real_percentual`,`perc_pago_inicio`,`perc_pago_fim`) USING BTREE,
  KEY `perfil_id` (`perfil_id`) USING BTREE,
  CONSTRAINT `configuracao_comissao_fk1` FOREIGN KEY (`perfil_id`) REFERENCES `perfil` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `configuracao_comissao`
--

LOCK TABLES `configuracao_comissao` WRITE;
/*!40000 ALTER TABLE `configuracao_comissao` DISABLE KEYS */;
/*!40000 ALTER TABLE `configuracao_comissao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `conta`
--

DROP TABLE IF EXISTS `conta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `conta` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nome` varchar(25) NOT NULL,
  `ativo` char(1) NOT NULL DEFAULT 'S',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `nome` (`nome`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=8192;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `conta`
--

LOCK TABLES `conta` WRITE;
/*!40000 ALTER TABLE `conta` DISABLE KEYS */;
INSERT INTO `conta` VALUES (1,'CONTA CORRENTE','S'),(2,'CONTA POUPANÇA','S'),(3,'ORDEM DE PAGAMENTO','S'),(4,'CONTA INVESTIMENTO','S'),(5,'CONTA PAGAMENTO','S');
/*!40000 ALTER TABLE `conta` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `convenio`
--

DROP TABLE IF EXISTS `convenio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `convenio` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `ativo` char(1) NOT NULL DEFAULT 'S',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `nome` (`nome`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `convenio`
--

LOCK TABLES `convenio` WRITE;
/*!40000 ALTER TABLE `convenio` DISABLE KEYS */;
/*!40000 ALTER TABLE `convenio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `corretor`
--

DROP TABLE IF EXISTS `corretor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `corretor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `ativo` char(1) NOT NULL DEFAULT 'S',
  `perfil_id` int(11) NOT NULL,
  `telefone` text,
  `obs` text,
  `data_adm` date DEFAULT NULL,
  `cpf` varchar(18) DEFAULT NULL,
  `endereco` varchar(100) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `complem` varchar(100) DEFAULT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `uf` varchar(2) DEFAULT NULL,
  `cep` varchar(9) DEFAULT NULL,
  `bancopg_id` bigint(20) DEFAULT NULL,
  `agencia` varchar(20) DEFAULT NULL,
  `conta_numero` varchar(30) DEFAULT NULL,
  `conta_id` bigint(20) DEFAULT NULL,
  `titular_conta` varchar(100) DEFAULT NULL,
  `cpf_titular` varchar(18) DEFAULT NULL,
  `pessoa` char(1) NOT NULL DEFAULT 'F',
  `data_nasc` date DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `pix` varchar(100) DEFAULT NULL,
  `tarifa` float(9,2) DEFAULT '0.00',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `nome` (`nome`),
  KEY `perfil_id` (`perfil_id`) USING BTREE,
  CONSTRAINT `corretor_fk1` FOREIGN KEY (`perfil_id`) REFERENCES `perfil` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `corretor`
--

LOCK TABLES `corretor` WRITE;
/*!40000 ALTER TABLE `corretor` DISABLE KEYS */;
/*!40000 ALTER TABLE `corretor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `financeiro`
--

DROP TABLE IF EXISTS `financeiro`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `financeiro` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tipo` int(11) NOT NULL,
  `nome` varchar(40) NOT NULL,
  `descricao` text NOT NULL,
  `data_mov` date NOT NULL,
  `valor` float(9,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `financeiro`
--

LOCK TABLES `financeiro` WRITE;
/*!40000 ALTER TABLE `financeiro` DISABLE KEYS */;
/*!40000 ALTER TABLE `financeiro` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

LOCK TABLES `migrations` WRITE;
/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2017_04_02_181210_create_permissoes_table',1),(2,'2017_04_03_181127_create_papels_table',1),(3,'2019_05_30_103615_create_activity_log_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `pagamento`
--

DROP TABLE IF EXISTS `pagamento`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pagamento` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `data_pagamento` date NOT NULL,
  `corretor_id` int(11) NOT NULL,
  `valor_bruto` float(9,2) NOT NULL DEFAULT '0.00',
  `valor_tarifa` float(9,2) NOT NULL DEFAULT '0.00',
  `valor_pagamento` float(9,2) NOT NULL DEFAULT '0.00',
  `total_valor_contratos` float(9,2) NOT NULL DEFAULT '0.00',
  `total_corrrespondente` float(9,2) NOT NULL DEFAULT '0.00',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pagamento`
--

LOCK TABLES `pagamento` WRITE;
/*!40000 ALTER TABLE `pagamento` DISABLE KEYS */;
/*!40000 ALTER TABLE `pagamento` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `papeis`
--

DROP TABLE IF EXISTS `papeis`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `papeis` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `papeis_nome_unique` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `papeis`
--

LOCK TABLES `papeis` WRITE;
/*!40000 ALTER TABLE `papeis` DISABLE KEYS */;
INSERT INTO `papeis` VALUES (1,'GERENTE','GERENTE DO SISTEMA'),(3,'CORRETORES','CORRETORES COM ACESSO EXTERNO'),(4,'ADMINISTRADORES','ADMINISTRADORES DO SISTEMA');
/*!40000 ALTER TABLE `papeis` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `papel_permissao`
--

DROP TABLE IF EXISTS `papel_permissao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `papel_permissao` (
  `permissao_id` int(10) unsigned NOT NULL,
  `papel_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`permissao_id`,`papel_id`),
  KEY `papel_permissao_papel_id_foreign` (`papel_id`),
  CONSTRAINT `papel_permissao_papel_id_foreign` FOREIGN KEY (`papel_id`) REFERENCES `papeis` (`id`) ON DELETE CASCADE,
  CONSTRAINT `papel_permissao_permissao_id_foreign` FOREIGN KEY (`permissao_id`) REFERENCES `permissoes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `papel_permissao`
--

LOCK TABLES `papel_permissao` WRITE;
/*!40000 ALTER TABLE `papel_permissao` DISABLE KEYS */;
INSERT INTO `papel_permissao` VALUES (2,1),(3,1),(4,1),(8,1),(9,1),(10,1),(18,1),(19,1),(20,1),(23,1),(24,1),(27,1),(28,1),(29,1),(30,1),(36,1),(37,1),(38,1),(46,1),(51,1),(52,1),(53,1),(54,1),(55,1),(56,1),(57,1),(58,1),(59,1),(60,1),(61,1),(62,1),(63,1),(64,1),(65,1),(66,1),(67,1),(68,1),(72,1),(73,1),(74,1),(75,1),(76,1),(77,1),(78,1),(79,1),(80,1),(81,1),(82,1),(30,3),(47,3),(2,4),(3,4),(4,4),(8,4),(9,4),(10,4),(18,4),(19,4),(20,4),(21,4),(22,4),(23,4),(24,4),(25,4),(26,4),(27,4),(28,4),(29,4),(30,4),(36,4),(37,4),(38,4),(46,4),(51,4),(52,4),(53,4),(54,4),(55,4),(56,4),(57,4),(58,4),(59,4),(60,4),(61,4),(62,4),(63,4),(64,4),(65,4),(66,4),(67,4),(68,4),(69,4),(70,4),(71,4),(72,4),(73,4);
/*!40000 ALTER TABLE `papel_permissao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `papel_user`
--

DROP TABLE IF EXISTS `papel_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `papel_user` (
  `papel_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  PRIMARY KEY (`papel_id`,`user_id`),
  KEY `papel_user_user_id_foreign` (`user_id`),
  CONSTRAINT `papel_user_papel_id_foreign` FOREIGN KEY (`papel_id`) REFERENCES `papeis` (`id`) ON DELETE CASCADE,
  CONSTRAINT `papel_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `papel_user`
--

LOCK TABLES `papel_user` WRITE;
/*!40000 ALTER TABLE `papel_user` DISABLE KEYS */;
INSERT INTO `papel_user` VALUES (4,1),(1,2);
/*!40000 ALTER TABLE `papel_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `perfil`
--

DROP TABLE IF EXISTS `perfil`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `perfil` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `ativo` char(1) NOT NULL DEFAULT 'S',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `nome` (`nome`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `perfil`
--

LOCK TABLES `perfil` WRITE;
/*!40000 ALTER TABLE `perfil` DISABLE KEYS */;
/*!40000 ALTER TABLE `perfil` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissoes`
--

DROP TABLE IF EXISTS `permissoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissoes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `descricao` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `permissoes_nome_unique` (`nome`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissoes`
--

LOCK TABLES `permissoes` WRITE;
/*!40000 ALTER TABLE `permissoes` DISABLE KEYS */;
INSERT INTO `permissoes` VALUES (2,'VISUALIZAR_CONTA','PESQUISA DE TIPO DE CONTA'),(3,'CADASTRAR_CONTA','INSERE OU EDITA TIPO DE CONTA'),(4,'EXCLUIR_CONTA','EXCLUI TIPO DE CONTA'),(8,'VISUALIZAR_CORRETOR','PESQUISA DE CORRETOR'),(9,'CADASTRAR_CORRETOR','INSERE OU EDITA CORRETOR'),(10,'EXCLUIR_CORRETOR','EXCLUI CORRETOR'),(18,'VISUALIZAR_BANCOPG','PESQUISA BANCO PAGAMENTO'),(19,'CADASTRAR_BANCOPG','INSERE OU EDITA BANCO PAGAMENTO'),(20,'EXCLUIR_BANCOPG','EXCLUI BANCO PAGAMENTO'),(21,'VISUALIZAR_PERMISSAO','PESQUISA PERMISSÃO DE USUÁRIOS'),(22,'CADASTRAR_PERMISSAO','INSERE OU EDITA PERMISSÃO DE USUÁRIOS'),(23,'EXCLUIR_PERMISSAO','EXCLUI PERMISSÃO DE USUÁRIOS'),(24,'VISUALIZAR_GRUPO','PESQUISA GRUPO DE USUÁRIOS'),(25,'CADASTRAR_GRUPO','INSERE OU EDITA GRUPO DE USUÁRIOS'),(26,'EXCLUIR_GRUPO','EXCLUI GRUPO DE USUÁRIOS'),(27,'VISUALIZAR_USUARIO','PESQUISA USUÁRIOS'),(28,'CADASTRAR_USUARIO','INSERE OU EDITA USUáRIO'),(29,'EXCLUIR_USUARIO','EXCLUI USUÁRIO'),(30,'VISUALIZAR_DASHBOARD','Página inicial do sistema'),(36,'VISUALIZAR_LANCAMENTO','PESQUISA DE LANÇAMENTOS'),(37,'CADASTRAR_LANCAMENTO','INSERE OU EDITA LANÇAMENTO'),(38,'EXCLUIR_LANCAMENTO','EXCLUI LANÇAMENTO'),(46,'IMPRIMIR_FINANCEIRO','RELATÓRIO DE LANÇAMENTOS'),(47,'ACESSO_CORRETOR','ACESSO EXTERNO AO CORRETOR'),(51,'VISUALIZAR_COMISSAO','VISUALIZA AS CONFIGURAÇÕES DE COMISSÃO DO SISTEMA'),(52,'EXCLUIR_COMISSAO','EXCLUI COMISSÃO DE CONFIGURAÇÃO'),(53,'VISUALIZAR_CONFIG','MANUTENÇÃO DAS CONFIGURAÇÕES DO SISTEMA'),(54,'VISUALIZAR_CONVENIO','PESQUISA DE CONVÊNIO'),(55,'CADASTRAR_CONVENIO','INSERE OU EDITA CONVÊNIO'),(56,'EXCLUIR_CONVENIO','EXCLUI CONVÊNIO'),(57,'VISUALIZAR_BANCO','PESQUISA BANCO CONTRATO'),(58,'CADASTRAR_BANCO','INSERE OU EDITA BANCO CONTRATO'),(59,'EXCLUIR_BANCO','EXCLUI BANCO CONTRATO'),(60,'VISUALIZAR_TABELA','VISUALIZA TABELA DE COMISSÕES'),(61,'VISUALIZAR_PRODUCAO','VISUALIZA PRODUÇÕES'),(62,'IMPORTAR_COMISSAO','IMPORTAÇÃO DE TABELAS DE COMISSÃO DE BANCO'),(63,'IMPORTAR_PRODUCAO','IMPORTAÇÃO DE RELATÓRIO DE PRODUÇÃO'),(64,'VISUALIZAR_TIPO_CONTRATO','VISUALIZAR TIPOS DE CONTRATO'),(65,'CADASTRAR_COMISSAO','INSERIR OU EDITAR CONFIGURAÇÃO DE COMISSÃO'),(66,'EXCLUIR_TABELA','EXCLUI LINHA DA TABELA DE COMISSÃO'),(67,'CADASTRAR_TIPO_CONTRATO','INSERE OU ALTERA UM TIPO DE CONTRATO'),(68,'EXCLUIR_TIPO_CONTRATO','EXCLUI UM TIPO DE CONTRATO'),(69,'VISUALIZAR_SISTEMA','PESQUISA DE SISTEMAS'),(70,'CADASTRAR_SISTEMA','INSERE OU ALTERA UM SISTEMA'),(71,'EXCLUIR_SISTEMA','EXCLUI UM SISTEMA'),(72,'RELATORIO_COMISSAO','IMPRIMIR RELATÓRIO DE COMISSÃO'),(73,'IMPRIMIR_FISICO_PENDENTE','RELATÓRIO DE FÍSICO PENDENTE'),(74,'VISUALIZAR_TARIFA','VISUALIZAR TARIFAS'),(75,'CADASTRAR_TARIFA','INSERE OU EDITA TARIFA'),(76,'EXCLUIR_TARIFA','EXCLUI UMA TARIFA'),(77,'VISUALIZAR_REMESSA','VISUALIZA REMESSAS'),(78,'EXCLUIR_REMESSA','EXCLUI UMA REMESSA'),(79,'IMPRIMIR_REMESSA','IMPRIME A REMESSA'),(80,'RECEBER_REMESSA','RECEBIMENTO DE REMESSA'),(81,'VISUALIZAR_PAGAMENTO','PAGAMENTOS DE PRODUÇÃO'),(82,'IMPRIMIR_PAGAMENTO','RELATÓRIOS DE PAGAMENTO');
/*!40000 ALTER TABLE `permissoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `remessa`
--

DROP TABLE IF EXISTS `remessa`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `remessa` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `corretor_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL DEFAULT '1',
  `data_remessa` date NOT NULL,
  `data_recebido` date DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `remessa`
--

LOCK TABLES `remessa` WRITE;
/*!40000 ALTER TABLE `remessa` DISABLE KEYS */;
/*!40000 ALTER TABLE `remessa` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `remessa_item`
--

DROP TABLE IF EXISTS `remessa_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `remessa_item` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `remessa_id` bigint(20) NOT NULL,
  `contrato_id` bigint(20) unsigned NOT NULL,
  `recebido` tinyint(1) DEFAULT '0',
  `data_recebido` date DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `remessa_id` (`remessa_id`) USING BTREE,
  CONSTRAINT `remessa_item_fk1` FOREIGN KEY (`remessa_id`) REFERENCES `remessa` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `remessa_item`
--

LOCK TABLES `remessa_item` WRITE;
/*!40000 ALTER TABLE `remessa_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `remessa_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sistema`
--

DROP TABLE IF EXISTS `sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sistema` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `ativo` char(1) NOT NULL DEFAULT 'S',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `nome` (`nome`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=8192;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sistema`
--

LOCK TABLES `sistema` WRITE;
/*!40000 ALTER TABLE `sistema` DISABLE KEYS */;
INSERT INTO `sistema` VALUES (1,'PONTO AMIGO / A2TECH','S'),(2,'WORK BANK / MG CORRESPONDENTE','S'),(3,'CIA DO CRÉDITO','S'),(4,'AMX','S'),(5,'BEVICRED','S'),(6,'PROSPECTA','S'),(7,'DG PROMOTORA','S');
/*!40000 ALTER TABLE `sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `status`
--

DROP TABLE IF EXISTS `status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(20) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `nome` (`nome`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `status`
--

LOCK TABLES `status` WRITE;
/*!40000 ALTER TABLE `status` DISABLE KEYS */;
INSERT INTO `status` VALUES (2,'ENTREGUE'),(3,'ENTREGUE PARCIAL'),(1,'PENDENTE');
/*!40000 ALTER TABLE `status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabela_comissao`
--

DROP TABLE IF EXISTS `tabela_comissao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabela_comissao` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `banco_id` bigint(20) NOT NULL,
  `convenio_id` bigint(20) NOT NULL,
  `tipo_id` bigint(20) NOT NULL,
  `tabela` varchar(150) NOT NULL,
  `vigencia` date DEFAULT NULL,
  `prazo` varchar(10) DEFAULT NULL,
  `sistema_id` int(11) NOT NULL,
  `comissao_geral_sistema` float(9,2) NOT NULL DEFAULT '0.00',
  `comissao_liquido_sistema` float(9,2) NOT NULL DEFAULT '0.00',
  `comissao_bruto_sistema` float(9,2) NOT NULL DEFAULT '0.00',
  `codigo_mg` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `banco_id` (`banco_id`),
  KEY `convenio_id` (`convenio_id`),
  KEY `tipo_id` (`tipo_id`),
  KEY `sistema_id` (`sistema_id`) USING BTREE,
  KEY `tabela_comissao_idx1` (`banco_id`,`convenio_id`,`tipo_id`,`tabela`,`codigo_mg`,`prazo`) USING BTREE,
  CONSTRAINT `tabela_comissao_fk1` FOREIGN KEY (`banco_id`) REFERENCES `banco` (`id`),
  CONSTRAINT `tabela_comissao_fk2` FOREIGN KEY (`convenio_id`) REFERENCES `convenio` (`id`),
  CONSTRAINT `tabela_comissao_fk3` FOREIGN KEY (`tipo_id`) REFERENCES `tipo` (`id`),
  CONSTRAINT `tabela_comissao_fk4` FOREIGN KEY (`sistema_id`) REFERENCES `sistema` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabela_comissao`
--

LOCK TABLES `tabela_comissao` WRITE;
/*!40000 ALTER TABLE `tabela_comissao` DISABLE KEYS */;
/*!40000 ALTER TABLE `tabela_comissao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabela_producao`
--

DROP TABLE IF EXISTS `tabela_producao`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabela_producao` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `cpf` varchar(14) DEFAULT NULL,
  `cliente` varchar(200) DEFAULT NULL,
  `banco` varchar(100) DEFAULT NULL,
  `proposta` varchar(30) DEFAULT NULL,
  `contrato` varchar(30) DEFAULT NULL,
  `prazo` varchar(2) DEFAULT NULL,
  `produto` varchar(50) DEFAULT NULL,
  `tabela` varchar(100) DEFAULT NULL,
  `perc_comissao` float(9,2) DEFAULT '0.00',
  `valor_contrato` float(9,2) DEFAULT '0.00',
  `valor_comissao` float(9,2) DEFAULT '0.00',
  `data_operacao` date DEFAULT NULL,
  `data_credito_cliente` date DEFAULT NULL,
  `data_ncr` date DEFAULT NULL,
  `usuario` varchar(200) DEFAULT NULL,
  `correspondente_valor_comissao` float(9,2) DEFAULT '0.00',
  `correspondente_perc_comissao` float(9,2) DEFAULT '0.00',
  `corretor_perc_comissao` float(9,2) DEFAULT '0.00',
  `corretor_valor_comissao` float(9,2) DEFAULT '0.00',
  `corretor_id` int(11) DEFAULT NULL,
  `fisicopendente` char(1) DEFAULT 'S',
  `data_fisico` date DEFAULT NULL,
  `tipo` char(1) NOT NULL DEFAULT 'I',
  `pago` char(1) NOT NULL DEFAULT 'N',
  `data_importacao` date DEFAULT NULL,
  `pagamento_id` bigint(20) DEFAULT NULL,
  `operacao` char(1) DEFAULT 'C',
  PRIMARY KEY (`id`),
  KEY `corretor_id` (`corretor_id`),
  KEY `tabela_producao_idx1` (`corretor_id`,`banco`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 PACK_KEYS=0;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabela_producao`
--

LOCK TABLES `tabela_producao` WRITE;
/*!40000 ALTER TABLE `tabela_producao` DISABLE KEYS */;
/*!40000 ALTER TABLE `tabela_producao` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo`
--

DROP TABLE IF EXISTS `tipo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `nome` varchar(50) NOT NULL,
  `ativo` char(1) NOT NULL DEFAULT 'S',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `nome` (`nome`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=5461;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo`
--

LOCK TABLES `tipo` WRITE;
/*!40000 ALTER TABLE `tipo` DISABLE KEYS */;
INSERT INTO `tipo` VALUES (1,'NOVO','S'),(2,'COMPRA DE DÍVIDA','S'),(3,'REFINANCIAMENTO','S'),(5,'REFIN-PORTABILIDADE','S'),(6,'CARTÃO SAQUE AUTORIZADO','S'),(7,'CARTÃO SAQUE COMPLEMENTAR','S'),(8,'CARTÃO SEM SAQUE','S'),(9,'PORTABILIDADE','S'),(12,'CARTÃO ALTERAÇÃO COM SAQUE','S');
/*!40000 ALTER TABLE `tipo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipo_sistema`
--

DROP TABLE IF EXISTS `tipo_sistema`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipo_sistema` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `tipo_id` bigint(20) NOT NULL,
  `sistema_id` int(11) NOT NULL,
  `liquido` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `tipo_id` (`tipo_id`) USING BTREE,
  KEY `sistema_id` (`sistema_id`) USING BTREE,
  CONSTRAINT `tipo_sistema_fk1` FOREIGN KEY (`tipo_id`) REFERENCES `tipo` (`id`),
  CONSTRAINT `tipo_sistema_fk2` FOREIGN KEY (`sistema_id`) REFERENCES `sistema` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 AVG_ROW_LENGTH=2048;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipo_sistema`
--

LOCK TABLES `tipo_sistema` WRITE;
/*!40000 ALTER TABLE `tipo_sistema` DISABLE KEYS */;
/*!40000 ALTER TABLE `tipo_sistema` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ativo` tinyint(1) NOT NULL DEFAULT '1',
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `corretor_id` int(11) DEFAULT NULL,
  `acesso_externo` tinyint(1) NOT NULL DEFAULT '0',
  `arquivo` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT 'imagens/default.png',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Administrador','cavajr@bol.com.br','$2y$10$4SGwnJeofw8waYFezlX8i.H6KhJ2PVrr.4GuW7Xjhp90SEPEWZOC2',1,NULL,NULL,0,'imagens/default.png'),(2,'KLEBER','kleber@quallityassessoria.com.br','$2y$10$uKzmcHfCDcqxpkGQVU8FaeD5JLvLm6T7iWp4syurN7zM9ErPngEsK',1,NULL,NULL,0,'imagens/default.png');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `view_comissao`
--

DROP TABLE IF EXISTS `view_comissao`;
/*!50001 DROP VIEW IF EXISTS `view_comissao`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `view_comissao` AS SELECT 
 1 AS `corretor_id`,
 1 AS `corretor`,
 1 AS `tarifa`,
 1 AS `pix`,
 1 AS `id`,
 1 AS `pagamento`,
 1 AS `tipo`,
 1 AS `cpf`,
 1 AS `cliente`,
 1 AS `banco`,
 1 AS `proposta`,
 1 AS `contrato`,
 1 AS `prazo`,
 1 AS `produto`,
 1 AS `tabela`,
 1 AS `valor_contrato`,
 1 AS `data_operacao`,
 1 AS `data_credito_cliente`,
 1 AS `data_ncr`,
 1 AS `pago`,
 1 AS `corretor_perc_comissao`,
 1 AS `corretor_valor_comissao`,
 1 AS `banco_corretor`,
 1 AS `conta_nome`,
 1 AS `cpf_corretor`,
 1 AS `agencia`,
 1 AS `conta_numero`,
 1 AS `fisicopendente`,
 1 AS `data_fisico`,
 1 AS `atraso`*/;
SET character_set_client = @saved_cs_client;

--
-- Dumping routines for database 'azcred'
--

--
-- Final view structure for view `view_comissao`
--

/*!50001 DROP VIEW IF EXISTS `view_comissao`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `view_comissao` AS select `corretor`.`id` AS `corretor_id`,`corretor`.`nome` AS `corretor`,(select `pagamento`.`valor_tarifa` from `pagamento` where (`tabela_producao`.`pagamento_id` = `pagamento`.`id`)) AS `tarifa`,`corretor`.`pix` AS `pix`,`tabela_producao`.`id` AS `id`,`tabela_producao`.`pagamento_id` AS `pagamento`,`tabela_producao`.`tipo` AS `tipo`,`tabela_producao`.`cpf` AS `cpf`,`tabela_producao`.`cliente` AS `cliente`,`tabela_producao`.`banco` AS `banco`,`tabela_producao`.`proposta` AS `proposta`,`tabela_producao`.`contrato` AS `contrato`,`tabela_producao`.`prazo` AS `prazo`,`tabela_producao`.`produto` AS `produto`,`tabela_producao`.`tabela` AS `tabela`,`tabela_producao`.`valor_contrato` AS `valor_contrato`,`tabela_producao`.`data_operacao` AS `data_operacao`,`tabela_producao`.`data_credito_cliente` AS `data_credito_cliente`,`tabela_producao`.`data_ncr` AS `data_ncr`,`tabela_producao`.`pago` AS `pago`,`tabela_producao`.`corretor_perc_comissao` AS `corretor_perc_comissao`,`tabela_producao`.`corretor_valor_comissao` AS `corretor_valor_comissao`,`bancopg`.`nome` AS `banco_corretor`,`conta`.`nome` AS `conta_nome`,`corretor`.`cpf` AS `cpf_corretor`,`corretor`.`agencia` AS `agencia`,`corretor`.`conta_numero` AS `conta_numero`,`tabela_producao`.`fisicopendente` AS `fisicopendente`,`tabela_producao`.`data_fisico` AS `data_fisico`,(to_days(curdate()) - to_days(`tabela_producao`.`data_fisico`)) AS `atraso` from (((`corretor` join `tabela_producao` on((`corretor`.`id` = `tabela_producao`.`corretor_id`))) join `bancopg` on((`corretor`.`bancopg_id` = `bancopg`.`id`))) join `conta` on((`corretor`.`conta_id` = `conta`.`id`))) order by `corretor`.`nome`,`tabela_producao`.`banco`,`tabela_producao`.`cliente` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-03-22  8:59:16
