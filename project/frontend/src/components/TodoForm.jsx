import React, { useState } from 'react';

export default function TodoForm({ onAdd }) {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [prioridad, setPrioridad] = useState('banal'); // 'banal', 'grave', 'mortal'
  const [fechaLimite, setFechaLimite] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!titulo.trim()) {
      setError('Debes ingresar un título para la invocación.');
      return;
    }
    
    if (titulo.length > 100) {
      setError('La invocación no puede exceder los 100 caracteres.');
      return;
    }

    setError('');
    onAdd({
      titulo: titulo.trim(),
      descripcion: descripcion.trim() || null,
      prioridad,
      fechaLimite: fechaLimite || null
    });

    // Resetear formulario
    setTitulo('');
    setDescripcion('');
    setPrioridad('banal');
    setFechaLimite('');
  };

  return (
    <div className="hand-drawn-card candle-flicker">
      <form onSubmit={handleSubmit} className="todo-form">
        <h2 style={{ fontFamily: 'var(--font-title)', fontSize: '1.25rem', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
          Invocar Nueva Tarea
        </h2>
        
        {error && (
          <div style={{ color: 'var(--accent-carmine-hover)', fontSize: '0.85rem', fontWeight: 'bold' }}>
            ⚠ {error}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="titulo">¿Qué pretendes invocar?</label>
          <input
            id="titulo"
            type="text"
            className="input-gothic"
            placeholder="Ej. Leer el Necronomicon"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            maxLength={100}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="descripcion">Detalles del ritual (Opcional)</label>
          <textarea
            id="descripcion"
            className="input-gothic"
            placeholder="Ej. Enfocarse en la sección de resurrecciones..."
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Nivel de Severidad (Prioridad)</label>
          <div className="priority-selector">
            <button
              type="button"
              className={`priority-btn banal ${prioridad === 'banal' ? 'active' : ''}`}
              onClick={() => setPrioridad('banal')}
            >
              Banal 🪵
            </button>
            <button
              type="button"
              className={`priority-btn grave ${prioridad === 'grave' ? 'active' : ''}`}
              onClick={() => setPrioridad('grave')}
            >
              Grave 🔮
            </button>
            <button
              type="button"
              className={`priority-btn mortal ${prioridad === 'mortal' ? 'active' : ''}`}
              onClick={() => setPrioridad('mortal')}
            >
              Mortal 💀
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="fechaLimite">Hora del Juicio (Fecha Límite - Opcional)</label>
          <input
            id="fechaLimite"
            type="datetime-local"
            className="input-gothic"
            value={fechaLimite}
            onChange={(e) => setFechaLimite(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-gothic mt-4">
          Invocar Tarea 🖋
        </button>
      </form>
    </div>
  );
}
