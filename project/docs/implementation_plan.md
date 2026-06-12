# Plan de Implementación: Grimorio de Pendientes (Gothic To-Do App)

Esta especificación detalla el diseño, arquitectura, base de datos y criterios de aceptación para la aplicación web "Grimorio de Pendientes", una app de lista de tareas con estética gótica inspirada en las caricaturas oscuras de Tim Burton (líneas esbozadas a mano, alto contraste, fondos oscuros, tipografía legible pero elegante y detalles temáticos).

La aplicación se desplegará fácilmente mediante un único contenedor **Docker** que contendrá el servidor backend en Node.js (con **SQLite**) y servirá la aplicación frontend estática construida con **Vite + React**.

---

## Arquitectura y Componentes

El proyecto se estructurará de la siguiente manera dentro del directorio del proyecto:

```
project/
├── Dockerfile
├── package.json (monorepo / scripts para levantar todo)
├── backend/
│   ├── package.json
│   ├── server.js
│   └── database.js
├── frontend/
│   ├── package.json
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── App.css (Diseño y Sistema de Estilos Temático)
│   │   └── components/
│   │       ├── TodoForm.jsx
│   │       ├── TodoItem.jsx
│   │       ├── TodoFilters.jsx
│   │       └── BulkActions.jsx
```

---

## 1. Especificación de la Base de Datos (SQLite)

Se utilizará una base de datos SQLite llamada `grimorio.db`. La base de datos tendrá una única tabla `todos` con el siguiente esquema:

```sql
CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo TEXT NOT NULL,
    descripcion TEXT,
    prioridad TEXT CHECK(prioridad IN ('banal', 'grave', 'mortal')) DEFAULT 'banal',
    completada INTEGER DEFAULT 0, -- 0 = Pendiente, 1 = Completada
    fechaCreacion TEXT NOT NULL,  -- Guardado como ISO 8601 string
    fechaLimite TEXT              -- Guardado como ISO 8601 string o NULL (Hora del Juicio)
);
```

---

## 2. API Endpoints (Backend en Express)

El servidor backend expondrá las siguientes rutas REST bajo `/api`:

*   **`GET /api/todos`**: Retorna todas las tareas ordenadas por `fechaCreacion` (descendente) o prioridad.
*   **`POST /api/todos`**: Crea una nueva tarea.
    *   *Body esperado*: `{ titulo, descripcion, prioridad, fechaLimite }`
    *   *Validaciones*: `titulo` no puede estar vacío y debe tener máximo 100 caracteres. `prioridad` debe ser una de las tres válidas.
*   **`PUT /api/todos/:id`**: Actualiza el estado o detalles de una tarea (p. ej., marcar como completada, editar texto).
    *   *Body esperado*: `{ titulo, descripcion, prioridad, completada, fechaLimite }`
*   **`POST /api/todos/delete-bulk`**: Elimina una o más tareas a la vez.
    *   *Body esperado*: `{ ids: [id1, id2, ...] }`
    *   *Validaciones*: `ids` debe ser un arreglo no vacío de enteros.

---

## 3. Especificaciones del Frontend y Estética (UI/UX)

### Estilo Visual (Tim Burton / Gótico)
*   **Colores**: 
    *   Fondo: Oscuro absoluto / Gris carbón texturizado (#121212, #1a1a1a).
    *   Texto principal: Blanco hueso (#e0dacb) para máxima legibilidad.
    *   Texto secundario: Gris ceniza (#8c857b).
    *   Detalles / Acentos: Morado espectral (#6a0dad) o Rojo carmesí (#8b0000) para prioridades altas o alertas.
*   **Tipografía**:
    *   Títulos: *Cinzel* (Google Fonts) - Una fuente Serif seria, elegante, romana y de aspecto antiguo que evoca grimorios.
    *   Textos y Tareas: *Lora* o *Inter* (Google Fonts) - Altamente legibles, serias y claras para que no haya fatiga al leer las tareas.
*   **Componentes Visuales**:
    *   **Bordes Bosquejados (Hand-drawn look)**: Se logrará mediante efectos CSS como bordes ligeramente irregulares utilizando `border-radius: 255px 15px 225px 15px/15px 225px 15px 255px` combinados con sombras dobles simulando bocetos en tinta.
    *   **Botones**: Estilo "grabado en piedra" o "tinta en pergamino", con efectos hover donde el contorno tiemble o cambie ligeramente como una animación de boceto.

### Funcionalidades de la Interfaz
1.  **Formulario de Invocación (Crear Tarea)**:
    *   Campos: Título (obligatorio), Descripción (opcional, área de texto pequeña), Prioridad (selector tipo botón: *Banal*, *Grave*, *Mortal*), y Fecha Límite ("Hora del Juicio", input de fecha/hora opcional).
2.  **Lista de Tareas**:
    *   Cada tarea se presenta en una tarjeta estilo pergamino cenizo o caja de dibujo.
    *   Checkbox estilo gótico (un marco cuadrado dibujado a mano que al marcarse dibuja una "X" temblorosa en carmesí).
    *   Selector múltiple: Al hacer clic en un checkbox de selección rápida (o al lado de la tarea), se agrega a la lista de seleccionadas.
    *   Badges temáticos de prioridad:
        *   *Mortal*: Borde carmesí con texto "Mortal 💀".
        *   *Grave*: Borde morado con texto "Grave 🔮".
        *   *Banal*: Borde gris con texto "Banal 🪵".
3.  **Filtrado de Tareas**:
    *   Tres pestañas: *Todas*, *Vivas* (pendientes) y *Sepultadas* (completadas).
4.  **Barra de Acciones en Lote**:
    *   Si hay 1 o más tareas seleccionadas, aparece un panel inferior flotante con la opción: **"Desterrar [N] Tareas Seleccionadas"** (Eliminación directa mediante llamada al endpoint bulk).

---

## 4. Plan de Verificación

### Pruebas Automatizadas
*   Se creará un script de prueba de integración básico para la API del backend (`backend/test.js`) usando una base de datos SQLite en memoria para asegurar que:
    *   Se crean tareas válidas y se rechazan las inválidas.
    *   Se actualizan los estados correctamente.
    *   La eliminación en lote funciona con múltiples IDs.

### Verificación Manual
1.  **Visualización**: Abrir en el navegador y comprobar la responsividad del layout estilo dibujo y que las fuentes carguen de manera seria y legible.
2.  **Persistencia**: Crear tareas, recargar la página, y verificar que permanezcan ahí.
3.  **Flujo de Selección Múltiple**:
    *   Seleccionar 3 tareas pendientes.
    *   Presionar "Desterrar tareas seleccionadas".
    *   Verificar que desaparezcan de la base de datos y la interfaz.

---

## 5. Estrategia de Despliegue con Docker

Se implementará un único `Dockerfile` multi-etapa:
1.  **Etapa de Construcción (Frontend)**: Utiliza Node para compilar la aplicación Vite a archivos estáticos en `frontend/dist`.
2.  **Etapa de Producción (Backend + SQLite)**: Instala las dependencias del backend, copia los archivos estáticos de la app frontend construida a la carpeta pública del backend, e inicia el servidor en el puerto 3000.
3.  **Volumen SQLite**: El archivo `grimorio.db` se ubicará en un directorio `/data` dentro del contenedor que podrá ser persistido mediante un volumen de Docker.

---

## Preguntas Abiertas / Confirmación del Usuario

> [!NOTE]
> Por favor, revisa el plan. ¿Te parece bien la separación entre el título de estilo antiguo (Cinzel) y el texto de lectura seria y limpia (Inter / Lora)? 
> ¿Deseas realizar algún cambio en el esquema de prioridades (Banal, Grave, Mortal) antes de que comencemos?
