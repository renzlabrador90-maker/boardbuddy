CREATE DATABASE IF NOT EXISTS boardbuddy
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE boardbuddy;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NULL,
  google_id VARCHAR(255) NULL,
  role ENUM('landlord', 'tenant') NOT NULL,
  phone VARCHAR(30) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_users_google_id (google_id),
  CONSTRAINT chk_users_login_method CHECK (
    password_hash IS NOT NULL OR google_id IS NOT NULL
  )
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS rooms (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  landlord_id INT UNSIGNED NOT NULL,
  room_number VARCHAR(30) NOT NULL,
  capacity TINYINT UNSIGNED NOT NULL,
  monthly_rent DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_landlord_room (landlord_id, room_number),
  CONSTRAINT fk_rooms_landlord FOREIGN KEY (landlord_id)
    REFERENCES users (id) ON DELETE RESTRICT,
  CONSTRAINT chk_rooms_capacity CHECK (capacity >= 1),
  CONSTRAINT chk_rooms_rent CHECK (monthly_rent >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS room_assignments (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  tenant_id INT UNSIGNED NOT NULL,
  room_id INT UNSIGNED NOT NULL,
  move_in_date DATE NOT NULL,
  move_out_date DATE NULL,
  active_tenant_id INT UNSIGNED GENERATED ALWAYS AS (
    CASE WHEN move_out_date IS NULL THEN tenant_id ELSE NULL END
  ) STORED,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_one_active_room_per_tenant (active_tenant_id),
  KEY idx_room_assignments_room (room_id, move_out_date),
  CONSTRAINT fk_assignments_tenant FOREIGN KEY (tenant_id)
    REFERENCES users (id) ON DELETE RESTRICT,
  CONSTRAINT fk_assignments_room FOREIGN KEY (room_id)
    REFERENCES rooms (id) ON DELETE RESTRICT,
  CONSTRAINT chk_assignment_dates CHECK (
    move_out_date IS NULL OR move_out_date >= move_in_date
  )
) ENGINE=InnoDB;
