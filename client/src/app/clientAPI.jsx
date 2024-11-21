const API_BASE_URL = "http://localhost:5000/api"; // Base URL for the API

// --- Job Applications API ---

// Fetch all job applications for the dashboard
export const getJobApplications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/job-applications`);
    if (!response.ok) {
      throw new Error("Failed to fetch job applications");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getJobApplications:", error);
    throw error; // Re-throw to handle in the caller
  }
};

// Create a new job application
export const createJobApplication = async (jobApp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/job-applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobApp),
      });
      if (!response.ok) {
        throw new Error("Failed to create job application");
      }
      return await response.json();
    } catch (error) {
      console.error("Error in createJobApplication:", error);
      throw error;
    }
  };
  
  // Update an existing job application by ID
  export const updateJobApplication = async (applicationId, jobApp) => {
    try {
      const response = await fetch(`${API_BASE_URL}/job-applications/${applicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobApp),
      });
      if (!response.ok) {
        throw new Error("Failed to update job application");
      }
      return await response.json();
    } catch (error) {
      console.error("Error in updateJobApplication:", error);
      throw error;
    }
  };
  
  // Delete a job application by ID
  export const deleteJobApplication = async (applicationId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/job-applications/${applicationId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete job application");
      }
      return true; // Successfully deleted
    } catch (error) {
      console.error("Error in deleteJobApplication:", error);
      throw error;
    }
  };
  

// UPDATE the STATUS for an application
// Update the status of a job application by ID
export const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/job-applications/${applicationId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus, // Pass the new status value
        }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to update application status");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error in updateApplicationStatus:", error);
      throw error;
    }
  };
  


// --- Application's details API ---

// Fetch application details by ID
export const getApplicationDetails = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications-details/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch application details");
    }
    return response.json();
  } catch (error) {
    console.error("Error in getApplicationDetails:", error);
    throw error;
  }
};

// --- Notes API ---

// Fetch notes for a specific application ID
export const getNotes = async (applicationId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${applicationId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch notes");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in getNotes:", error);
    throw error;
  }
};

// Add a new note for an application
export const addNote = async (applicationId, noteContent) => {
    if (!noteContent){
        return;
    }
    
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        application_id: applicationId,
        note_content: noteContent,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to add a new note");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in addNote:", error);
    throw error;
  }
};

// Update an existing note by ID
export const updateNote = async (noteId, noteContent) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        note_content: noteContent,
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to update the note");
    }
    return await response.json();
  } catch (error) {
    console.error("Error in updateNote:", error);
    throw error;
  }
};

// Delete a note by ID
export const deleteNote = async (noteId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notes/${noteId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete the note");
    }
    return true; // Successfully deleted
  } catch (error) {
    console.error("Error in deleteNote:", error);
    throw error;
  }
};

