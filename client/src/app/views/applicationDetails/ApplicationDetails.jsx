import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Notes from './notes/Notes';// Import Notes component
import './ApplicationDetails.css';

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
    <div className="application-details">
    <h1 className="application-title">{application.company}</h1>
    {application.imgUrl && (
      <img className="application-logo" src={application.imgUrl} alt={`${application.company} logo`} />
    )}
    <p className="application-info"><strong>Position:</strong> {application.position}</p>
    <p className="application-info"><strong>Status:</strong> {application.status}</p>
    <p className="application-info"><strong>Location:</strong> {application.location || 'N/A'}</p>
    <p className="application-info"><strong>Pay:</strong> {application.pay || 'N/A'}</p>
    <p className="application-info"><strong>Tech Stack:</strong> {application.tech_stack || 'N/A'}</p>
    <p className="application-info"><strong>Date Applied:</strong> {application.date_applied || 'N/A'}</p>

    {/* Render Notes component */}
    <div className="notes-section">
      <Notes />
    </div>
  </div>
) : (
  <p className="no-application">No application found for ID: {id}</p>
);
}

export default ApplicationDetails;
