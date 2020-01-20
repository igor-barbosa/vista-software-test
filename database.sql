CREATE DATABASE `imob` CHARACTER SET latin1 COLLATE latin1_swedish_ci;

CREATE TABLE `clients` (
  `cl_id` int(11) NOT NULL AUTO_INCREMENT,
  `cl_name` varchar(80) DEFAULT NULL,
  `cl_phone` varchar(45) DEFAULT NULL,
  `cl_email` varchar(150) DEFAULT NULL,
  `cl_deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`cl_id`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;

CREATE TABLE `contracts` (
  `ct_id` int(11) NOT NULL AUTO_INCREMENT,
  `ct_pro_id` int(11) DEFAULT NULL COMMENT 'ID DA PRIPRIEDADE',
  `ct_po_id` int(11) DEFAULT NULL COMMENT 'ID DO PROPRIETÁRIO',
  `ct_cl_id` int(11) DEFAULT NULL COMMENT 'ID DO CLIENTE',
  `ct_start_date` date DEFAULT NULL,
  `ct_end_date` date DEFAULT NULL,
  `ct_administration_fee` decimal(8,2) DEFAULT NULL COMMENT 'TAXA DE ADMINSITRAÇÃO (percentual)',
  `ct_rent_amount` decimal(8,2) DEFAULT NULL COMMENT 'VALOR DO ALUGUEL',
  `ct_condo_value` decimal(8,2) DEFAULT NULL COMMENT 'VALOR DO CONDOMÍNIO',
  `ct_IPTU` decimal(8,2) DEFAULT NULL,
  `ct_deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`ct_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `monthly_payments` (
  `mp_id` int(11) NOT NULL AUTO_INCREMENT,
  `mp_ct_id` int(11) NOT NULL COMMENT 'ID DO CONTRATO',
  `mp_order` int(11) DEFAULT NULL COMMENT 'NUMERO DA PARCELA ',
  `mp_date` date DEFAULT NULL,
  `mp_payment_done` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'PAGAMENTO DA MENSALIDADE DO CONTRATO.',
  `mp_transfer_done` tinyint(4) NOT NULL DEFAULT '0' COMMENT 'CONDIÇÃO CASO A TAXA DE ADMINISTRAÇÃO TENHA SIDO REALIZADA OU NÃO.',
  `mp_rent_amount` decimal(8,2) DEFAULT NULL,
  `mp_condo_value` decimal(8,2) DEFAULT NULL,
  `mp_IPTU` decimal(8,2) DEFAULT NULL,
  `mp_administration_fee` decimal(8,2) DEFAULT NULL COMMENT 'TAXA DE ADMINISTRAÇÃO ( R$ )',
  PRIMARY KEY (`mp_id`)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=latin1;


CREATE TABLE `properties` (
  `pro_id` int(11) NOT NULL AUTO_INCREMENT,
  `pro_po_id` int(11) NOT NULL COMMENT 'ID DO PROPRIETÁRIO',
  `pro_cep` varchar(20) DEFAULT NULL,
  `pro_number` varchar(10) DEFAULT NULL,
  `pro_street` varchar(150) DEFAULT NULL,
  `pro_neighborhood` varchar(100) DEFAULT NULL,
  `pro_city` varchar(100) DEFAULT NULL,
  `pro_state` varchar(100) DEFAULT NULL,
  `pro_country` varchar(100) DEFAULT NULL,
  `pro_complement` varchar(45) DEFAULT NULL,  
  `pro_deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`pro_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

CREATE TABLE `property_owner` (
  `po_id` int(11) NOT NULL AUTO_INCREMENT,
  `po_name` varchar(80) DEFAULT NULL,
  `po_email` varchar(150) DEFAULT NULL,
  `po_transfer_day` int(11) DEFAULT NULL COMMENT 'DIA DO REPASSE',
  `po_deleted_at` datetime DEFAULT NULL,
  PRIMARY KEY (`po_id`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

