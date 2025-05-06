const { Pool } = require('pg'); // Import PostgreSQL pool from 'pg' library

// Set up your PostgreSQL connection
const pool = new Pool({
  user: 'postgres',       // Replace with your database username
  host: 'localhost',          // Usually 'localhost' or your PostgreSQL host
  database: 'healthhub',   // Replace with your database name
  password: '12345678', // Replace with your database password
  port: 5432,                 // Default PostgreSQL port
});

module.exports = pool;  // Export the pool object for use in other files
