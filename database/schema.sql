
-- UK VEHICLE REGISTRATION MASTER SCHEMA
-- Optimized for PostgreSQL/MySQL

CREATE TABLE IF NOT EXISTS vehicles (
    registration_number VARCHAR(10) PRIMARY KEY, -- Indexed by default as PK
    make VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year_of_manufacture INT NOT NULL,
    fuel_type VARCHAR(20),
    vehicle_type VARCHAR(20) DEFAULT 'Car', -- Car, Van, Motorcycle
    vin VARCHAR(17) UNIQUE,
    engine_size VARCHAR(15),
    color VARCHAR(30),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indices for secondary search performance
CREATE INDEX idx_vehicle_make_model ON vehicles(make, model);
CREATE INDEX idx_vehicle_type ON vehicles(vehicle_type);

-- Sample Production Data
INSERT INTO vehicles (registration_number, make, model, year_of_manufacture, fuel_type, vehicle_type, vin, engine_size, color)
VALUES 
('SG71OYK', 'Tesla', 'Model 3', 2021, 'Electric', 'Car', '5YJ3E1EBXMF000001', 'N/A', 'Pearl White'),
('AB12CDE', 'Ford', 'Fiesta', 2018, 'Petrol', 'Car', 'WF0DXXGAKD0000002', '998cc', 'Race Red'),
('BT66XZY', 'Volkswagen', 'Golf', 2016, 'Diesel', 'Car', 'WVWZZZAUZGW000003', '1968cc', 'Deep Black'),
('VN20XYZ', 'Mercedes-Benz', 'Sprinter', 2020, 'Diesel', 'Van', 'WDB9066331S000004', '2143cc', 'Arctic White'),
('MC22RDR', 'Triumph', 'Street Triple', 2022, 'Petrol', 'Motorcycle', 'SMTTMD429N0000005', '765cc', 'Silver Ice');
