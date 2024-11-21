import express from 'express';
import cors from 'cors';  // Import cors
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';
import pool from './config/database.js'; // Your database connection

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: `${__dirname}/config/.env` });


const PORT = process.env.PORT || 5000;

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

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

// JOB APPLICATIONS ENDPOINTS

// Get all job applications (for the dashboard)
app.get("/api/job-applications", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM job_app_details");

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No applications found" });
    }

    res.json(result.rows); // Return all applications
  } catch (error) {
    console.error("Error fetching job applications:", error);
    res.status(500).send("Server error");
  }
});

// Get job application details by ID
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

// Create a new job application (this can be used for adding applications)
app.post("/api/job-applications", async (req, res) => {
    const { company, position, status, date_applied, pay, location, tech_stack} = req.body;

    try {
        const result = await pool.query(
            "INSERT INTO job_app_details (company, position, status, date_applied, pay, location, tech_stack) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [company, position, status, date_applied, pay, location, tech_stack]
        );
        res.status(201).json(result.rows[0]); // Return the newly created job application
    } catch (error) {
        console.error("Error adding job application:", error);
        res.status(500).send("Server error");
    }
});

// Update job application details
app.put("/api/job-applications/:id", async (req, res) => {
  const { id } = req.params;
  const { company, position, status, date_applied, pay, location, tech_stack } = req.body;

  try {
      const result = await pool.query(
          "UPDATE job_app_details SET company = $1, position = $2, status = $3, date_applied = $4, pay = $5, location = $6, tech_stack = $7 WHERE id = $8 RETURNING *",
          [company, position, status, date_applied, pay, location, tech_stack, id]
      );

      if (result.rows.length === 0) {
          return res.status(404).json({ message: "Application not found" });
      }

      res.json(result.rows[0]); // Return the updated application
  } catch (error) {
      console.error("Error updating job application:", error);
      res.status(500).send("Server error");
  }
});


// Delete a job application
app.delete("/api/job-applications/:id", async (req, res) => {
    const { id } = req.params;
    
    try {
        const result = await pool.query("DELETE FROM job_app_details WHERE id = $1 RETURNING *", [id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Application not found" });
        }

        res.status(204).send(); // Successfully deleted
    } catch (error) {
        console.error("Error deleting job application:", error);
        res.status(500).send("Server error");
    }
});

// FOR UPDATING STATUS OF AN APPLICATION
app.put('/api/job-applications/:id/status', async (req, res) => {
  const { id } = req.params; // Get the application ID from the route parameter
  const { status } = req.body; // Get the new status from the request body

  try {
    // Update the application's status in the database
    const result = await pool.query(
      "UPDATE job_app_details SET status = $1 WHERE id = $2 RETURNING *",
      [status, id]
    );

    // Check if the application exists
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Return the updated application
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Failed to update status" });
  }
});

// NOTES ENDPOINTS

// Get notes for a specific job application
app.get("/api/notes/:id", async (req, res) => {
    try {
      const applicationId = req.params.id;
      const result = await pool.query(
        "SELECT * FROM notes WHERE application_id = $1 ORDER BY created_at DESC", 
        [applicationId]
      );
  
      res.json(result.rows);
    } catch (error) {
      console.error("Error fetching notes:", error);
      res.status(500).send("Server error");
    }
  });

// Create a new note for a specific application
app.post("/api/notes", async (req, res) => {
    const { application_id, note_content } = req.body;
    const created_at = new Date();
    const updated_at = new Date();

    try {
      const result = await pool.query(
        "INSERT INTO notes (application_id, note_content, created_at, updated_at) VALUES ($1, $2, $3, $4) RETURNING *",
        [application_id, note_content, created_at, updated_at]
      );
      res.json(result.rows[0]); // Return the newly created note
    } catch (error) {
      console.error("Error adding note:", error);
      res.status(500).send("Server error");
    }
  });

// Update an existing note by ID
app.put("/api/notes/:id", async (req, res) => {
    const noteId = req.params.id;
    const { note_content } = req.body;
    const updated_at = new Date();  // Current timestamp

    try {
      const result = await pool.query(
        "UPDATE notes SET note_content = $1, updated_at = $2 WHERE id = $3 RETURNING *",
        [note_content, updated_at, noteId]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Note not found" });
      }
  
      res.json(result.rows[0]); // Return the updated note
    } catch (error) {
      console.error("Error updating note:", error);
      res.status(500).send("Server error");
    }
  });

// Delete a note by ID
app.delete("/api/notes/:id", async (req, res) => {
    const noteId = req.params.id;
    try {
      await pool.query("DELETE FROM notes WHERE id = $1", [noteId]);
      res.status(204).send(); // Successfully deleted
    } catch (error) {
      console.error("Error deleting note:", error);
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