import pool from './config/database.js';

async function resetTables() {
  await pool.query(`
    DROP TABLE IF EXISTS events;
    DROP TABLE IF EXISTS locations;

    CREATE TABLE locations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      image VARCHAR(255),
      description TEXT
    );

    CREATE TABLE events (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      date TIMESTAMP NOT NULL,
      time TIME NOT NULL,  -- Added time column
      image VARCHAR(255),   -- Added image column
      location_id INT REFERENCES locations(id) ON DELETE CASCADE
    );
  `);
  
  console.log('Tables reset!');
}

resetTables().then(() => pool.end());
