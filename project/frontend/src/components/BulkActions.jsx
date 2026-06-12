import React from 'react';

export default function BulkActions({ selectedCount, onDeleteSelected, onClearSelection }) {
  const isVisible = selectedCount > 0;

  return (
    <div className={`bulk-actions-bar ${isVisible ? 'visible' : ''}`}>
      <div className="bulk-info">
        Tienes <span>{selectedCount}</span> {selectedCount === 1 ? 'alma' : 'almas'} en tu poder
      </div>
      
      <div className="bulk-buttons">
        <button 
          className="btn-gothic" 
          onClick={onClearSelection}
          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
        >
          Liberar Selección
        </button>
        <button 
          className="btn-gothic btn-danger" 
          onClick={onDeleteSelected}
          style={{ padding: '8px 16px', fontSize: '0.8rem' }}
        >
          Desterrar Seleccionados 💀
        </button>
      </div>
    </div>
  );
}
