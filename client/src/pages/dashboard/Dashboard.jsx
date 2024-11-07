// Dashboard.js
import React from 'react';
import Card from './components/Card.jsx';
import './Dashboard.css';

function Dashboard() {
    const companies = [
        { id: 1, name: "Company A", position: "Engineer", status: "Active" },
        { id: 2, name: "Company B", position: "Designer", status: "Inactive" },
        { id: 3, name: "Company C", position: "Manager", status: "Pending" },
        { id: 4, name: "Company D", position: "Developer", status: "Active" },
        { id: 5, name: "Company E", position: "Analyst", status: "Inactive" },
        { id: 6, name: "Company F", position: "Consultant", status: "Pending" }
    ];

    return (
        <div className="dashboard">
            <div className="header">Dashboard</div>

            <div className="filter-section">
                <div className="filter-icon">
                    <i>🔍</i>
                </div>
                <div className="search-bar">
                    <i>🔍</i>
                    <input type="text" placeholder="Company" />
                </div>
            </div>

            <div className="cards">
                {companies.map(company => (
                    <Card key={company.id} company={company} />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
