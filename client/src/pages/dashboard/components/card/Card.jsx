// Card.js
import React from 'react';
import './Card.css';

function Card({ company }) {
    return (
        <div className="card">
            <div className="card-header">
                <i>ℹ️</i> {company.name}
            </div>
            <div className="card-info">
                Position: {company.position}<br />
                Status: {company.status}
            </div>
            <div className="card-actions">
                <button>View</button>
                <button>Delete</button>
            </div>
        </div>
    );
}

export default Card;
