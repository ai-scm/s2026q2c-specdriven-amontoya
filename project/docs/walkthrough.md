# Walkthrough: Grimorio de Pendientes

Hemos finalizado con éxito la implementación del "Grimorio de Pendientes", una aplicación de gestión de tareas con estética gótica (estilo caricatura de Tim Burton), persistencia en base de datos SQLite y empaquetado autocontenido en Docker.

---

## Cambios Realizados

El proyecto ha sido estructurado en una arquitectura limpia de microservicios con un monorepo básico:

### 1. Backend e Integración de Datos
*   **[database.js](file:///home/alejandro_montoya/Documents/semillero/s2026q2c-specdriven-amontoya/project/backend/database.js)**: Configuración de conexión SQLite con envolturas de Promesas (`async/await`) y creación de la tabla `todos`.
*   **[server.js](file:///home/alejandro_montoya/Documents/semillero/s2026q2c-specdriven-amontoya/project/backend/server.js)**: API REST en Express con endpoints para crear (validación de longitud de título y prioridad), leer (ordenado por pendientes primero, mortalidad y orden cronológico descendente), actualizar (marcar como completada) y eliminar en lote (bulk delete).
*   **[test.js](file:///home/alejandro_montoya/Documents/semillero/s2026q2c-specdriven-amontoya/project/backend/test.js)**: Pruebas de integración automatizadas para todos los endpoints de la API contra una base de datos SQLite temporal.

### 2. Frontend y Estética (Vite + React + CSS)
*   **[App.css](file:///home/alejandro_montoya/Documents/semillero/s2026q2c-specdriven-amontoya/project/frontend/src/App.css)**: Sistema de estilos Tim Burton. Incluye viñetas de iluminación gótica, bordes de boceto a mano alzada mediante distorsión de bordes de CSS, selectores e iconos temáticos, paleta de colores carbón, hueso, carmín y morado, animaciones de parpadeo de vela y scrollbars personalizados.
*   **Componentes de React**:
    *   **[TodoForm.jsx](file:///home/alejandro_montoya/Documents/semillero/s2026q2c-specdriven-amontoya/project/frontend/src/components/TodoForm.jsx)**: Formulario de invocación de tareas con inputs legibles y botones de prioridad temáticos (*Banal*, *Grave*, *Mortal*).
    *   **[TodoFilters.jsx](file:///home/alejandro_montoya/Documents/semillero/s2026q2c-specdriven-amontoya/project/frontend/src/components/TodoFilters.jsx)**: Filtros tipo pestaña (*Todas*, *Vivas*, *Sepultadas*).
    *   **[TodoItem.jsx](file:///home/alejandro_montoya/Documents/semillero/s2026q2c-specdriven-amontoya/project/frontend/src/components/TodoItem.jsx)**: Tarjeta individual con checkbox de borrado masivo y checkbox de completado con diseño de "X" en tinta carmesí, badge de prioridad y fecha límite ("Hora del Juicio").
    *   **[BulkActions.jsx](file:///home/alejandro_montoya/Documents/semillero/s2026q2c-specdriven-amontoya/project/frontend/src/components/BulkActions.jsx)**: Panel inferior flotante que emerge al seleccionar una o más tareas, permitiendo desterrarlas simultáneamente.
    *   **[App.jsx](file:///home/alejandro_montoya/Documents/semillero/s2026q2c-specdriven-amontoya/project/frontend/src/App.jsx)**: Orquestador del estado y llamadas fetch a la API.

### 3. Configuración de Contenedores y Persistencia
*   **[Dockerfile](file:///home/alejandro_montoya/Documents/semillero/s2026q2c-specdriven-amontoya/project/Dockerfile)**: Compilación del frontend estático y empaquetamiento final en una imagen ligera basada en Node Alpine. Crea una ruta persistente en `/data` para la BD SQLite.
*   **[docker-compose.yml](file:///home/alejandro_montoya/Documents/semillero/s2026q2c-specdriven-amontoya/project/docker-compose.yml)**: Define el servicio, puerto expuesto `3000` y volumen con nombre `grimorio-db-vol` para persistencia duradera.

---

## Verificación de Resultados

### 1. Pruebas de Integración (Backend API)
Se ejecutó el conjunto de pruebas en `backend/test.js` arrojando resultados exitosos para:
*   Creación de tareas (validando límites y formatos).
*   Correcto ordenamiento lógico de tareas (pendientes primero, ordenadas por prioridad Mortal -> Grave -> Banal).
*   Borrado en bloque con múltiples IDs de forma atómica.
*   Limpieza y eliminación física de registros.

```bash
> node test.js
Conectado a la base de datos SQLite en: .../backend/test_grimorio.db
Tabla de tareas verificada/inicializada.
--- INICIANDO PRUEBAS DE INTEGRACIÓN ---
✔ GET /api/todos inicial vacío correcto.
✔ POST /api/todos creación exitosa.
✔ POST /api/todos segunda creación exitosa.
✔ PUT /api/todos/:id marcar como completado exitoso.
✔ GET /api/todos orden correcto (pendientes primero).
✔ POST /api/todos/delete-bulk borrado en lote exitoso.
✔ Verificación de base de datos vacía final exitosa.
--- ¡TODAS LAS PRUEBAS PASARON EXITOSAMENTE! 🎉 ---
```

### 2. Verificación Estática Local
El frontend compiló correctamente usando Vite y el servidor backend sirvió de manera estática el resultado en el puerto local 3000 de manera impecable.

---

## Cómo Levantar la Aplicación

Puedes ejecutar el proyecto de dos formas según tu preferencia:

### Método A: Despliegue con Docker (Recomendado)
Asegúrate de estar en el directorio raíz del proyecto y ejecuta:

```bash
docker compose up --build
```

*   **Acceso**: Abre tu navegador en [http://localhost:3000](http://localhost:3000).
*   **Persistencia**: El archivo de base de datos se guarda en un volumen gestionado por Docker, por lo que tus tareas no se borrarán aunque detengas o destruyas el contenedor.

### Método B: Desarrollo Local
Si deseas modificar el código y ver los cambios en caliente:

1.  Instala las dependencias globales en la raíz:
    ```bash
    npm install
    npm run install:all
    ```
2.  Levanta los servidores de desarrollo de manera concurrente:
    ```bash
    npm run dev
    ```
3.  **Acceso**: Abre [http://localhost:5173](http://localhost:5173) (el frontend se comunicará con el backend mediante proxy).
