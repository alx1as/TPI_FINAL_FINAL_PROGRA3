
# Frontend - TPI Programación III - Food Store

Este frontend corresponde al Trabajo Práctico Integrador de Programación III.  
Implementa la interfaz web del sistema Food Store, diferenciando funcionalidades para cliente y administrador.

## Tecnologías utilizadas

- HTML
- CSS
- TypeScript
- Vite
- LocalStorage
- Archivos JSON como fuente de datos inicial

## Funcionalidades principales

### Autenticación

- Login de usuarios.
- Persistencia de sesión.
- Diferenciación de roles:
  - Administrador
  - Cliente

### Cliente

- Visualización de catálogo.
- Búsqueda de productos.
- Filtros y ordenamiento.
- Detalle de producto.
- Carrito con persistencia en `localStorage`.
- Historial de pedidos.

### Administración

- Dashboard con estadísticas.
- Gestión visual de categorías.
- Gestión visual de productos.
- Visualización y administración de pedidos.

## Estructura general

- `src/pages`: pantallas principales del sistema.
- `src/pages/admin`: vistas del administrador.
- `src/pages/client`: vistas del cliente.
- `src/pages/auth`: login y registro.
- `src/types`: tipos utilizados en TypeScript.
- `src/utils`: funciones auxiliares.
- `public/data`: archivos JSON utilizados como datos iniciales.

## Ejecución

Desde la carpeta `frontend`:

```bash
npm install
npm run dev