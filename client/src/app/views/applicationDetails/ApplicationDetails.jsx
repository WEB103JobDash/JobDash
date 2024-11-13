import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Notes from './notes/Notes';// Import Notes component

function ApplicationDetails() {
  const { id } = useParams(); // Access the job application ID from the URL
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/applications-details/${id}`);
        
        if (!response.ok) {
          throw new Error("Failed to fetch application details");
        }

        const data = await response.json();
        setApplication(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  if (loading) return <p>Loading application details...</p>;
  if (error) return <p>Error: {error}</p>;

  return application ? (
    <div>
      <h1>{application.company}</h1>
      {application.imgUrl && <img src={application.imgUrl} alt={`${application.company} logo`} />}
      <p>Position: {application.position}</p>
      <p>Status: {application.status}</p>
      <p>Location: {application.location || 'N/A'}</p>
      <p>Pay: {application.pay || 'N/A'}</p>
      <p>Tech Stack: {application.tech_stack || 'N/A'}</p>
      <p>Date Applied: {application.date_applied || 'N/A'}</p>

       {/* Render Notes component */}
       <Notes />
    </div>
  ) : (
    <p>No application found for ID: {id}</p>
  );
}

export default ApplicationDetails;
