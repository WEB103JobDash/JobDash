import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Notes() {
  const { id } = useParams(); // Get the application id from the URL
  const [notes, setNotes] = useState([]); // State to hold notes data
  const [newNote, setNewNote] = useState(""); // State for new note input
  const [editNote, setEditNote] = useState(null); // State for editing a note
  const [editContent, setEditContent] = useState(""); // State for edited content

  // Fetch notes from the server based on application id
  useEffect(() => {
    async function fetchNotes() {
      try {
        const response = await fetch(`http://localhost:5000/api/notes/${id}`);
        const data = await response.json();
        setNotes(data); // Set the fetched notes to state
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    }

    fetchNotes();
  }, [id]); // Re-run the effect when the application id changes

  // Handle new note submission
  async function handleAddNote() {
    if (!newNote.trim()) return; // Don't add empty notes
    try {
      const response = await fetch(`http://localhost:5000/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ application_id: id, note_content: newNote }),
      });
      const data = await response.json();
      setNotes((prevNotes) => [...prevNotes, data]); // Add new note to the state
      setNewNote(""); // Reset input field
    } catch (error) {
      console.error("Error adding note:", error);
    }
  }

  // Handle note deletion
  async function handleDeleteNote(noteId) {
    try {
      await fetch(`http://localhost:5000/api/notes/${noteId}`, {
        method: "DELETE",
      });
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId)); // Remove note from state
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

// Handle note editing
async function handleEditNote() {
    if (!editContent.trim()) return; // Don't update with empty content
    console.log("Saving note with content:", editContent);  // Log content to check
    try {
      const response = await fetch(`http://localhost:5000/api/notes/${editNote.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note_content: editContent }),
      });
  
      const data = await response.json();
      console.log("Response data:", data); // Log response from server
  
      if (response.ok) {
        setNotes((prevNotes) =>
          prevNotes.map((note) =>
            note.id === data.id ? { ...note, note_content: data.note_content } : note
          )
        );
        setEditNote(null); // Reset edit state
        setEditContent(""); // Clear edit input field
      } else {
        console.error("Failed to update note:", data.message);
      }
    } catch (error) {
      console.error("Error editing note:", error);
    }
  }
  

  return (
    <div>
      <h3>Notes for this Application</h3>

      {/* Add new note form */}
      <div>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note..."
        />
        <button onClick={handleAddNote}>Add Note</button>
      </div>

      {/* Edit note form (only when a note is being edited) */}
      {editNote && (
        <div>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Edit your note..."
          />
          <button onClick={handleEditNote}>Save Changes</button>
          <button onClick={() => setEditNote(null)}>Cancel Edit</button>
        </div>
      )}

      {/* List of notes */}
      {notes.length === 0 ? (
        <p>No notes available for this application.</p>
      ) : (
        <ul>
          {notes.map((note) => (
            <li key={note.id}>
              <p>{note.note_content}</p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(note.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(note.updated_at).toLocaleString()}
              </p>
              <button onClick={() => handleDeleteNote(note.id)}>Delete</button>
              <button onClick={() => {
                setEditNote(note); // Set the note to be edited
                setEditContent(note.note_content); // Pre-fill the textarea with current content
              }}>Edit</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notes;
