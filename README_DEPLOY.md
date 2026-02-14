
# SwiftPolicy Vehicle Lookup Deployment Guide

## 1. Database Setup
1. Use a cloud database provider (AWS RDS, Google Cloud SQL, or Azure Database).
2. Run the provided `database/schema.sql` to initialize the `vehicles` table.
3. Seed the database with official UK DVLA/MIB CSV datasets or connect via a 3rd party API bridge.

## 2. API Backend
1. Deploy the Node.js controller found in `api/vehicle-lookup.js`.
2. Ensure you have proper CORS settings allowing the production domain.
3. Configure environment variables for DB connection strings.

## 3. Frontend Integration
The `QuotePage.tsx` in this deployment is already configured to prioritize the internal API. 
To finalize:
1. Replace the `handleLookup` internal mock with a standard `fetch` call to your `/api/vehicle-lookup` endpoint.
2. Ensure the Gemini AI fallback is retained for improved resiliency during registry downtime.

## 4. Security
- API requests are sanitized using standard regex.
- All technical specs (VIN, Color) are stored as metadata on the policy record for underwriter audit.
