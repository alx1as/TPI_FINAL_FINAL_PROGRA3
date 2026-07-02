FRONTEND - FOOD STORE

Instalación limpia:
1) Abrir terminal dentro de la carpeta frontend.
2) Ejecutar:

   npm install
   npm run dev

Si npm quedó trabado por una instalación anterior, limpiar primero:

   rm -rf node_modules package-lock.json
   npm cache verify
   npm install
   npm run dev

Usuarios de prueba:
- Admin: admin@foodstore.com / 1234
- Cliente: juan@foodstore.com / 1234

Notas funcionales:
- El frontend usa TypeScript + Vite y consume JSON locales desde public/data.
- El carrito se guarda en localStorage.
- El checkout solicita teléfono, dirección y forma de pago.
- Los pedidos generados se guardan en localStorage y aparecen en Mis pedidos y en el panel de administración.
- El panel admin prioriza Pedidos y permite gestionar Productos/Categorías desde una misma sección.
