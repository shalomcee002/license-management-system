-- Initial admin user setup
-- Password is 'admin123' encoded with BCrypt
INSERT IGNORE INTO users (id, name, email, password) 
VALUES (1, 'Admin User', 'admin@example.com', '$2a$10$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HZWzG3YB1tlRy.fqvM/BG');

-- Insert roles if they don't exist
INSERT IGNORE INTO roles (id, name) VALUES (1, 'ROLE_ADMIN');
INSERT IGNORE INTO roles (id, name) VALUES (2, 'ROLE_OFFICER');
INSERT IGNORE INTO roles (id, name) VALUES (3, 'ROLE_VIEWER');

-- Assign admin role to admin user
INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (1, 1);