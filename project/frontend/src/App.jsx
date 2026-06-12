import React, { useState, useEffect } from 'react';
import TodoForm from './components/TodoForm';
import TodoItem from './components/TodoItem';
import TodoFilters from './components/TodoFilters';
import BulkActions from './components/BulkActions';

export default function App() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('todas'); // 'todas', 'vivas', 'sepultadas'
  const [selectedIds, setSelectedIds] = useState([]);

  // URL base para la API (con soporte de proxy en desarrollo)
  const API_URL = '/api/todos';

  // Cargar tareas al montar
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error('Error al conectar con el grimorio.');
      const data = await res.json();
      setTodos(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Las almas no responden. No se pudo conectar al servidor.');
    } finally {
      setLoading(false);
    }
  };

  // Crear una nueva tarea
  const handleAddTodo = async (newTodo) => {
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTodo)
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Fallo de invocación.');
      }
      const data = await res.json();
      // Insertar en la lista (re-cargar para mantener el orden por defecto)
      fetchTodos();
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  // Completar/Descompletar tarea
  const handleToggleTodo = async (id, completada) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completada })
      });
      if (!res.ok) throw new Error('Fallo al sepultar/revivir la tarea.');
      
      // Actualizar estado local
      setTodos(prev => 
        prev.map(todo => todo.id === id ? { ...todo, completada } : todo)
      );
      // Re-cargar para ajustar el ordenamiento (completadas abajo)
      setTimeout(fetchTodos, 300);
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Eliminar una única tarea
  const handleDeleteTodo = async (id) => {
    if (!confirm('¿Estás seguro de que deseas desterrar esta tarea permanentemente?')) {
      return;
    }
    try {
      const res = await fetch(`${API_URL}/delete-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: [id] })
      });
      if (!res.ok) throw new Error('Fallo al desterrar la tarea.');
      
      // Limpiar selección si estaba seleccionada
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
      // Actualizar lista
      fetchTodos();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Eliminar múltiples tareas
  const handleDeleteSelected = async () => {
    if (!confirm(`¿Estás seguro de que deseas desterrar estas ${selectedIds.length} tareas seleccionadas?`)) {
      return;
    }
    try {
      const res = await fetch(`${API_URL}/delete-bulk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      if (!res.ok) throw new Error('Fallo al desterrar las tareas seleccionadas.');

      setSelectedIds([]);
      fetchTodos();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Alternar selección de checkbox para bulk delete
  const handleSelectToggle = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id) 
        : [...prev, id]
    );
  };

  // Limpiar selección múltiple
  const handleClearSelection = () => {
    setSelectedIds([]);
  };

  // Filtrar tareas en cliente
  const filteredTodos = todos.filter(todo => {
    if (filter === 'vivas') return !todo.completada;
    if (filter === 'sepultadas') return todo.completada;
    return true;
  });

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title candle-flicker">Grimorio de Pendientes</h1>
        <p className="app-subtitle">Anota tus quehaceres terrenales y rituales oscuros</p>
      </header>

      {/* Formulario */}
      <TodoForm onAdd={handleAddTodo} />

      {/* Filtros */}
      <TodoFilters currentFilter={filter} setFilter={setFilter} />

      {/* Estado de carga / Error */}
      {loading && todos.length === 0 ? (
        <div className="text-center" style={{ color: 'var(--color-dust)', fontStyle: 'italic' }}>
          Consultando a los espíritus (cargando)...
        </div>
      ) : error ? (
        <div className="text-center" style={{ color: 'var(--accent-carmine-hover)' }}>
          {error}
        </div>
      ) : (
        /* Lista de tareas */
        <div className="todos-list">
          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon" role="img" aria-label="ghost">👻</span>
              <p style={{ fontFamily: 'var(--font-title)', letterSpacing: '1px' }}>
                {filter === 'todas' && 'El grimorio está en silencio.'}
                {filter === 'vivas' && 'No quedan tareas vivas en este reino.'}
                {filter === 'sepultadas' && 'El cementerio de tareas está vacío.'}
              </p>
              <p style={{ fontSize: '0.85rem' }}>
                {filter === 'todas' && 'Ninguna alma en pena ha sido invocada aún.'}
                {filter === 'vivas' && 'Todas las almas han sido sepultadas con éxito.'}
                {filter === 'sepultadas' && 'Comienza a sepultar tareas para poblarlo.'}
              </p>
            </div>
          ) : (
            filteredTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isSelected={selectedIds.includes(todo.id)}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
                onSelectToggle={handleSelectToggle}
              />
            ))
          )}
        </div>
      )}

      {/* Barra inferior de acciones en lote */}
      <BulkActions 
        selectedCount={selectedIds.length} 
        onDeleteSelected={handleDeleteSelected}
        onClearSelection={handleClearSelection}
      />
    </div>
  );
}
