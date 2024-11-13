import express from 'express';
import cors from 'cors';  // Import cors
import path from 'path';
import favicon from 'serve-favicon';
import dotenv from 'dotenv';
import pool from './config/database.js'; // Your database connection
// import routes here

// Load environment variables
dotenv.config({ path: './config/.env' });

const PORT = process.env.PORT || 5000;

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());  // Enable CORS for all requests
// app.use('/api/events', eventsRouter);   // Route for events CHANGE FOR OUR APP

if (process.env.NODE_ENV === 'development') {
    app.use(favicon(path.resolve('../', 'client', 'public', 'party.png')));
} else if (process.env.NODE_ENV === 'production') {
    app.use(favicon(path.resolve('public', 'party.png')));
    app.use(express.static('public'));
}


// Test database connection endpoint
app.get('/api-test', async (req, res) => {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT NOW()');
        client.release();
        res.status(200).json({ message: 'Connected to DB!', time: result.rows[0].now });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Endpoint to get job application's details by specific ID
app.get("/api/applications-details/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM job_app_details WHERE id = $1", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.json(result.rows[0]);  // Return a single application object
    } catch (error) {
        console.error("Error fetching job application:", error);
        res.status(500).send("Server error");
    }
});

// Endpoint to get notes for a specific job application
app.get("/api/notes/:id", async (req, res) => {
    try {
      const applicationId = req.params.id;
      
      // Query to fetch notes for the specific application
      const result = await pool.query(
        "SELECT * FROM notes WHERE application_id = $1 ORDER BY created_at DESC", 
        [applicationId]
      );
  
      // Return the notes as JSON
      res.json(result.rows);
      console.log(res.json(result.rows));
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).send("Server error");
    }
  });
  


// Catch-all route for production to serve frontend
if (process.env.NODE_ENV === 'production') {
    app.get('/*', (_, res) =>
        res.sendFile(path.resolve('public', 'index.html'))
    );
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
