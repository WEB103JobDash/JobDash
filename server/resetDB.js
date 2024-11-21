import pkg from 'pg';  // Import the entire 'pg' package as the default export
const { Client } = pkg;  // Destructure Client from the default export

// Connection string to PostgreSQL (replace with your Railway connection URL)
const connectionString = 'postgresql://postgres:SdKAcdmKYQSRYdAdDXNSMbarlbETpjly@junction.proxy.rlwy.net:23557/railway';

// Create a new PostgreSQL client instance using the connection string
const client = new Client({
  connectionString: connectionString,
});

async function resetDatabase() {
  try {
    // Connect to the database
    await client.connect();
    console.log('Connected to the database...');

    // Function to check if a table exists in the schema
    const tableExists = async (tableName) => {
      const res = await client.query(`
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_name = $1
        );
      `, [tableName]);

      return res.rows[0].exists;
    };

    // Start a transaction to ensure atomicity (reset all tables together)
    await client.query('BEGIN');

    // Check and reset the `notes` table if it exists
    if (await tableExists('notes')) {
      await client.query('TRUNCATE TABLE notes RESTART IDENTITY CASCADE');
      console.log('Notes table has been reset.');
    } else {
      console.log('Notes table does not exist.');
    }

    // Check and reset the `job_app_details` table if it exists
    if (await tableExists('job_app_details')) {
      await client.query('TRUNCATE TABLE job_app_details RESTART IDENTITY CASCADE');
      console.log('Job Application Details table has been reset.');
    } else {
      console.log('Job Application Details table does not exist.');
    }

    // Check and reset the `applications` table if it exists
    if (await tableExists('applications')) {
      await client.query('TRUNCATE TABLE applications RESTART IDENTITY CASCADE');
      console.log('Applications table has been reset.');
    } else {
      console.log('Applications table does not exist.');
    }

    // Commit the transaction
    await client.query('COMMIT');
    console.log('Database reset completed successfully.');

  } catch (err) {
    console.error('Error resetting the database:', err);
    // Rollback the transaction in case of an error
    await client.query('ROLLBACK');
  } finally {
    // Close the connection
    await client.end();
    console.log('Connection closed.');
  }
}

// Execute the function to reset the database
resetDatabase();
