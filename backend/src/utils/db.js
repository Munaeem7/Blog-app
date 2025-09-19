import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
});
console.log(process.env.DATABASE_URL)

//  to execute queries
export const query = (text, params) => pool.query(text, params);