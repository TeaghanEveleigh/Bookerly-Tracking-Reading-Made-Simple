import pg from 'pg';

const { Pool } = pg;

console.log(process.env.DATABASE_URL)
const pool = new Pool({
  connectionString:process.env.NODE_ENV === 'test'
    ? process.env.VITE_DATABASE_URL
    : process.env.DATABASE_URL,
});

export default pool;