import com.tup.programacion3.entities.Categoria;
import com.tup.programacion3.entities.DetallePedido;
import com.tup.programacion3.entities.Pedido;
import com.tup.programacion3.entities.Producto;
import com.tup.programacion3.entities.Usuario;
import com.tup.programacion3.enums.Estado;
import com.tup.programacion3.enums.FormaPago;
import com.tup.programacion3.enums.Rol;
import com.tup.programacion3.repository.CategoriaRepository;
import com.tup.programacion3.repository.PedidoRepository;
import com.tup.programacion3.repository.ProductoRepository;
import com.tup.programacion3.repository.UsuarioRepository;
import com.tup.programacion3.util.JPAUtil;

import jakarta.persistence.EntityManager;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;
import java.util.Scanner;
import java.util.logging.Level;
import java.util.logging.Logger;

public class Main {

    static {
        Locale.setDefault(Locale.US);
        System.setProperty("org.jboss.logging.provider", "jdk");
        Logger.getLogger("org.hibernate").setLevel(Level.SEVERE);
        Logger.getLogger("org.hibernate.SQL").setLevel(Level.SEVERE);
    }

    private static final Scanner scanner = new Scanner(System.in);

    private static final CategoriaRepository categoriaRepository = new CategoriaRepository();
    private static final ProductoRepository productoRepository = new ProductoRepository();
    private static final UsuarioRepository usuarioRepository = new UsuarioRepository();
    private static final PedidoRepository pedidoRepository = new PedidoRepository();

    private static final String LINEA = "------------------------------------------------------------";

    private static final String RESET = "\u001B[0m";
    private static final String VERDE = "\u001B[32m";
    private static final String ROJO = "\u001B[31m";
    private static final String AMARILLO = "\u001B[33m";
    private static final String CYAN = "\u001B[36m";
    private static final String NEGRITA = "\u001B[1m";

    public static void main(String[] args) {
        int opcion;

        do {
            mostrarMenuPrincipal();
            opcion = leerOpcionMenu("Seleccione una opcion: ");

            switch (opcion) {
                case 1 -> menuCategorias();
                case 2 -> menuProductos();
                case 3 -> menuUsuarios();
                case 4 -> menuPedidos();
                case 5 -> menuReportes();
                case 0 -> System.out.println(VERDE + "\nSistema finalizado correctamente." + RESET);
                default -> {
                    mostrarError("Opcion invalida. Intente nuevamente.");
                    pausar();
                }
            }

        } while (opcion != 0);

        scanner.close();
        JPAUtil.cerrar();
    }

    private static void mostrarMenuPrincipal() {
        System.out.println("\n+==========================================================+");
        System.out.println("|             Food Store - Gestion de Pedidos              |");
        System.out.println("+==========================================================+");
        System.out.println(CYAN + NEGRITA + "==================== MENU PRINCIPAL ====================" + RESET);
        System.out.println("1. Gestion de categorias");
        System.out.println("2. Gestion de productos");
        System.out.println("3. Gestion de usuarios");
        System.out.println("4. Gestion de pedidos");
        System.out.println("5. Reportes");
        System.out.println("0. Salir");
        System.out.println(LINEA);
    }

    private static void menuCategorias() {
        int opcion;

        do {
            System.out.println("\n" + CYAN + NEGRITA + "================ SUBMENU: CATEGORIAS ================" + RESET);
            System.out.println("1. Alta de categoria");
            System.out.println("2. Modificar categoria");
            System.out.println("3. Baja logica de categoria");
            System.out.println("4. Listar categorias activas");
            System.out.println("0. Volver al menu principal");
            System.out.println(LINEA);

            opcion = leerOpcionMenu("Opcion: ");

            switch (opcion) {
                case 1 -> ejecutarOperacion(Main::altaCategoria);
                case 2 -> ejecutarOperacion(Main::modificarCategoria);
                case 3 -> ejecutarOperacion(Main::bajaCategoria);
                case 4 -> ejecutarOperacion(Main::listarCategoriasActivasConPausa);
                case 0 -> System.out.println(AMARILLO + "\nVolviendo al menu principal..." + RESET);
                default -> {
                    mostrarError("Opcion invalida. Intente nuevamente.");
                    pausar();
                }
            }
        } while (opcion != 0);
    }

    private static void menuProductos() {
        int opcion;

        do {
            System.out.println("\n" + CYAN + NEGRITA + "================ SUBMENU: PRODUCTOS =================" + RESET);
            System.out.println("1. Alta de producto");
            System.out.println("2. Modificar producto");
            System.out.println("3. Baja logica de producto");
            System.out.println("4. Listar productos activos");
            System.out.println("0. Volver al menu principal");
            System.out.println(LINEA);

            opcion = leerOpcionMenu("Opcion: ");

            switch (opcion) {
                case 1 -> ejecutarOperacion(Main::altaProducto);
                case 2 -> ejecutarOperacion(Main::modificarProducto);
                case 3 -> ejecutarOperacion(Main::bajaProducto);
                case 4 -> ejecutarOperacion(Main::listarProductosActivosConPausa);
                case 0 -> System.out.println(AMARILLO + "\nVolviendo al menu principal..." + RESET);
                default -> {
                    mostrarError("Opcion invalida. Intente nuevamente.");
                    pausar();
                }
            }
        } while (opcion != 0);
    }

    private static void menuUsuarios() {
        int opcion;

        do {
            System.out.println("\n" + CYAN + NEGRITA + "================= SUBMENU: USUARIOS =================" + RESET);
            System.out.println("1. Alta de usuario");
            System.out.println("2. Modificar usuario");
            System.out.println("3. Baja logica de usuario");
            System.out.println("4. Listar usuarios activos");
            System.out.println("5. Buscar usuario por mail");
            System.out.println("0. Volver al menu principal");
            System.out.println(LINEA);

            opcion = leerOpcionMenu("Opcion: ");

            switch (opcion) {
                case 1 -> ejecutarOperacion(Main::altaUsuario);
                case 2 -> ejecutarOperacion(Main::modificarUsuario);
                case 3 -> ejecutarOperacion(Main::bajaUsuario);
                case 4 -> ejecutarOperacion(Main::listarUsuariosActivosConPausa);
                case 5 -> ejecutarOperacion(Main::buscarUsuarioPorMail);
                case 0 -> System.out.println(AMARILLO + "\nVolviendo al menu principal..." + RESET);
                default -> {
                    mostrarError("Opcion invalida. Intente nuevamente.");
                    pausar();
                }
            }
        } while (opcion != 0);
    }

    private static void menuPedidos() {
        int opcion;

        do {
            System.out.println("\n" + CYAN + NEGRITA + "================= SUBMENU: PEDIDOS ==================" + RESET);
            System.out.println("1. Alta de pedido");
            System.out.println("2. Cambiar estado de pedido");
            System.out.println("3. Baja logica de pedido");
            System.out.println("4. Listar pedidos activos");
            System.out.println("5. Pedidos por usuario");
            System.out.println("6. Pedidos por estado");
            System.out.println("0. Volver al menu principal");
            System.out.println(LINEA);

            opcion = leerOpcionMenu("Opcion: ");

            switch (opcion) {
                case 1 -> ejecutarOperacion(Main::altaPedido);
                case 2 -> ejecutarOperacion(Main::cambiarEstadoPedido);
                case 3 -> ejecutarOperacion(Main::bajaPedido);
                case 4 -> ejecutarOperacion(Main::listarPedidosActivosConPausa);
                case 5 -> ejecutarOperacion(Main::pedidosPorUsuario);
                case 6 -> ejecutarOperacion(Main::pedidosPorEstado);
                case 0 -> System.out.println(AMARILLO + "\nVolviendo al menu principal..." + RESET);
                default -> {
                    mostrarError("Opcion invalida. Intente nuevamente.");
                    pausar();
                }
            }
        } while (opcion != 0);
    }

    private static void menuReportes() {
        int opcion;

        do {
            System.out.println("\n" + CYAN + NEGRITA + "================ SUBMENU: REPORTES ==================" + RESET);
            System.out.println("1. Productos por categoria (JPQL)");
            System.out.println("2. Pedidos por usuario (JPQL)");
            System.out.println("3. Pedidos por estado (JPQL)");
            System.out.println("4. Total facturado");
            System.out.println("0. Volver al menu principal");
            System.out.println(LINEA);

            opcion = leerOpcionMenu("Opcion: ");

            switch (opcion) {
                case 1 -> ejecutarOperacion(Main::productosPorCategoria);
                case 2 -> ejecutarOperacion(Main::pedidosPorUsuarioReporte);
                case 3 -> ejecutarOperacion(Main::pedidosPorEstado);
                case 4 -> ejecutarOperacion(Main::totalFacturado);
                case 0 -> System.out.println(AMARILLO + "\nVolviendo al menu principal..." + RESET);
                default -> {
                    mostrarError("Opcion invalida. Intente nuevamente.");
                    pausar();
                }
            }
        } while (opcion != 0);
    }

    private static void altaCategoria() {
        mostrarTituloOperacion("Alta de categoria");

        String nombre = leerTextoCancelable("Nombre");
        if (nombre.isBlank()) {
            mostrarError("El nombre de la categoria no puede estar vacio.");
            pausar();
            return;
        }

        String descripcion = leerTextoCancelable("Descripcion opcional");

        Categoria categoria = Categoria.builder()
                .eliminado(false)
                .createdAt(LocalDateTime.now())
                .nombre(nombre)
                .descripcion(descripcion)
                .build();

        Categoria categoriaGuardada = categoriaRepository.guardar(categoria);

        mostrarExito("Categoria guardada correctamente.");
        System.out.println("ID generado: " + categoriaGuardada.getId());
        System.out.println("Nombre: " + categoriaGuardada.getNombre());
        pausar();
    }

    private static void modificarCategoria() {
        mostrarTituloOperacion("Modificar categoria");

        List<Categoria> categorias = categoriaRepository.listarActivos();
        if (categorias.isEmpty()) {
            mostrarAdvertencia("No hay categorias activas para modificar.");
            pausar();
            return;
        }

        mostrarTablaCategorias(categorias);
        Long id = leerLongCancelable("Ingrese el ID de la categoria a modificar");
        Optional<Categoria> categoriaOptional = buscarCategoriaActiva(id);

        if (categoriaOptional.isEmpty()) {
            mostrarError("No existe una categoria activa con ese ID.");
            pausar();
            return;
        }

        Categoria categoria = categoriaOptional.get();
        System.out.println("\nValores actuales:");
        System.out.println("Nombre actual: " + mostrarTexto(categoria.getNombre()));
        System.out.println("Descripcion actual: " + mostrarTexto(categoria.getDescripcion()));
        System.out.println(AMARILLO + "\nDeje un campo vacio para conservar el valor anterior." + RESET);

        String nuevoNombre = leerTextoOpcionalCancelable("Nuevo nombre");
        String nuevaDescripcion = leerTextoOpcionalCancelable("Nueva descripcion");

        if (!nuevoNombre.isBlank()) categoria.setNombre(nuevoNombre);
        if (!nuevaDescripcion.isBlank()) categoria.setDescripcion(nuevaDescripcion);

        categoriaRepository.guardar(categoria);
        mostrarExito("Categoria modificada correctamente.");
        pausar();
    }

    private static void bajaCategoria() {
        mostrarTituloOperacion("Baja logica de categoria");

        List<Categoria> categorias = categoriaRepository.listarActivos();
        if (categorias.isEmpty()) {
            mostrarAdvertencia("No hay categorias activas para dar de baja.");
            pausar();
            return;
        }

        mostrarTablaCategorias(categorias);
        Long id = leerLongCancelable("Ingrese el ID de la categoria a dar de baja");
        Optional<Categoria> categoriaOptional = buscarCategoriaActiva(id);

        if (categoriaOptional.isEmpty()) {
            mostrarError("No existe una categoria activa con ese ID.");
            pausar();
            return;
        }

        String nombreCategoria = categoriaOptional.get().getNombre();
        boolean eliminada = categoriaRepository.eliminarLogico(id);

        if (eliminada) {
            mostrarExito("Categoria dada de baja correctamente.");
            System.out.println("Categoria afectada: " + nombreCategoria);
        } else {
            mostrarError("No se pudo dar de baja la categoria.");
        }
        pausar();
    }

    private static void listarCategoriasActivasConPausa() {
        mostrarTituloOperacion("Categorias activas");
        List<Categoria> categorias = categoriaRepository.listarActivos();
        if (categorias.isEmpty()) mostrarAdvertencia("No hay categorias activas registradas.");
        else mostrarTablaCategorias(categorias);
        pausar();
    }

    private static void altaProducto() {
        mostrarTituloOperacion("Alta de producto");

        List<Categoria> categorias = categoriaRepository.listarActivos();
        if (categorias.isEmpty()) {
            mostrarAdvertencia("Debe cargar al menos una categoria activa antes de crear productos.");
            pausar();
            return;
        }

        mostrarTablaCategorias(categorias);
        Long categoriaId = leerLongCancelable("Ingrese el ID de la categoria");
        Optional<Categoria> categoriaOptional = buscarCategoriaActiva(categoriaId);
        if (categoriaOptional.isEmpty()) {
            mostrarError("No existe una categoria activa con ese ID.");
            pausar();
            return;
        }

        String nombre = leerTextoCancelable("Nombre");
        if (nombre.isBlank()) {
            mostrarError("El nombre del producto no puede estar vacio.");
            pausar();
            return;
        }

        String descripcion = leerTextoCancelable("Descripcion opcional");
        Double precio = leerDoubleCancelable("Precio");
        if (precio <= 0) {
            mostrarError("El precio debe ser mayor a 0.");
            pausar();
            return;
        }

        Integer stock = leerIntCancelable("Stock");
        if (stock < 0) {
            mostrarError("El stock no puede ser negativo.");
            pausar();
            return;
        }

        String imagen = leerTextoCancelable("Imagen opcional");
        Boolean disponible = leerBooleanSNConDefault("Disponible S/N", true);

        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        Producto productoGuardado;

        try {
            em.getTransaction().begin();

            Categoria categoriaGestionada = em.find(Categoria.class, categoriaId);
            if (categoriaGestionada == null || categoriaGestionada.isEliminado()) {
                throw new IllegalArgumentException("No existe una categoria activa con ese ID.");
            }

            productoGuardado = Producto.builder()
                    .eliminado(false)
                    .createdAt(LocalDateTime.now())
                    .nombre(nombre)
                    .descripcion(descripcion)
                    .precio(precio)
                    .stock(stock)
                    .imagen(imagen)
                    .disponible(disponible)
                    .categoria(categoriaGestionada)
                    .build();

            em.persist(productoGuardado);
            em.getTransaction().commit();
        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            mostrarError("No se pudo guardar el producto: " + e.getMessage());
            pausar();
            return;
        } finally {
            em.close();
        }

        mostrarExito("Producto guardado correctamente.");
        System.out.println("ID generado: " + productoGuardado.getId());
        System.out.println("Categoria asignada: " + categoriaOptional.get().getNombre());
        pausar();
    }

    private static void modificarProducto() {
        mostrarTituloOperacion("Modificar producto");

        List<Producto> productos = productoRepository.listarActivos();
        if (productos.isEmpty()) {
            mostrarAdvertencia("No hay productos activos para modificar.");
            pausar();
            return;
        }

        mostrarTablaProductos(productos);
        Long id = leerLongCancelable("Ingrese el ID del producto a modificar");
        Optional<Producto> productoOptional = buscarProductoActivo(id);

        if (productoOptional.isEmpty()) {
            mostrarError("No existe un producto activo con ese ID.");
            pausar();
            return;
        }

        Producto producto = productoOptional.get();
        System.out.println("\nValores actuales:");
        System.out.println("Nombre: " + mostrarTexto(producto.getNombre()));
        System.out.println("Descripcion: " + mostrarTexto(producto.getDescripcion()));
        System.out.println("Precio: " + formatearDinero(producto.getPrecio()));
        System.out.println("Stock: " + producto.getStock());
        System.out.println("Imagen: " + mostrarTexto(producto.getImagen()));
        System.out.println("Disponible: " + mostrarDisponible(producto.getDisponible()));
        System.out.println(AMARILLO + "\nDeje un campo vacio para conservar el valor anterior." + RESET);

        String nuevoNombre = leerTextoOpcionalCancelable("Nuevo nombre");
        String nuevaDescripcion = leerTextoOpcionalCancelable("Nueva descripcion");
        String nuevoPrecioTexto = leerTextoOpcionalCancelable("Nuevo precio");
        String nuevoStockTexto = leerTextoOpcionalCancelable("Nuevo stock");
        String nuevaImagen = leerTextoOpcionalCancelable("Nueva imagen");
        String disponibleTexto = leerTextoOpcionalCancelable("Disponible S/N");

        if (!nuevoNombre.isBlank()) producto.setNombre(nuevoNombre);
        if (!nuevaDescripcion.isBlank()) producto.setDescripcion(nuevaDescripcion);
        if (!nuevoPrecioTexto.isBlank()) {
            Double nuevoPrecio = parsearDouble(nuevoPrecioTexto);
            if (nuevoPrecio <= 0) {
                mostrarError("El precio debe ser mayor a 0.");
                pausar();
                return;
            }
            producto.setPrecio(nuevoPrecio);
        }
        if (!nuevoStockTexto.isBlank()) {
            Integer nuevoStock = parsearInt(nuevoStockTexto);
            if (nuevoStock < 0) {
                mostrarError("El stock no puede ser negativo.");
                pausar();
                return;
            }
            producto.setStock(nuevoStock);
        }
        if (!nuevaImagen.isBlank()) producto.setImagen(nuevaImagen);
        if (!disponibleTexto.isBlank()) producto.setDisponible(parsearBooleanSN(disponibleTexto));

        productoRepository.guardar(producto);
        mostrarExito("Producto modificado correctamente.");
        pausar();
    }

    private static void bajaProducto() {
        mostrarTituloOperacion("Baja logica de producto");

        List<Producto> productos = productoRepository.listarActivos();
        if (productos.isEmpty()) {
            mostrarAdvertencia("No hay productos activos para dar de baja.");
            pausar();
            return;
        }

        mostrarTablaProductos(productos);
        Long id = leerLongCancelable("Ingrese el ID del producto a dar de baja");
        Optional<Producto> productoOptional = buscarProductoActivo(id);
        if (productoOptional.isEmpty()) {
            mostrarError("No existe un producto activo con ese ID.");
            pausar();
            return;
        }

        String nombreProducto = productoOptional.get().getNombre();
        boolean eliminado = productoRepository.eliminarLogico(id);

        if (eliminado) {
            mostrarExito("Producto dado de baja correctamente.");
            System.out.println("Producto afectado: " + nombreProducto);
        } else {
            mostrarError("No se pudo dar de baja el producto.");
        }
        pausar();
    }

    private static void listarProductosActivosConPausa() {
        mostrarTituloOperacion("Productos activos");
        List<Producto> productos = productoRepository.listarActivos();
        if (productos.isEmpty()) mostrarAdvertencia("No hay productos activos registrados.");
        else mostrarTablaProductos(productos);
        pausar();
    }

    private static void altaUsuario() {
        mostrarTituloOperacion("Alta de usuario");

        String nombre = leerTextoCancelable("Nombre");
        String apellido = leerTextoCancelable("Apellido");
        String email = leerTextoCancelable("Mail");
        String celular = leerTextoCancelable("Celular opcional");
        String contrasenia = leerTextoCancelable("Contrasenia");
        Rol rol = leerEnumCancelable("Rol", Rol.values());

        if (nombre.isBlank() || apellido.isBlank() || email.isBlank() || contrasenia.isBlank()) {
            mostrarError("Nombre, apellido, mail y contrasenia son obligatorios.");
            pausar();
            return;
        }

        if (usuarioRepository.buscarPorMail(email).isPresent()) {
            mostrarError("Ya existe un usuario activo con ese mail.");
            pausar();
            return;
        }

        Usuario usuario = Usuario.builder()
                .eliminado(false)
                .createdAt(LocalDateTime.now())
                .nombre(nombre)
                .apellido(apellido)
                .email(email)
                .celular(celular)
                .contrasenia(contrasenia)
                .rol(rol)
                .build();

        Usuario usuarioGuardado = usuarioRepository.guardar(usuario);
        mostrarExito("Usuario guardado correctamente.");
        System.out.println("ID generado: " + usuarioGuardado.getId());
        pausar();
    }

    private static void modificarUsuario() {
        mostrarTituloOperacion("Modificar usuario");

        List<Usuario> usuarios = usuarioRepository.listarActivos();
        if (usuarios.isEmpty()) {
            mostrarAdvertencia("No hay usuarios activos para modificar.");
            pausar();
            return;
        }

        mostrarTablaUsuarios(usuarios);
        Long id = leerLongCancelable("Ingrese el ID del usuario a modificar");
        Optional<Usuario> usuarioOptional = buscarUsuarioActivo(id);

        if (usuarioOptional.isEmpty()) {
            mostrarError("No existe un usuario activo con ese ID.");
            pausar();
            return;
        }

        Usuario usuario = usuarioOptional.get();
        System.out.println("\nValores actuales:");
        System.out.println("Nombre: " + mostrarTexto(usuario.getNombre()));
        System.out.println("Apellido: " + mostrarTexto(usuario.getApellido()));
        System.out.println("Mail: " + mostrarTexto(usuario.getEmail()));
        System.out.println("Celular: " + mostrarTexto(usuario.getCelular()));
        System.out.println("Rol: " + usuario.getRol());
        System.out.println(AMARILLO + "\nDeje un campo vacio para conservar el valor anterior." + RESET);

        String nuevoNombre = leerTextoOpcionalCancelable("Nuevo nombre");
        String nuevoApellido = leerTextoOpcionalCancelable("Nuevo apellido");
        String nuevoEmail = leerTextoOpcionalCancelable("Nuevo mail");
        String nuevoCelular = leerTextoOpcionalCancelable("Nuevo celular");
        String nuevaContrasenia = leerTextoOpcionalCancelable("Nueva contrasenia");

        if (!nuevoEmail.isBlank()) {
            Optional<Usuario> usuarioConMail = usuarioRepository.buscarPorMail(nuevoEmail);
            if (usuarioConMail.isPresent() && !usuarioConMail.get().getId().equals(usuario.getId())) {
                mostrarError("El mail ingresado ya pertenece a otro usuario activo.");
                pausar();
                return;
            }
            usuario.setEmail(nuevoEmail);
        }

        if (!nuevoNombre.isBlank()) usuario.setNombre(nuevoNombre);
        if (!nuevoApellido.isBlank()) usuario.setApellido(nuevoApellido);
        if (!nuevoCelular.isBlank()) usuario.setCelular(nuevoCelular);
        if (!nuevaContrasenia.isBlank()) usuario.setContrasenia(nuevaContrasenia);

        usuarioRepository.guardar(usuario);
        mostrarExito("Usuario modificado correctamente.");
        pausar();
    }

    private static void bajaUsuario() {
        mostrarTituloOperacion("Baja logica de usuario");

        List<Usuario> usuarios = usuarioRepository.listarActivos();
        if (usuarios.isEmpty()) {
            mostrarAdvertencia("No hay usuarios activos para dar de baja.");
            pausar();
            return;
        }

        mostrarTablaUsuarios(usuarios);
        Long id = leerLongCancelable("Ingrese el ID del usuario a dar de baja");
        Optional<Usuario> usuarioOptional = buscarUsuarioActivo(id);
        if (usuarioOptional.isEmpty()) {
            mostrarError("No existe un usuario activo con ese ID.");
            pausar();
            return;
        }

        Usuario usuario = usuarioOptional.get();
        boolean eliminado = usuarioRepository.eliminarLogico(id);

        if (eliminado) {
            mostrarExito("Usuario dado de baja correctamente.");
            System.out.println("Usuario afectado: " + usuario.getNombre() + " " + usuario.getApellido());
        } else {
            mostrarError("No se pudo dar de baja el usuario.");
        }
        pausar();
    }

    private static void listarUsuariosActivosConPausa() {
        mostrarTituloOperacion("Usuarios activos");
        List<Usuario> usuarios = usuarioRepository.listarActivos();
        if (usuarios.isEmpty()) mostrarAdvertencia("No hay usuarios activos registrados.");
        else mostrarTablaUsuarios(usuarios);
        pausar();
    }

    private static void buscarUsuarioPorMail() {
        mostrarTituloOperacion("Buscar usuario por mail");
        String email = leerTextoCancelable("Mail");
        Optional<Usuario> usuarioOptional = usuarioRepository.buscarPorMail(email);

        if (usuarioOptional.isEmpty()) {
            mostrarAdvertencia("No existe un usuario activo con ese mail.");
        } else {
            Usuario usuario = usuarioOptional.get();
            System.out.println("ID: " + usuario.getId());
            System.out.println("Nombre: " + usuario.getNombre() + " " + usuario.getApellido());
            System.out.println("Mail: " + usuario.getEmail());
            System.out.println("Celular: " + mostrarTexto(usuario.getCelular()));
            System.out.println("Rol: " + usuario.getRol());
        }
        pausar();
    }

    private static void altaPedido() {
        mostrarTituloOperacion("Alta de pedido");

        List<Usuario> usuarios = usuarioRepository.listarActivos();
        if (usuarios.isEmpty()) {
            mostrarAdvertencia("Debe cargar al menos un usuario activo antes de crear pedidos.");
            pausar();
            return;
        }

        mostrarTablaUsuarios(usuarios);
        Long usuarioId = leerLongCancelable("Ingrese el ID del usuario");
        if (buscarUsuarioActivo(usuarioId).isEmpty()) {
            mostrarError("No existe un usuario activo con ese ID.");
            pausar();
            return;
        }

        FormaPago formaPago = leerEnumCancelable("Forma de pago", FormaPago.values());
        Map<Long, Integer> productosSeleccionados = seleccionarProductosParaPedido();

        if (productosSeleccionados.isEmpty()) {
            mostrarAdvertencia("El pedido debe tener al menos un producto.");
            pausar();
            return;
        }

        EntityManager em = JPAUtil.getEntityManagerFactory().createEntityManager();
        Pedido pedido;

        try {
            em.getTransaction().begin();

            Usuario usuarioGestionado = em.find(Usuario.class, usuarioId);
            if (usuarioGestionado == null || usuarioGestionado.isEliminado()) {
                throw new IllegalArgumentException("Usuario inexistente o dado de baja.");
            }

            pedido = Pedido.builder()
                    .eliminado(false)
                    .createdAt(LocalDateTime.now())
                    .fecha(LocalDate.now())
                    .estado(Estado.PENDIENTE)
                    .formaPago(formaPago)
                    .total(0.0)
                    .usuario(usuarioGestionado)
                    .build();

            for (Map.Entry<Long, Integer> item : productosSeleccionados.entrySet()) {
                Long productoId = item.getKey();
                int cantidad = item.getValue();
                Producto productoGestionado = em.find(Producto.class, productoId);

                if (productoGestionado == null || productoGestionado.isEliminado()) {
                    throw new IllegalArgumentException("Producto inexistente o dado de baja.");
                }
                if (!Boolean.TRUE.equals(productoGestionado.getDisponible())) {
                    throw new IllegalArgumentException("El producto no esta disponible: " + productoGestionado.getNombre());
                }
                if (productoGestionado.getStock() < cantidad) {
                    throw new IllegalArgumentException("Stock insuficiente para: " + productoGestionado.getNombre());
                }

                pedido.addDetallePedido(cantidad, productoGestionado);
                productoGestionado.setStock(productoGestionado.getStock() - cantidad);
            }

            pedido.calcularTotal();
            em.persist(pedido);
            em.getTransaction().commit();

        } catch (Exception e) {
            if (em.getTransaction().isActive()) {
                em.getTransaction().rollback();
            }
            mostrarError("No se pudo guardar el pedido: " + e.getMessage());
            pausar();
            return;
        } finally {
            em.close();
        }

        mostrarExito("Pedido guardado correctamente.");
        mostrarDetallePedido(pedido);
        pausar();
    }

    private static Map<Long, Integer> seleccionarProductosParaPedido() {
        Map<Long, Integer> productosSeleccionados = new LinkedHashMap<>();
        boolean continuar;

        do {
            List<Producto> productos = productoRepository.listarActivos();
            List<Producto> disponibles = productos.stream()
                    .filter(p -> Boolean.TRUE.equals(p.getDisponible()))
                    .filter(p -> p.getStock() != null && p.getStock() > 0)
                    .toList();

            if (disponibles.isEmpty()) {
                mostrarAdvertencia("No hay productos activos con stock disponible.");
                return productosSeleccionados;
            }

            mostrarTablaProductos(disponibles);
            Long productoId = leerLongCancelable("Ingrese el ID del producto");
            Optional<Producto> productoOptional = disponibles.stream()
                    .filter(producto -> producto.getId().equals(productoId))
                    .findFirst();

            if (productoOptional.isEmpty()) {
                mostrarError("No existe un producto activo y disponible con ese ID.");
            } else {
                Producto producto = productoOptional.get();
                int cantidadActual = productosSeleccionados.getOrDefault(productoId, 0);
                int cantidad = leerIntCancelable("Cantidad");

                if (cantidad <= 0) {
                    mostrarError("La cantidad debe ser mayor a 0.");
                } else if (cantidadActual + cantidad > producto.getStock()) {
                    mostrarError("Stock insuficiente. Disponible: " + producto.getStock());
                } else {
                    productosSeleccionados.put(productoId, cantidadActual + cantidad);
                    mostrarExito("Producto agregado al pedido temporal.");
                }
            }

            continuar = leerBooleanSNConDefault("Desea agregar otro producto S/N", false);
        } while (continuar);

        return productosSeleccionados;
    }

    private static void cambiarEstadoPedido() {
        mostrarTituloOperacion("Cambiar estado de pedido");
        listarPedidosActivosSinPausa();
        Long id = leerLongCancelable("Ingrese el ID del pedido");
        Optional<Pedido> pedidoOptional = buscarPedidoActivo(id);

        if (pedidoOptional.isEmpty()) {
            mostrarError("No existe un pedido activo con ese ID.");
            pausar();
            return;
        }

        Pedido pedido = pedidoOptional.get();
        System.out.println("Estado actual: " + pedido.getEstado());
        Estado nuevoEstado = leerEnumCancelable("Nuevo estado", Estado.values());
        pedido.setEstado(nuevoEstado);
        pedidoRepository.guardar(pedido);

        mostrarExito("Estado actualizado correctamente.");
        System.out.println("Pedido: " + pedido.getId());
        System.out.println("Nuevo estado: " + nuevoEstado);
        pausar();
    }

    private static void bajaPedido() {
        mostrarTituloOperacion("Baja logica de pedido");
        listarPedidosActivosSinPausa();
        Long id = leerLongCancelable("Ingrese el ID del pedido a dar de baja");
        Optional<Pedido> pedidoOptional = buscarPedidoActivo(id);

        if (pedidoOptional.isEmpty()) {
            mostrarError("No existe un pedido activo con ese ID.");
            pausar();
            return;
        }

        Pedido pedido = pedidoOptional.get();
        boolean eliminado = pedidoRepository.eliminarLogico(id);

        if (eliminado) {
            mostrarExito("Pedido dado de baja correctamente.");
            System.out.println("ID: " + id);
            System.out.println("Total: " + formatearDinero(pedido.getTotal()));
        } else {
            mostrarError("No se pudo dar de baja el pedido.");
        }
        pausar();
    }

    private static void listarPedidosActivosConPausa() {
        mostrarTituloOperacion("Pedidos activos");
        listarPedidosActivosSinPausa();
        pausar();
    }

    private static void listarPedidosActivosSinPausa() {
        List<Pedido> pedidos = pedidoRepository.listarActivos();
        if (pedidos.isEmpty()) mostrarAdvertencia("No hay pedidos activos registrados.");
        else mostrarTablaPedidos(pedidos);
    }

    private static void pedidosPorUsuario() {
        mostrarTituloOperacion("Pedidos por usuario");
        List<Usuario> usuarios = usuarioRepository.listarActivos();
        if (usuarios.isEmpty()) {
            mostrarAdvertencia("No hay usuarios activos.");
            pausar();
            return;
        }

        mostrarTablaUsuarios(usuarios);
        Long idUsuario = leerLongCancelable("Ingrese el ID del usuario");
        if (buscarUsuarioActivo(idUsuario).isEmpty()) {
            mostrarError("No existe un usuario activo con ese ID.");
            pausar();
            return;
        }

        List<Pedido> pedidos = pedidoRepository.buscarPorUsuario(idUsuario);
        if (pedidos.isEmpty()) mostrarAdvertencia("El usuario no tiene pedidos activos.");
        else mostrarTablaPedidos(pedidos);
        pausar();
    }

    private static void pedidosPorUsuarioReporte() {
        mostrarTituloOperacion("Reporte: pedidos por usuario");
        List<Usuario> usuarios = usuarioRepository.listarActivos();
        if (usuarios.isEmpty()) {
            mostrarAdvertencia("No hay usuarios activos.");
            pausar();
            return;
        }

        mostrarTablaUsuarios(usuarios);
        Long idUsuario = leerLongCancelable("Ingrese el ID del usuario");
        if (buscarUsuarioActivo(idUsuario).isEmpty()) {
            mostrarError("No existe un usuario activo con ese ID.");
            pausar();
            return;
        }

        List<Pedido> pedidos = usuarioRepository.buscarPedidosPorUsuario(idUsuario);
        if (pedidos.isEmpty()) mostrarAdvertencia("El usuario no tiene pedidos activos.");
        else mostrarTablaPedidos(pedidos);
        pausar();
    }

    private static void pedidosPorEstado() {
        mostrarTituloOperacion("Pedidos por estado");
        Estado estado = leerEnumCancelable("Estado", Estado.values());
        List<Pedido> pedidos = pedidoRepository.buscarPorEstado(estado);
        if (pedidos.isEmpty()) mostrarAdvertencia("No hay pedidos activos con ese estado.");
        else mostrarTablaPedidos(pedidos);
        pausar();
    }

    private static void productosPorCategoria() {
        mostrarTituloOperacion("Productos por categoria");
        List<Categoria> categorias = categoriaRepository.listarActivos();
        if (categorias.isEmpty()) {
            mostrarAdvertencia("No hay categorias activas registradas.");
            pausar();
            return;
        }

        mostrarTablaCategorias(categorias);
        Long idCategoria = leerLongCancelable("Ingrese el ID de la categoria");
        if (buscarCategoriaActiva(idCategoria).isEmpty()) {
            mostrarError("No existe una categoria activa con ese ID.");
            pausar();
            return;
        }

        List<Producto> productos = categoriaRepository.buscarProductosPorCategoria(idCategoria);
        if (productos.isEmpty()) mostrarAdvertencia("No hay productos activos en esa categoria.");
        else mostrarTablaProductos(productos);
        pausar();
    }

    private static void totalFacturado() {
        mostrarTituloOperacion("Total facturado");
        List<Pedido> pedidosTerminados = pedidoRepository.buscarPorEstado(Estado.TERMINADO);
        double total = pedidosTerminados.stream()
                .map(Pedido::getTotal)
                .filter(valor -> valor != null)
                .mapToDouble(Double::doubleValue)
                .sum();

        System.out.println("Total facturado: " + formatearDinero(total));
        pausar();
    }

    private static Optional<Categoria> buscarCategoriaActiva(Long id) {
        return categoriaRepository.buscarPorId(id)
                .filter(categoria -> !categoria.isEliminado());
    }

    private static Optional<Producto> buscarProductoActivo(Long id) {
        return productoRepository.buscarPorId(id)
                .filter(producto -> !producto.isEliminado());
    }

    private static Optional<Usuario> buscarUsuarioActivo(Long id) {
        return usuarioRepository.buscarPorId(id)
                .filter(usuario -> !usuario.isEliminado());
    }

    private static Optional<Pedido> buscarPedidoActivo(Long id) {
        return pedidoRepository.buscarPorId(id)
                .filter(pedido -> !pedido.isEliminado());
    }

    private static void mostrarTablaCategorias(List<Categoria> categorias) {
        System.out.println("\nID | NOMBRE | DESCRIPCION");
        System.out.println(LINEA);
        for (Categoria categoria : categorias) {
            System.out.println(categoria.getId() + " | " +
                    mostrarTexto(categoria.getNombre()) + " | " +
                    mostrarTexto(categoria.getDescripcion()));
        }
    }

    private static void mostrarTablaProductos(List<Producto> productos) {
        System.out.println("\nID | NOMBRE | PRECIO | STOCK | DISPONIBLE | CATEGORIA");
        System.out.println(LINEA);
        for (Producto producto : productos) {
            String categoria = producto.getCategoria() != null ? producto.getCategoria().getNombre() : "-";
            System.out.println(producto.getId() + " | " +
                    mostrarTexto(producto.getNombre()) + " | " +
                    formatearDinero(producto.getPrecio()) + " | " +
                    producto.getStock() + " | " +
                    mostrarDisponible(producto.getDisponible()) + " | " +
                    categoria);
        }
    }

    private static void mostrarTablaUsuarios(List<Usuario> usuarios) {
        System.out.println("\nID | NOMBRE COMPLETO | MAIL | ROL");
        System.out.println(LINEA);
        for (Usuario usuario : usuarios) {
            System.out.println(usuario.getId() + " | " +
                    mostrarTexto(usuario.getNombre()) + " " + mostrarTexto(usuario.getApellido()) + " | " +
                    mostrarTexto(usuario.getEmail()) + " | " +
                    usuario.getRol());
        }
    }

    private static void mostrarTablaPedidos(List<Pedido> pedidos) {
        System.out.println("\nID | FECHA | ESTADO | PAGO | USUARIO | TOTAL");
        System.out.println(LINEA);
        for (Pedido pedido : pedidos) {
            String usuario = pedido.getUsuario() != null
                    ? pedido.getUsuario().getNombre() + " " + pedido.getUsuario().getApellido()
                    : "-";
            System.out.println(pedido.getId() + " | " +
                    pedido.getFecha() + " | " +
                    pedido.getEstado() + " | " +
                    pedido.getFormaPago() + " | " +
                    usuario + " | " +
                    formatearDinero(pedido.getTotal()));
        }
    }

    private static void mostrarDetallePedido(Pedido pedido) {
        System.out.println("ID generado: " + pedido.getId());
        System.out.println("Fecha: " + pedido.getFecha());
        System.out.println("Estado: " + pedido.getEstado());
        if (pedido.getUsuario() != null) {
            System.out.println("Usuario: " + pedido.getUsuario().getNombre() + " " + pedido.getUsuario().getApellido());
        }
        System.out.println("Forma de pago: " + pedido.getFormaPago());
        System.out.println("Detalle:");
        for (DetallePedido detalle : pedido.getDetalles()) {
            System.out.println("- " + detalle.getProducto().getNombre() +
                    " x" + detalle.getCantidad() +
                    " = " + formatearDinero(detalle.getSubtotal()));
        }
        System.out.println("Total: " + formatearDinero(pedido.getTotal()));
    }

    private static int leerOpcionMenu(String mensaje) {
        while (true) {
            System.out.print(mensaje);
            String entrada = scanner.nextLine().trim();
            try {
                return Integer.parseInt(entrada);
            } catch (NumberFormatException e) {
                mostrarError("Debe ingresar un numero entero.");
            }
        }
    }

    private static String leerTextoCancelable(String campo) {
        System.out.print(campo + " (X para cancelar): ");
        String texto = scanner.nextLine().trim();
        if (texto.equalsIgnoreCase("x")) throw new OperacionCanceladaException();
        return texto;
    }

    private static String leerTextoOpcionalCancelable(String campo) {
        System.out.print(campo + " (Enter conserva, X cancela): ");
        String texto = scanner.nextLine().trim();
        if (texto.equalsIgnoreCase("x")) throw new OperacionCanceladaException();
        return texto;
    }

    private static Long leerLongCancelable(String campo) {
        while (true) {
            String texto = leerTextoCancelable(campo);
            try {
                return Long.parseLong(texto);
            } catch (NumberFormatException e) {
                mostrarError("Debe ingresar un numero entero valido.");
            }
        }
    }

    private static Integer leerIntCancelable(String campo) {
        while (true) {
            String texto = leerTextoCancelable(campo);
            try {
                return Integer.parseInt(texto);
            } catch (NumberFormatException e) {
                mostrarError("Debe ingresar un numero entero valido.");
            }
        }
    }

    private static Double leerDoubleCancelable(String campo) {
        while (true) {
            String texto = leerTextoCancelable(campo);
            try {
                return Double.parseDouble(texto.replace(",", "."));
            } catch (NumberFormatException e) {
                mostrarError("Debe ingresar un numero decimal valido.");
            }
        }
    }

    private static <E extends Enum<E>> E leerEnumCancelable(String campo, E[] valores) {
        while (true) {
            System.out.println(campo + ":");
            for (int i = 0; i < valores.length; i++) {
                System.out.println((i + 1) + ". " + valores[i]);
            }
            int opcion = leerIntCancelable("Seleccione una opcion");
            if (opcion >= 1 && opcion <= valores.length) {
                return valores[opcion - 1];
            }
            mostrarError("Opcion invalida.");
        }
    }

    private static Boolean leerBooleanSNConDefault(String campo, boolean valorDefault) {
        while (true) {
            System.out.print(campo + " (Enter = " + (valorDefault ? "S" : "N") + ", X cancela): ");
            String texto = scanner.nextLine().trim();
            if (texto.equalsIgnoreCase("x")) throw new OperacionCanceladaException();
            if (texto.isBlank()) return valorDefault;
            return parsearBooleanSN(texto);
        }
    }

    private static Boolean parsearBooleanSN(String texto) {
        if (texto.equalsIgnoreCase("s") || texto.equalsIgnoreCase("si")) return true;
        if (texto.equalsIgnoreCase("n") || texto.equalsIgnoreCase("no")) return false;
        throw new IllegalArgumentException("Debe ingresar S o N.");
    }

    private static Double parsearDouble(String texto) {
        try {
            return Double.parseDouble(texto.replace(",", "."));
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Debe ingresar un numero decimal valido.");
        }
    }

    private static Integer parsearInt(String texto) {
        try {
            return Integer.parseInt(texto);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Debe ingresar un numero entero valido.");
        }
    }

    private static void ejecutarOperacion(OperacionConsola operacion) {
        try {
            operacion.ejecutar();
        } catch (OperacionCanceladaException e) {
            mostrarAdvertencia("Operacion cancelada.");
            pausar();
        } catch (IllegalArgumentException e) {
            mostrarError(e.getMessage());
            pausar();
        } catch (Exception e) {
            mostrarError("Ocurrio un error: " + e.getMessage());
            pausar();
        }
    }

    private static void mostrarTituloOperacion(String titulo) {
        System.out.println("\n" + CYAN + NEGRITA + "=== " + titulo + " ===" + RESET);
    }

    private static void mostrarExito(String mensaje) {
        System.out.println(VERDE + mensaje + RESET);
    }

    private static void mostrarAdvertencia(String mensaje) {
        System.out.println(AMARILLO + mensaje + RESET);
    }

    private static void mostrarError(String mensaje) {
        System.out.println(ROJO + mensaje + RESET);
    }

    private static String mostrarTexto(String texto) {
        return texto == null || texto.isBlank() ? "-" : texto;
    }

    private static String mostrarDisponible(Boolean disponible) {
        return Boolean.TRUE.equals(disponible) ? "Si" : "No";
    }

    private static String formatearDinero(Double valor) {
        return String.format(Locale.US, "$%.2f", valor == null ? 0.0 : valor);
    }

    private static void pausar() {
        System.out.print("\nPresione Enter para continuar...");
        scanner.nextLine();
    }

    @FunctionalInterface
    private interface OperacionConsola {
        void ejecutar();
    }

    private static class OperacionCanceladaException extends RuntimeException {
    }
}
