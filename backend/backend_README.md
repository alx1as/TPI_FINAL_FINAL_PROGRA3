# Backend - TPI Programación III - Food Store

Este backend corresponde al Trabajo Práctico Integrador de Programación III.  
Implementa la lógica principal del sistema Food Store mediante Java, JPA/Hibernate y menú por consola.

## Tecnologías utilizadas

- Java
- Gradle
- JPA / Hibernate
- H2 Database
- Lombok

## Funcionalidades principales

- Gestión de categorías.
- Gestión de productos.
- Gestión de usuarios.
- Gestión de pedidos.
- Validaciones básicas de negocio.
- Control de stock.
- Cálculo de totales.
- Baja lógica.
- Consultas JPQL.
- Repositorios genéricos mediante `BaseRepository`.

## Estructura general

- `src/main/java`: código fuente del backend.
- `entities`: entidades JPA del modelo.
- `repositories`: clases encargadas de la persistencia.
- `services`: lógica de negocio.
- `enums`: estados y tipos utilizados por el sistema.
- `main/app`: punto de entrada de la aplicación por consola.

## Ejecución

Desde la carpeta `backend`:

```bash
./gradlew run