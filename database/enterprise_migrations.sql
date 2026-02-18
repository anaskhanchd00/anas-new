
-- SWIFTPOLICY ENTERPRISE MIGRATION v2.0
-- TARGET: PostgreSQL/MySQL

-- 1. EXTEND USERS TABLE (Non-destructive)
ALTER TABLE users ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active';
ALTER TABLE users ADD COLUMN IF NOT EXISTS risk_level VARCHAR(50) DEFAULT 'Low';
ALTER TABLE users ADD COLUMN IF NOT EXISTS internal_notes TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_ip VARCHAR(45);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- 2. ENTERPRISE CLAIMS TABLE
CREATE TABLE IF NOT EXISTS claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id VARCHAR(50) NOT NULL,
    client_id VARCHAR(50) NOT NULL,
    claim_reference VARCHAR(50) UNIQUE NOT NULL,
    date_of_incident TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'Under Review',
    amount DECIMAL(15, 2) DEFAULT 0.00,
    description TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_claims_policy ON claims(policy_id);
CREATE INDEX IF NOT EXISTS idx_claims_client ON claims(client_id);

-- 3. FINANCIAL TRANSACTIONS TABLE
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    policy_id VARCHAR(50) NOT NULL,
    client_id VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_reference VARCHAR(100) UNIQUE,
    payment_status VARCHAR(50) DEFAULT 'Success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_client ON payments(client_id);
CREATE INDEX IF NOT EXISTS idx_payments_policy ON payments(policy_id);

-- 4. SYSTEM AUDIT PIPELINE
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(50),
    user_email VARCHAR(100),
    target_id VARCHAR(50),
    entity_type VARCHAR(50), -- 'USER', 'POLICY', 'CLAIM'
    action VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(45),
    reason TEXT
);

CREATE INDEX IF NOT EXISTS idx_audit_composite ON audit_logs(entity_type, target_id);
CREATE INDEX IF NOT EXISTS idx_audit_time ON audit_logs(timestamp);
