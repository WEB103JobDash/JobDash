import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load the .env file
dotenv.config({ path: path.resolve('./config/.env') });

console.log('Database URL:', process.env.DATABASE_URL); // Log the DB URL to verify it's being loaded

const config = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Required for Railway's public network
  },
};

const pool = new pg.Pool(config);
console.log('CONNECTION TO DATABASE', config);

pool.connect()
  .then(client => {
    console.log('Successfully connected to the database!');
    client.release(); // Release the client after use
  })
  .catch(err => {
    console.error('Database connection error:', err);
  });


export default pool;
