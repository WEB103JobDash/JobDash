const API_BASE_URL = "http://localhost:5000/api"; // Base URL for the API

// --- Application's details API --

// Fetch application details by ID
export const getApplicationDetails = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/applications-details/${id}`);
   
    return response.json();
  } catch (error) {
    console.error("Error in getApplicationDetails:", error);
    throw error; // Re-throw to handle in the caller
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
