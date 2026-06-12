// Script de pruebas de integración para la API del Grimorio
const path = require('path');
const fs = require('fs');

// Configurar base de datos de pruebas temporaria
const testDbPath = path.join(__dirname, 'test_grimorio.db');
process.env.DATABASE_PATH = testDbPath;
process.env.PORT = '3001'; // Puerto alterno para pruebas

// Asegurar limpieza inicial
if (fs.existsSync(testDbPath)) {
  fs.unlinkSync(testDbPath);
}

// Iniciar servidor
const server = require('./server');
const { rawDb } = require('./database');

// Esperar a que la BD se inicialice
setTimeout(async () => {
  try {
    console.log('--- INICIANDO PRUEBAS DE INTEGRACIÓN ---');
    const baseUrl = 'http://localhost:3001/api';

    // 1. Obtener lista inicial (debería estar vacía)
    let res = await fetch(`${baseUrl}/todos`);
    let todos = await res.json();
    assert(res.status === 200, 'Obtener inicial falló');
    assert(Array.isArray(todos) && todos.length === 0, 'La base de datos debería estar vacía al iniciar');
    console.log('✔ GET /api/todos inicial vacío correcto.');

    // 2. Crear una tarea
    const newTodo = {
      titulo: 'Aprender invocación nigromántica',
      descripcion: 'Leer el capítulo 3 del grimorio oscuro.',
      prioridad: 'mortal',
      fechaLimite: '2026-10-31T23:59:59.000Z'
    };
    res = await fetch(`${baseUrl}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo)
    });
    const createdTodo = await res.json();
    assert(res.status === 201, 'Crear tarea falló');
    assert(createdTodo.titulo === newTodo.titulo, 'Título incorrecto');
    assert(createdTodo.prioridad === 'mortal', 'Prioridad incorrecta');
    assert(createdTodo.completada === false, 'Debería nacer como no completada');
    console.log('✔ POST /api/todos creación exitosa.');

    // 3. Crear otra tarea para pruebas bulk
    const secondTodo = {
      titulo: 'Limpiar las telarañas',
      prioridad: 'banal'
    };
    res = await fetch(`${baseUrl}/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(secondTodo)
    });
    const createdSecond = await res.json();
    assert(res.status === 201, 'Crear segunda tarea falló');
    console.log('✔ POST /api/todos segunda creación exitosa.');

    // 4. Actualizar estado de la primera tarea (marcar como completada)
    res = await fetch(`${baseUrl}/todos/${createdTodo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completada: true })
    });
    const updatedTodo = await res.json();
    assert(res.status === 200, 'Actualizar tarea falló');
    assert(updatedTodo.completada === true, 'El estado completada no se actualizó');
    console.log('✔ PUT /api/todos/:id marcar como completado exitoso.');

    // 5. Verificar ordenamiento
    // Debería devolver primero la pendiente ('Limpiar las telarañas', banal)
    // y de último la completada (a pesar de ser prioridad 'mortal')
    res = await fetch(`${baseUrl}/todos`);
    todos = await res.json();
    assert(todos.length === 2, 'Deberían haber dos tareas');
    assert(todos[0].id === createdSecond.id, 'La pendiente debería ir primero por ordenamiento');
    assert(todos[1].id === createdTodo.id, 'La completada debería ir al final');
    console.log('✔ GET /api/todos orden correcto (pendientes primero).');

    // 6. Eliminar en lote (Bulk Delete)
    res = await fetch(`${baseUrl}/todos/delete-bulk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: [createdTodo.id, createdSecond.id] })
    });
    const deleteResult = await res.json();
    assert(res.status === 200, 'Borrado en lote falló');
    assert(deleteResult.deletedCount === 2, 'Deberían borrarse 2 tareas');
    console.log('✔ POST /api/todos/delete-bulk borrado en lote exitoso.');

    // 7. Verificar que el grimorio quedó vacío de nuevo
    res = await fetch(`${baseUrl}/todos`);
    todos = await res.json();
    assert(todos.length === 0, 'La base de datos debería estar vacía de nuevo');
    console.log('✔ Verificación de base de datos vacía final exitosa.');

    console.log('\n--- ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE! 🎉 ---');
    cleanup(0);
  } catch (error) {
    console.error('❌ ¡ERROR EN LAS PRUEBAS!', error.message);
    console.error(error.stack);
    cleanup(1);
  }
}, 1000);

// Función básica de aserción
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Falla de aserción');
  }
}

// Limpieza de recursos y terminación
function cleanup(exitCode) {
  console.log('Limpiando base de datos de pruebas...');
  
  // Cerrar conexión SQLite
  rawDb.close((err) => {
    if (err) console.error('Error al cerrar base de datos:', err);
    
    // Borrar archivo temporal
    if (fs.existsSync(testDbPath)) {
      try {
        fs.unlinkSync(testDbPath);
        console.log('Base de datos de pruebas eliminada.');
      } catch (e) {
        console.error('No se pudo eliminar archivo DB temporal:', e.message);
      }
    }
    
    process.exit(exitCode);
  });
}
