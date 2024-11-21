// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Notes from './notes/Notes';// Import Notes component
// import {
//   getApplicationDetails
// } from "../../clientAPI";
// import './ApplicationDetails.css';

// function ApplicationDetails() {
//   const { id } = useParams(); // Access the job application ID from the URL
//   const [application, setApplication] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchApplicationDetails = async () => {
//       try {
//         const applicationData = await getApplicationDetails(id); // Fetch application details
//       //  console.log(applicationData);
//         setApplication(applicationData);

  

//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchApplicationDetails();
//   }, [id]);

//   if (loading) return <p>Loading application details...</p>;
//   if (error) return <p>Error: {error}</p>;

//   console.log('company', application.company);

//   return application ? (
//     <div className="application-details">
//     <h1 className="application-title">{application.company}</h1>
//     {application.imgUrl && (
//       <img className="application-logo" src={application.imgUrl} alt={`${application.company} logo`} />
//     )}
//     <p className="application-info"><strong>Position:</strong> {application.position}</p>
//     <p className="application-info"><strong>Status:</strong> {application.status}</p>
//     <p className="application-info"><strong>Location:</strong> {application.location || 'N/A'}</p>
//     <p className="application-info"><strong>Pay:</strong> {application.pay || 'N/A'}</p>
//     <p className="application-info"><strong>Tech Stack:</strong> {application.tech_stack || 'N/A'}</p>
//     <p className="application-info"><strong>Date Applied:</strong> {new Date(application.date_applied).toLocaleDateString('en-US') || 'N/A'}</p>

//     {/* Render Notes component */}
//     <div className="notes-section">
//       <Notes applicationId={id} />
//     </div>
//   </div>
// ) : (
//   <p className="no-application">No application found for ID: {id}</p>
// );
// }

// export default ApplicationDetails;

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getApplicationDetails, updateJobApplication, deleteJobApplication } from "../../clientAPI"; // Add updateJobApplication API call
import Notes from './notes/Notes'; // Import Notes component
import './ApplicationDetails.css';

function ApplicationDetails() {
  const { id } = useParams(); // Access the job application ID from the URL
  const navigate = useNavigate(); // Hook to navigate to other pages (like edit page)
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // To toggle between view and edit mode
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    status: '',
    location: '',
    pay: '',
    tech_stack: '',
    date_applied: ''
  });

  useEffect(() => {
    const fetchApplicationDetails = async () => {
      try {
        const applicationData = await getApplicationDetails(id); // Fetch application details
        setApplication(applicationData);
        setFormData({
          company: applicationData.company || '',
          position: applicationData.position || '',
          status: applicationData.status || '',
          location: applicationData.location || '',
          pay: applicationData.pay || '',
          tech_stack: applicationData.tech_stack || '',
          date_applied: applicationData.date_applied || ''
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicationDetails();
  }, [id]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this application?");
    if (confirmDelete) {
      try {
        await deleteJobApplication(id); // Call delete function from API
        alert("Application deleted successfully");
        navigate('/applications'); // Redirect to the applications list page after deletion
      } catch (err) {
        alert("Failed to delete the application. Please try again.");
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true); // Toggle to edit mode
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Toggle to view mode
    setFormData({
      company: application.company,
      position: application.position,
      status: application.status,
      location: application.location,
      pay: application.pay,
      tech_stack: application.tech_stack,
      date_applied: application.date_applied
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateJobApplication(id, formData); // Send updated data to the backend
      alert("Application updated successfully");
      setIsEditing(false); // Toggle back to view mode
    } catch (err) {
      alert("Failed to update the application. Please try again.");
    }
  };

  if (loading) return <p>Loading application details...</p>;
  if (error) return <p>Error: {error}</p>;

  return application ? (
    <div className="application-details">
      {isEditing ? (
        <form className="edit-form" onSubmit={handleSubmit}>
          <h1>Edit Application</h1>
          <label>
            Company:
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
            
            />
          </label>
          <label>
            Position:
            <input
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              
            />
          </label>
          <label>
            Status:
            <input
              type="text"
              name="status"
              value={formData.status}
              onChange={handleChange}
              
            />
          </label>
          <label>
            Location:
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />
          </label>
          <label>
            Pay:
            <input
              type="text"
              name="pay"
              value={formData.pay}
              onChange={handleChange}
            />
          </label>
          <label>
            Tech Stack:
            <input
              type="text"
              name="tech_stack"
              value={formData.tech_stack}
              onChange={handleChange}
            />
          </label>
          <label>
            Date Applied:
            <input
              type="date"
              name="date_applied"
              value={formData.date_applied}
              onChange={handleChange}
            />
          </label>
          <div className="button-container">
            <button type="submit" className="save-button">Save</button>
            <button type="button" className="cancel-button" onClick={handleCancelEdit}>Cancel</button>
          </div>
        </form>
      ) : (
        <>
          <h1 className="application-title">{application.company}</h1>
          {application.imgUrl && (
            <img className="application-logo" src={application.imgUrl} alt={`${application.company} logo`} />
          )}
          <p className="application-info"><strong>Position:</strong> {application.position}</p>
          <p className="application-info"><strong>Status:</strong> {application.status}</p>
          <p className="application-info"><strong>Location:</strong> {application.location || 'N/A'}</p>
          <p className="application-info"><strong>Pay:</strong> {application.pay || 'N/A'}</p>
          <p className="application-info"><strong>Tech Stack:</strong> {application.tech_stack || 'N/A'}</p>
          <p className="application-info"><strong>Date Applied:</strong> {new Date(application.date_applied).toLocaleDateString('en-US') || 'N/A'}</p>

          {/* Edit and Delete Buttons */}
          <div className="button-container">
            <button className="edit-button" onClick={handleEdit}>Edit</button>
            <button className="delete-button" onClick={handleDelete}>Delete</button>
          </div>

          {/* Render Notes component */}
          <div className="notes-section">
            <Notes applicationId={id} />
          </div>
        </>
      )}
    </div>
  ) : (
    <p className="no-application">No application found for ID: {id}</p>
  );
}

export default ApplicationDetails;
