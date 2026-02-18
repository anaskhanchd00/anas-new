
-- SWIFTPOLICY PRODUCTION VEHICLE REGISTRY SCHEMA
-- Version: 2.2.0 (Authoritative Data Support)

-- Authoritative Cache Table
CREATE TABLE IF NOT EXISTS vehicle_cache (
    registration_number VARCHAR(10) PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    variant VARCHAR(100),
    year_of_manufacture INT NOT NULL,
    fuel_type VARCHAR(30),
    engine_size VARCHAR(20),
    body_type VARCHAR(50),
    color VARCHAR(30),
    transmission VARCHAR(20),
    source VARCHAR(50) DEFAULT 'OFFICIAL_UK_REGISTRY',
    last_verified TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Identification Audit Log (Regulatory Requirement)
CREATE TABLE IF NOT EXISTS vehicle_id_audit_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50),
    registration VARCHAR(10) NOT NULL,
    request_source VARCHAR(50), -- 'WEB_QUOTE', 'ADMIN_ADJUSTMENT'
    outcome VARCHAR(20), -- 'MATCHED', 'NOT_FOUND', 'INVALID_FORMAT', 'FALLBACK'
    latency_ms INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_v_cache_vrm ON vehicle_cache(registration_number);
CREATE INDEX IF NOT EXISTS idx_v_audit_vrm ON vehicle_id_audit_logs(registration);
