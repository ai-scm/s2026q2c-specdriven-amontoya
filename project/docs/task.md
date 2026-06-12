# Lista de Tareas: Grimorio de Pendientes

Este documento describe la lista de tareas detalladas para el desarrollo y despliegue del proyecto. El progreso se irá actualizando a medida que completemos cada sección.

## [x] Fase 1: Estructura del Proyecto y Configuración de Docker
- [x] Inicializar el proyecto raíz con un `package.json` principal.
- [x] Configurar el archivo `Dockerfile` multi-etapa (etapa de build para React y etapa de ejecución para Express + SQLite).
- [x] Crear las carpetas `backend/` y `frontend/` con sus configuraciones básicas.

## [x] Fase 2: Desarrollo del Backend y Base de Datos (SQLite)
- [x] Crear la base de datos `database.js` con el esquema de SQLite y la tabla `todos`.
- [x] Crear el servidor Express (`server.js`) y configurar CORS, parseo de JSON y servir archivos estáticos.
- [x] Implementar el endpoint `GET /api/todos` (obtener tareas).
- [x] Implementar el endpoint `POST /api/todos` (crear tarea con validaciones de prioridad y título).
- [x] Implementar el endpoint `PUT /api/todos/:id` (actualizar estado/detalles).
- [x] Implementar el endpoint `POST /api/todos/delete-bulk` (eliminar múltiples tareas).
- [x] Escribir un script de prueba de integración básico (`test.js`) para verificar el correcto funcionamiento de la API y SQLite.

## [x] Fase 3: Desarrollo del Frontend (Vite + React + CSS Temático)
- [x] Inicializar la aplicación React usando Vite y configurar las tipografías *Cinzel* e *Inter*/*Lora* de Google Fonts.
- [x] Implementar el sistema de estilos góticos en `App.css` (variables de color Tim Burton, animación de parpadeo, bordes simulados a mano alzada).
- [x] Desarrollar el componente `TodoFilters` (filtrado entre Todas / Vivas / Sepultadas).
- [x] Desarrollar el formulario `TodoForm` ("Invocar Tarea") con validaciones integradas y selectores de prioridad personalizados.
- [x] Desarrollar el componente `TodoItem` (tarjeta de tarea con checkbox temático, badges de prioridad y selección para borrado masivo).
- [x] Desarrollar la barra inferior `BulkActions` ("Desterrar Tareas") que aparece cuando hay elementos seleccionados.
- [x] Integrar todos los componentes en `App.jsx` y conectar con las llamadas de API del backend.

## [x] Fase 4: Integración, Optimización y Dockerización
- [x] Compilar el frontend y verificar que el backend Express sirva correctamente la build estática.
- [x] Construir la imagen de Docker utilizando el Dockerfile.
- [x] Levantar el contenedor Docker montando un volumen para la persistencia del archivo `grimorio.db`.
- [x] Verificar que la aplicación sea completamente funcional en `http://localhost:3000`.

## [x] Fase 5: Documentación y Cierre
- [x] Crear el archivo de cierre `walkthrough.md` documentando las pruebas de funcionamiento con capturas y pasos realizados.
