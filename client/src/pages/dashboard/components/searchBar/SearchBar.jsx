// components/SearchBar.jsx
import React from 'react';
import './SearchBar.css';

function SearchBar({ onSearch }) {
    return (
        <div className="search-bar">
            <i className="search-icon">🔍</i>
            <input 
                type="text" 
                placeholder="Search by company name" 
                onChange={(e) => onSearch(e.target.value)} 
            />
        </div>
    );
}

export default SearchBar;
