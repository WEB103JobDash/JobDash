import React, { useState } from 'react';
import './FilterButtons.css'; 

const FilterButtons = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filters = ['All', 'Applied', 'OAs', 'Interview', 'Offer', 'Rejected'];
  
  return (
    <div className="filter-buttons">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className="filter-button"
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;