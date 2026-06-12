import React from 'react';

export default function TodoItem({ todo, onToggle, onDelete, isSelected, onSelectToggle }) {
  const isOverdue = todo.fechaLimite && new Date(todo.fechaLimite) < new Date() && !todo.completada;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'mortal': return 'Mortal 💀';
      case 'grave': return 'Grave 🔮';
      case 'banal':
      default:
        return 'Banal 🪵';
    }
  };

  return (
    <div className={`todo-item ${todo.completada ? 'completed' : ''}`}>
      {/* 1. Checkbox de Selección Múltiple (Bulk Delete) */}
      <label className="gothic-checkbox-container bulk-checkbox" title="Seleccionar para desterrar">
        <input 
          type="checkbox" 
          checked={isSelected} 
          onChange={() => onSelectToggle(todo.id)}
        />
        <span className="checkmark"></span>
      </label>

      {/* 2. Checkbox de Completada */}
      <label className="gothic-checkbox-container" title={todo.completada ? 'Marcar como viva' : 'Sepultar tarea'}>
        <input 
          type="checkbox" 
          checked={todo.completada} 
          onChange={() => onToggle(todo.id, !todo.completada)}
        />
        <span className="checkmark"></span>
      </label>

      {/* 3. Contenido de la Tarea */}
      <div className="todo-content">
        <span className="todo-title">{todo.titulo}</span>
        {todo.descripcion && <span className="todo-desc">{todo.descripcion}</span>}
        
        <div className="todo-dates">
          <span className="date-badge">
            Invotación: {formatDate(todo.fechaCreacion)}
          </span>
          {todo.fechaLimite && (
            <span className={`date-badge ${isOverdue ? 'overdue' : ''}`}>
              ⌛ Juicio: {formatDate(todo.fechaLimite)} {isOverdue && '(VENCIDO)'}
            </span>
          )}
        </div>
      </div>

      {/* 4. Badges de Prioridad y Acciones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
        <span className={`priority-badge ${todo.prioridad}`}>
          {getPriorityLabel(todo.prioridad)}
        </span>
        
        <button 
          className="btn-icon delete" 
          onClick={() => onDelete(todo.id)}
          title="Desterrar del grimorio"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    </div>
  );
}
