import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Notes() {
  const { id } = useParams(); // Get the application id from the URL
  const [notes, setNotes] = useState([]); // State to hold notes data

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

  if (notes.length === 0) {
    return <p>No notes available for this application.</p>;
  }

  return (
    <div>
      <h3>Notes for this Application</h3>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <p>{note.note_content}</p>
            <p><strong>Created At:</strong> {new Date(note.created_at).toLocaleString()}</p>
            <p><strong>Updated At:</strong> {new Date(note.updated_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notes;
