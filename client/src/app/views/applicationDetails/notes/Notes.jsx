import React, { useEffect, useState } from "react";
import { getNotes, addNote, updateNote, deleteNote } from "../../../clientAPI"; // Import API functions
import "./Notes.css";

function Notes({ applicationId }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editNote, setEditNote] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const data = await getNotes(applicationId); // Fetch notes
        setNotes(data);
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };

    fetchNotes();
  }, [applicationId]);

  const handleAddNote = async () => {
    if (!newNote.trim()) {
      alert('Can NOT add an EMPTY Note!');
      return;
    }
    try {
      const newNoteData = await addNote(applicationId, newNote); // Add new note
      setNotes((prevNotes) => [...prevNotes, newNoteData]);
      setNewNote("");
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  const handleEditNote = async () => {
    if (!editContent.trim()) return;
    try {
      const updatedNote = await updateNote(editNote.id, editContent); // Update note
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === updatedNote.id ? updatedNote : note
        )
      );
      setEditNote(null);
      setEditContent("");
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      await deleteNote(noteId); // Delete note
      setNotes((prevNotes) => prevNotes.filter((note) => note.id !== noteId));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };



  return (
    <div className="notes-container">
      <h3>Notes for this Application</h3>

      {/* Add new note form */}
      <div className="new-note-form">
        <textarea
          className="note-input"
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Add a new note..."
        />
        <button className="btn" onClick={handleAddNote}>
          Add Note
        </button>
      </div>

      {/* Edit note form (only when a note is being edited) */}
      {editNote && (
        <div className="edit-note-form">
          <textarea
            className="note-input"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Edit your note..."
          />
          <button className="btn" onClick={handleEditNote}>
            Save Changes
          </button>
          <button className="btn cancel-btn" onClick={() => setEditNote(null)}>
            Cancel Edit
          </button>
        </div>
      )}

      {/* List of notes */}
      {notes.length === 0 ? (
        <p>No notes available for this application.</p>
      ) : (
        <ul className="notes-list">
          {notes.map((note) => (
            <li key={note.id} className="note-item">
              <p className="note-content">{note.note_content}</p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(note.created_at).toLocaleDateString('en-US')}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(note.updated_at).toLocaleDateString('en-US')}
              </p>
              <button className="btn delete-btn" onClick={() => handleDeleteNote(note.id)}>
                Delete
              </button>
              <button
                className="btn edit-btn"
                onClick={() => {
                  setEditNote(note); // Set the note to be edited
                  setEditContent(note.note_content); // Pre-fill the textarea with current content
                }}
              >
                Edit
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notes;
