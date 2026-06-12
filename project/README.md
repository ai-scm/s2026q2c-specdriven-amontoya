# Grimorio de Pendientes (Gothic To-Do App) 🔮💀

El **Grimorio de Pendientes** es una aplicación de gestión de tareas con estética gótica inspirada en el característico estilo visual de las caricaturas oscuras de Tim Burton. Esta aplicación fue diseñada y desarrollada bajo la metodología de **Spec-Driven Development (SDD)** (Desarrollo Orientado a Especificaciones).

---

## 🎯 Objetivo de la Prueba de SDD (Spec-Driven Development)

El propósito fundamental de este proyecto es evaluar y demostrar la efectividad de **Spec-Driven Development**. En lugar de proceder directamente a escribir código, el desarrollo siguió un flujo estructurado:
1.  **Definición de la Idea**: Consensuar las temáticas, alcances y límites del proyecto.
2.  **Redacción de Especificaciones**: Documentar con precisión la estructura de datos, el diseño de la API REST, los flujos de UI/UX y el diseño estético de CSS antes del desarrollo en el [Plan de Implementación](docs/implementation_plan.md).
3.  **Definición de Validaciones y Pruebas**: Crear especificaciones de pruebas unitarias y de integración que los endpoints de la API debían satisfacer antes de finalizar la lógica del cliente.
4.  **Codificación**: Implementar la base de datos, el backend y el frontend basándose estrictamente en las especificaciones acordadas, reduciendo la incertidumbre y errores de integración.

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend**: React (JS) con Vite como empaquetador y servidor de desarrollo.
*   **Estilos**: CSS Vainilla para lograr distorsiones de bordes estilo dibujo a mano alzada y animaciones góticas personalizadas.
*   **Fuentes**: *Cinzel* (Google Fonts) para títulos medievales/góticos e *Inter* para el cuerpo de texto legible.
*   **Backend**: Node.js con Express para la API REST.
*   **Base de Datos**: SQLite3 (base de datos relacional compacta y ligera en un archivo local).
*   **Contenedores y Despliegue**: Docker y Docker Compose para empaquetar de forma autocontenida la aplicación sin requerir dependencias en la máquina del usuario.

---

## 📦 Encapsulamiento de Dependencias y Persistencia

### 1. ¿Están las dependencias encapsuladas?
**Sí, totalmente.** Todas las herramientas de compilación de código, librerías del backend (Express, SQLite3) y frontend (React, Vite, compiladores CSS) están empaquetadas de forma aislada **dentro de la imagen Docker**. 
*   No necesitas instalar Node.js ni SQLite en tu computadora.
*   El contenedor corre sobre una imagen ligera Debian-slim para garantizar la compatibilidad perfecta con los binarios de SQLite y evitar conflictos de arquitectura.
*   Las variables de configuración básicas se manejan mediante variables de entorno en el contenedor (`PORT`, `DATABASE_PATH`).

### 2. Si elimino el contenedor, ¿sigue existiendo la persistencia?
**Sí.** En [docker-compose.yml](docker-compose.yml) definimos un volumen con nombre (`grimorio-db-vol`) mapeado al directorio `/data` dentro del contenedor (donde reside el archivo `grimorio.db` de SQLite).
*   Los volúmenes con nombre de Docker son independientes del ciclo de vida del contenedor.
*   Si destruyes o eliminas el contenedor con `docker rm` o `docker compose down`, el volumen **no se elimina** y los datos se conservarán en el disco de tu máquina host.
*   *Nota*: Para eliminar el contenedor **junto con todos sus datos**, debes ejecutar explícitamente: `docker compose down -v`.

---

## 🚀 Guía de Uso y Comandos

### Levantando el Contenedor por Primera Vez
Para descargar imágenes base, compilar el frontend, instalar dependencias internas y levantar la aplicación:
```bash
docker compose up -d --build
```
*(El flag `-d` inicia el contenedor en segundo plano, liberando tu terminal).*

### Detener el Contenedor
Para pausar los servicios y liberar los puertos sin borrar los datos:
```bash
docker compose down
```

### Volver a Encender el Contenedor
Si ya hiciste `docker compose down` previamente y deseas encender el grimorio de nuevo (sin tener que volver a compilar el código):
```bash
docker compose up -d
```

### Ver Logs del Servidor
Para monitorear las conexiones y llamadas que hace la aplicación al backend en tiempo real:
```bash
docker compose logs -f
```

---

## 🎮 Funcionalidades del Grimorio

1.  **Invocación de Tareas**: Formulario temático para crear tareas asignándoles un Título (requerido), Descripción (opcional), Prioridad (*Banal 🪵*, *Grave 🔮*, o *Mortal 💀*) y una Fecha Límite ("Hora del Juicio").
2.  **Cementerio de Tareas (Sepultar/Revivir)**: Las tareas completadas se marcan con una "X" en tinta roja y se trasladan automáticamente al final del grimorio para no obstruir las tareas activas.
3.  **Filtros de Reino**: Navegación rápida entre:
    *   *Todas*: El Grimorio completo.
    *   *Vivas*: Tareas pendientes por resolver.
    *   *Sepultadas*: Historial de tareas completadas.
4.  **Acciones en Lote (Desterrar)**: Selección múltiple de tareas mediante checkboxes de círculo morado. Al seleccionar una o más, aparecerá una barra inferior flotante que permite "Desterrar" (borrar permanentemente) las almas seleccionadas del grimorio a la vez.
5.  **Animación de Atmósfera**: La aplicación cuenta con una viñeta oscura en pantalla y una micro-animación de parpadeo de vela en los títulos, reforzando la inmersión gótica.

---

## 📂 Documentación del Ciclo SDD

Los artefactos de diseño, control de progreso y cierre de este desarrollo se encuentran guardados en el repositorio:
*   **[Plan de Implementación](docs/implementation_plan.md)**: Especificación de la base de datos, APIs, estructura del proyecto y diseño visual.
*   **[Lista de Tareas (Tasklist)](docs/task.md)**: Registro del paso a paso de las tareas y fases completadas.
*   **[Guía de Cierre (Walkthrough)](docs/walkthrough.md)**: Resumen del desarrollo final e integración de componentes.
