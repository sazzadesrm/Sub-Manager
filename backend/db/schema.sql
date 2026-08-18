-- ==========================================================
-- Sub Manager Database Schema (MySQL / PostgreSQL / MariaDB)
-- Supports Multi-User Data Isolation, RBAC, and Authentication
-- ==========================================================

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    salt VARCHAR(64),
    role ENUM('owner', 'admin', 'finance', 'support', 'sales') DEFAULT 'owner',
    department VARCHAR(128) DEFAULT 'Finance & Subscriptions',
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    verification_code VARCHAR(16),
    provider VARCHAR(32) DEFAULT 'email',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    cost DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(8) DEFAULT 'BDT',
    billing_cycle ENUM('weekly', 'monthly', 'quarterly', 'yearly') NOT NULL DEFAULT 'monthly',
    category ENUM('Entertainment', 'Productivity', 'Cloud & Hosting', 'Music & Audio', 'Security', 'Design & Creative', 'Utilities', 'Personal') NOT NULL,
    status ENUM('active', 'paused', 'cancelled', 'trial') NOT NULL DEFAULT 'active',
    next_renewal_date DATE NOT NULL,
    payment_method VARCHAR(64) DEFAULT 'Credit Card',
    is_trial BOOLEAN DEFAULT FALSE,
    trial_end_date DATE,
    icon_type VARCHAR(64) DEFAULT 'service',
    color VARCHAR(32) DEFAULT '#3B82F6',
    notes TEXT,
    tags JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_subs_user (user_id),
    INDEX idx_subs_status (status),
    INDEX idx_subs_renewal (next_renewal_date)
);

CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(64) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    log_type ENUM('subscription', 'billing', 'security', 'user', 'email') NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_logs_user (user_id)
);

CREATE TABLE IF NOT EXISTS team_members (
    id VARCHAR(64) PRIMARY KEY,
    workspace_owner_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role ENUM('owner', 'admin', 'finance', 'support', 'sales') NOT NULL,
    avatar TEXT,
    status VARCHAR(32) DEFAULT 'active',
    last_active VARCHAR(64) DEFAULT 'Active now',
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workspace_owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed Super Admin Account
INSERT INTO users (
    id,
    name,
    email,
    password_hash,
    salt,
    role,
    department,
    avatar_url,
    is_verified,
    provider
) VALUES (
    'usr_super_admin_sazzad',
    'Sazzad Kabir',
    'sazzadmbstu@gmail.com',
    SHA2(CONCAT('7130', 'sazzad_super_admin_salt_2026', '_submanager_php_sql_salt_secret'), 256),
    'sazzad_super_admin_salt_2026',
    'owner',
    'Super Administration & Engineering',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    TRUE,
    'email'
) ON DUPLICATE KEY UPDATE is_verified = TRUE;
