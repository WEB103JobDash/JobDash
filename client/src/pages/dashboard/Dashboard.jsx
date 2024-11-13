// Dashboard.js
import { useState } from 'react';
import React from 'react';
import Card from './components/card/Card.jsx';
import SearchBar from './components/searchBar/SearchBar.jsx';
import FilterButtons from './components/filterOptions/FilterButtons.jsx';
import './Dashboard.css';

function Dashboard() {
    const [searchQuery, setSearchQuery] = useState("");


    const companies = [
        { id: 1, name: "Company A", position: "Engineer", status: "Active" },
        { id: 2, name: "Company B", position: "Designer", status: "Inactive" },
        { id: 3, name: "Company C", position: "Manager", status: "Pending" },
        { id: 4, name: "Company D", position: "Developer", status: "Active" },
        { id: 5, name: "Company E", position: "Analyst", status: "Inactive" },
        { id: 6, name: "Company F", position: "Consultant", status: "Pending" },
        { id: 7, name: "Company G", position: "SWE", status: "Pending" }
    ];

     // Filter companies based on the search query
     const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div className="dashboard">
            <div className="header">Dashboard</div>

           
            <div className="filter-section">
                <div className="filter-options">
                    <FilterButtons />
                </div>
                <SearchBar onSearch={setSearchQuery} />
            </div>

            <div className="cards">
                {filteredCompanies.map(company => (
                    <Card key={company.id} company={company} />
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
