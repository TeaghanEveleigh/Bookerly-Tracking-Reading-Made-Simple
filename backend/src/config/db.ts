import { Pool  } from 'pg';

// Create a new pool instance using the DATABASE_URL environment variable
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
// Export the pool for accessing the database connection
export default pool;
