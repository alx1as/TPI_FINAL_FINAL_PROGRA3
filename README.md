RUBIN ALEXIA - TPI PROGRAMACIÓN 3 - FOOD STORE

Proyecto dividido en dos partes independientes:

1. FRONTEND
- TypeScript + Vite + HTML + CSS.
- Consume datos desde archivos JSON locales ubicados en frontend/public/data.
- Incluye login, roles, catálogo, búsqueda, filtros, ordenamiento, detalle, carrito, checkout, historial de pedidos y panel de administración.
- El checkout solicita teléfono, dirección y forma de pago.
- Los pedidos nuevos se guardan en localStorage y pueden verse desde Mis pedidos y desde el panel admin.

Para correr el frontend:

cd frontend
npm install
npm run dev

Si npm quedó con una instalación rota:

rm -rf node_modules package-lock.json
npm cache verify
npm install
npm run dev

2. BACKEND
- Java + JPA/Hibernate + H2.
- Menú de consola.
- Entidades: Base, Categoria, Producto, Usuario, Pedido y DetallePedido.
- Repositorios con consultas JPQL.
- CRUD, baja lógica, validaciones, pedidos, stock y totales.

Para correr el backend:

cd backend
./gradlew run

Usuarios de prueba frontend:
- Admin: admin@foodstore.com / 1234
- Cliente: juan@foodstore.com / 1234
