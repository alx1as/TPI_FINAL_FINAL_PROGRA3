# TPI Programación III - Backend Food Store

Alumna: Rubin, Alexia

Aplicación Java de consola desarrollada con Gradle, JPA, Hibernate y base de datos H2 en archivo.

## Funcionalidades implementadas

- Entidades JPA: Base, Categoria, Producto, Usuario, Pedido y DetallePedido.
- Enumerados: Rol, Estado y FormaPago.
- Repositorio genérico `BaseRepository<T>` con guardar, buscar por ID, listar activos y baja lógica.
- Repositorios específicos:
  - `CategoriaRepository`: productos por categoría con JPQL.
  - `ProductoRepository`.
  - `UsuarioRepository`: búsqueda por mail y pedidos por usuario.
  - `PedidoRepository`: pedidos por usuario y por estado.
- Menú de consola para gestionar:
  - Categorías.
  - Productos.
  - Usuarios.
  - Pedidos.
  - Reportes.
- Alta de pedido con una única transacción: valida usuario, productos, disponibilidad y stock; crea detalles, calcula subtotales, calcula total y descuenta stock.
- Baja lógica mediante el campo `eliminado`.

## Cómo compilar

```bash
./gradlew clean build
```

## Cómo ejecutar

```bash
./gradlew run
```

## Base de datos

La base H2 se almacena en:

```text
data/jpa_db
```

Hibernate está configurado con `hbm2ddl.auto=update`.
