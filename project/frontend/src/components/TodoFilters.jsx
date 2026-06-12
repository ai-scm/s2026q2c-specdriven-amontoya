import React from 'react';

export default function TodoFilters({ currentFilter, setFilter }) {
  return (
    <div className="filters-container">
      <button 
        className={`filter-tab ${currentFilter === 'todas' ? 'active' : ''}`}
        onClick={() => setFilter('todas')}
      >
        Todas
      </button>
      <button 
        className={`filter-tab ${currentFilter === 'vivas' ? 'active' : ''}`}
        onClick={() => setFilter('vivas')}
      >
        Vivas
      </button>
      <button 
        className={`filter-tab ${currentFilter === 'sepultadas' ? 'active' : ''}`}
        onClick={() => setFilter('sepultadas')}
      >
        Sepultadas
      </button>
    </div>
  );
}
