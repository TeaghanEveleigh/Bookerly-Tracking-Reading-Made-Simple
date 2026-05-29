const { Pool } = require('pg');

// Create a new pool instance using the DATABASE_URL environment variable
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Export the pool for accessing the database connection
module.exports = pool;
