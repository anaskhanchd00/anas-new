
/**
 * SwiftPolicy Vehicle Lookup API Controller
 * Express + Node.js Implementation
 */

const express = require('express');
const router = express.Router();
// const db = require('./db'); // Hypothetical database client

router.get('/vehicle-lookup/:registration', async (req, res) => {
    try {
        const vrm = req.params.registration.toUpperCase().replace(/\s/g, '');
        
        // 1. Input Validation
        if (!vrm || vrm.length < 5 || vrm.length > 8) {
            return res.status(400).json({ error: 'INVALID_REGISTRATION_FORMAT' });
        }

        // 2. Query Database (Postgres/MySQL)
        // const result = await db.query('SELECT * FROM vehicles WHERE registration_number = $1', [vrm]);
        // if (result.rows.length === 0) {
        //     return res.status(404).json({ error: 'VEHICLE_NOT_FOUND' });
        // }
        // const vehicle = result.rows[0];

        // MOCK RESPONSE FOR DEMO
        const vehicle = {
            registration_number: vrm,
            make: "MockMake",
            model: "MockModel",
            year: 2020,
            fuel_type: "Petrol",
            vehicle_type: "Car",
            vin: "MOCK123456789",
            engine_size: "1.5L",
            color: "White"
        };

        return res.json(vehicle);

    } catch (error) {
        console.error('SERVER_ERROR_VEHICLE_LOOKUP:', error);
        return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR' });
    }
});

module.exports = router;
