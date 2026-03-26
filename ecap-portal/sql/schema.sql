-- ═══════════════════════════════════════════════════════════════
--  ECAP Portal — MySQL Schema
--  Run this on your MySQL instance (e.g. PlanetScale, Railway, Aiven)
-- ═══════════════════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS ecap_portal;
USE ecap_portal;

-- ── Students table ─────────────────────────────────────────────
CREATE TABLE students (
    id          VARCHAR(10)  PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,  -- hash with bcrypt in production
    department  VARCHAR(100) NOT NULL,
    year        TINYINT      NOT NULL DEFAULT 1,
    cgpa        DECIMAL(3,1) NOT NULL DEFAULT 0.0,
    attendance  DECIMAL(4,1) NOT NULL DEFAULT 0.0,
    fee_due     DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    qualification VARCHAR(100),
    photo_url   VARCHAR(500),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Achievements table ─────────────────────────────────────────
CREATE TABLE achievements (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    student_id  VARCHAR(10) NOT NULL,
    title       VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- ── Subjects table ─────────────────────────────────────────────
CREATE TABLE subjects (
    code        VARCHAR(10) PRIMARY KEY,
    name        VARCHAR(150) NOT NULL,
    department  VARCHAR(100) NOT NULL,
    credits     TINYINT NOT NULL,
    semester    TINYINT NOT NULL
);

-- ── Materials table ────────────────────────────────────────────
CREATE TABLE materials (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    subject_code VARCHAR(10) NOT NULL,
    title       VARCHAR(200) NOT NULL,
    file_url    VARCHAR(500),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (subject_code) REFERENCES subjects(code) ON DELETE CASCADE
);

-- ── Event logs table ───────────────────────────────────────────
CREATE TABLE event_logs (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event       VARCHAR(50)  NOT NULL,
    user_email  VARCHAR(100),
    details     TEXT,
    INDEX idx_event (event),
    INDEX idx_timestamp (timestamp)
);

-- ── Admin users table ──────────────────────────────────────────
CREATE TABLE admins (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    email       VARCHAR(100) NOT NULL UNIQUE,
    password    VARCHAR(255) NOT NULL,  -- hash with bcrypt in production
    name        VARCHAR(100),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ═══════════════════════════════════════════════════════════════
--  SEED DATA — 10 students
-- ═══════════════════════════════════════════════════════════════

INSERT INTO students (id, name, email, password, department, year, cgpa, attendance, fee_due, qualification) VALUES
('STU001', 'Aarav Sharma',   'aarav@ecap.edu',   'pass123', 'Computer Science',      3, 8.7, 92.0, 12000.00, 'B.Tech CSE'),
('STU002', 'Priya Patel',    'priya@ecap.edu',   'pass123', 'Electronics',           2, 9.1, 95.0,     0.00, 'B.Tech ECE'),
('STU003', 'Rohan Gupta',    'rohan@ecap.edu',   'pass123', 'Mechanical',            4, 7.9, 88.0, 25000.00, 'B.Tech ME'),
('STU004', 'Sneha Reddy',    'sneha@ecap.edu',   'pass123', 'Computer Science',      1, 8.3, 91.0,  5000.00, 'B.Tech CSE'),
('STU005', 'Vikram Singh',   'vikram@ecap.edu',  'pass123', 'Civil',                 3, 7.5, 85.0, 18000.00, 'B.Tech CE'),
('STU006', 'Ananya Iyer',    'ananya@ecap.edu',  'pass123', 'Information Technology', 2, 9.4, 97.0,     0.00, 'B.Tech IT'),
('STU007', 'Karthik Nair',   'karthik@ecap.edu', 'pass123', 'Electronics',           4, 8.0, 89.0,  8000.00, 'B.Tech ECE'),
('STU008', 'Divya Menon',    'divya@ecap.edu',   'pass123', 'Computer Science',      1, 8.9, 93.0,     0.00, 'B.Tech CSE'),
('STU009', 'Arjun Das',      'arjun@ecap.edu',   'pass123', 'Mechanical',            3, 7.2, 82.0, 30000.00, 'B.Tech ME'),
('STU010', 'Meera Joshi',    'meera@ecap.edu',   'pass123', 'Information Technology', 2, 8.6, 90.0,  3000.00, 'B.Tech IT');

INSERT INTO achievements (student_id, title) VALUES
('STU001', 'Dean''s List 2024'),
('STU001', 'Hackathon Winner'),
('STU002', 'Gold Medal - Physics'),
('STU002', 'IEEE Paper Published'),
('STU003', 'SAE Competition Finalist'),
('STU005', 'Best Project Award'),
('STU006', 'Google Summer of Code'),
('STU006', 'ACM ICPC Regionalist'),
('STU007', 'VLSI Design Contest Winner'),
('STU008', 'State Level Chess Champion'),
('STU010', 'Web Dev Bootcamp Certificate');

INSERT INTO subjects (code, name, department, credits, semester) VALUES
('CS101', 'Introduction to Programming',  'Computer Science',      4, 1),
('CS201', 'Data Structures & Algorithms', 'Computer Science',      4, 3),
('CS301', 'Database Management Systems',  'Computer Science',      3, 5),
('EC101', 'Basic Electronics',            'Electronics',           4, 1),
('EC201', 'Digital Signal Processing',    'Electronics',           3, 3),
('ME101', 'Engineering Mechanics',        'Mechanical',            4, 1),
('ME201', 'Thermodynamics',              'Mechanical',            3, 3),
('CE101', 'Surveying',                   'Civil',                 3, 1),
('IT201', 'Web Technologies',            'Information Technology', 3, 3),
('MA101', 'Engineering Mathematics I',   'General',               4, 1);

INSERT INTO admins (email, password, name) VALUES
('admin@ecap.edu', 'admin123', 'Administrator');
