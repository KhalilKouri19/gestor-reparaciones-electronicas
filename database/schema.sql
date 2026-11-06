CREATE DATABASE IF NOT EXISTS gestor_reparaciones
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gestor_reparaciones;

CREATE TABLE IF NOT EXISTS usuarios (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  rol ENUM('admin') NOT NULL DEFAULT 'admin',
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reparaciones (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre_cliente VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  telefono VARCHAR(40) NOT NULL,
  marca VARCHAR(80) NOT NULL,
  modelo VARCHAR(120) NOT NULL,
  problema_reportado TEXT NOT NULL,
  estado ENUM('Ingresado','En Diagnóstico','Reparado','Entregado') NOT NULL DEFAULT 'Ingresado',
  fecha_ingreso DATE NOT NULL,
  fecha_salida DATE NULL,
  codigo_seguimiento VARCHAR(20) NOT NULL UNIQUE,
  creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actualizado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_estado (estado),
  INDEX idx_cliente (nombre_cliente),
  INDEX idx_modelo (modelo)
) ENGINE=InnoDB;
