const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Obtener ruta de la base de datos de variables de entorno o usar local por defecto
const dbPath = process.env.DATABASE_PATH || path.join(__dirname, 'grimorio.db');

// Asegurar que el directorio de la base de datos exista
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error al conectar con SQLite:', err.message);
  } else {
    console.log(`Conectado a la base de datos SQLite en: ${dbPath}`);
  }
});

// Envolver funciones en Promesas para usar async/await
const dbQuery = {
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  run: function(sql, params = []) {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }
};

// Inicializar tablas
function initDb() {
  const schema = `
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titulo TEXT NOT NULL,
      descripcion TEXT,
      prioridad TEXT CHECK(prioridad IN ('banal', 'grave', 'mortal')) DEFAULT 'banal',
      completada INTEGER DEFAULT 0,
      fechaCreacion TEXT NOT NULL,
      fechaLimite TEXT
    );
  `;
  return dbQuery.run(schema)
    .then(() => {
      console.log('Tabla de tareas verificada/inicializada.');
    })
    .catch((err) => {
      console.error('Error al inicializar la base de datos:', err);
      process.exit(1);
    });
}

module.exports = {
  db: dbQuery,
  initDb,
  rawDb: db
};
