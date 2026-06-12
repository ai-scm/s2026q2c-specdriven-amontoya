require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { db, initDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend (para producción en Docker)
const publicPath = path.join(__dirname, 'public');
app.use(express.static(publicPath));

// Inicializar la base de datos
initDb();

// Rutas API

// 1. Obtener todas las tareas
// Orden: Pendientes primero (con prioridad Mortal -> Grave -> Banal), luego completadas en el fondo.
app.get('/api/todos', async (req, res) => {
  try {
    const query = `
      SELECT * FROM todos
      ORDER BY 
        completada ASC,
        CASE prioridad
          WHEN 'mortal' THEN 1
          WHEN 'grave' THEN 2
          WHEN 'banal' THEN 3
          ELSE 4
        END ASC,
        fechaCreacion DESC
    `;
    const todos = await db.all(query);
    // Convertir completada de 1/0 a boolean para comodidad en React
    const formattedTodos = todos.map(todo => ({
      ...todo,
      completada: todo.completada === 1
    }));
    res.json(formattedTodos);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error al obtener las almas del grimorio.' });
  }
});

// 2. Crear una nueva tarea
app.post('/api/todos', async (req, res) => {
  const { titulo, descripcion, prioridad, fechaLimite } = req.body;

  // Validaciones
  if (!titulo || typeof titulo !== 'string' || titulo.trim() === '') {
    return res.status(400).json({ error: 'Toda tarea requiere una descripción o título.' });
  }
  if (titulo.length > 100) {
    return res.status(400).json({ error: 'La invocación es demasiado larga (máx. 100 caracteres).' });
  }

  const validPriorities = ['banal', 'grave', 'mortal'];
  const finalPriority = validPriorities.includes(prioridad) ? prioridad : 'banal';
  
  const fechaCreacion = new Date().toISOString();
  const finalFechaLimite = fechaLimite ? new Date(fechaLimite).toISOString() : null;

  try {
    const query = `
      INSERT INTO todos (titulo, descripcion, prioridad, completada, fechaCreacion, fechaLimite)
      VALUES (?, ?, ?, 0, ?, ?)
    `;
    const result = await db.run(query, [
      titulo.trim(),
      descripcion ? descripcion.trim() : null,
      finalPriority,
      fechaCreacion,
      finalFechaLimite
    ]);

    const newTodo = {
      id: result.id,
      titulo: titulo.trim(),
      descripcion: descripcion ? descripcion.trim() : null,
      prioridad: finalPriority,
      completada: false,
      fechaCreacion,
      fechaLimite: finalFechaLimite
    };

    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error al invocar la tarea en el grimorio.' });
  }
});

// 3. Actualizar una tarea
app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { titulo, descripcion, prioridad, completada, fechaLimite } = req.body;

  if (titulo !== undefined && (typeof titulo !== 'string' || titulo.trim() === '')) {
    return res.status(400).json({ error: 'El título no puede quedar vacío.' });
  }

  try {
    // Comprobar si la tarea existe
    const existing = await db.get('SELECT * FROM todos WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ error: 'La tarea no existe en este reino.' });
    }

    const finalTitulo = titulo !== undefined ? titulo.trim() : existing.titulo;
    const finalDescripcion = descripcion !== undefined ? descripcion : existing.descripcion;
    
    let finalPrioridad = existing.prioridad;
    if (prioridad !== undefined) {
      const validPriorities = ['banal', 'grave', 'mortal'];
      finalPrioridad = validPriorities.includes(prioridad) ? prioridad : existing.prioridad;
    }

    let finalCompletada = existing.completada;
    if (completada !== undefined) {
      finalCompletada = completada ? 1 : 0;
    }

    const finalFechaLimite = fechaLimite !== undefined 
      ? (fechaLimite ? new Date(fechaLimite).toISOString() : null) 
      : existing.fechaLimite;

    const query = `
      UPDATE todos
      SET titulo = ?, descripcion = ?, prioridad = ?, completada = ?, fechaLimite = ?
      WHERE id = ?
    `;
    await db.run(query, [finalTitulo, finalDescripcion, finalPrioridad, finalCompletada, finalFechaLimite, id]);

    res.json({
      id: parseInt(id),
      titulo: finalTitulo,
      descripcion: finalDescripcion,
      prioridad: finalPrioridad,
      completada: finalCompletada === 1,
      fechaCreacion: existing.fechaCreacion,
      fechaLimite: finalFechaLimite
    });
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ error: 'Error al alterar el grimorio.' });
  }
});

// 4. Eliminar tareas en lote (Bulk Delete)
app.post('/api/todos/delete-bulk', async (req, res) => {
  const { ids } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: 'Se requieren identificadores para desterrar.' });
  }

  // Sanitizar y validar que todos sean números enteros
  const cleanIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id));

  if (cleanIds.length === 0) {
    return res.status(400).json({ error: 'Identificadores inválidos.' });
  }

  try {
    const placeholders = cleanIds.map(() => '?').join(',');
    const query = `DELETE FROM todos WHERE id IN (${placeholders})`;
    const result = await db.run(query, cleanIds);

    res.json({ 
      message: `${result.changes} tareas desterradas con éxito del grimorio.`,
      deletedCount: result.changes
    });
  } catch (error) {
    console.error('Error al eliminar tareas en lote:', error);
    res.status(500).json({ error: 'Error al purgar las almas seleccionadas.' });
  }
});

// Ruta comodín para SPA (React Router / fallback de recarga)
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`El Grimorio está escuchando en el puerto ${PORT} (http://localhost:${PORT})`);
});
