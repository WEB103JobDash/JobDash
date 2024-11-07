import React, { useState } from 'react';

const FilterButtons = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  
  const filters = ['All', 'Applied', 'OAs', 'Interview', 'Offer', 'Rejected'];
  
  return (
    <div className="filter-buttons">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => setActiveFilter(filter)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
            ${activeFilter === filter 
              ? 'bg-gray-900 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;