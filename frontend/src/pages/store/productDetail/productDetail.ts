import { obtenerProductosTodos } from "../../../data/data";
import type { Product, CartItem } from "../../../types/product";
import { configurarLogout, getCurrentUser } from "../../../utils/auth";

function esAdmin(): boolean {
    return getCurrentUser()?.role === "admin";
}

function configurarNavegacionPorRol(): void {
    if (!esAdmin()) return;

    document.getElementById("admin-link")?.removeAttribute("hidden");
    document.getElementById("cart-link")?.setAttribute("hidden", "true");
    document.getElementById("orders-link")?.setAttribute("hidden", "true");
}

function obtenerIdProducto(): number | null {
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get("id"));

    return Number.isFinite(id) && id > 0 ? id : null;
}

function obtenerCarrito(): CartItem[] {
    const carritoGuardado = localStorage.getItem("cart");

    if (!carritoGuardado) return [];

    try {
        return JSON.parse(carritoGuardado) as CartItem[];
    } catch {
        return [];
    }
}

function guardarCarrito(carrito: CartItem[]): void {
    localStorage.setItem("cart", JSON.stringify(carrito));
}

function formatearPrecio(precio: number): string {
    return `$${precio.toLocaleString("es-AR")}`;
}

function agregarAlCarrito(producto: Product, cantidad: number): void {
    if (esAdmin()) {
        alert("El administrador puede revisar la tienda, pero las compras pertenecen al rol cliente.");
        return;
    }

    const carrito = obtenerCarrito();
    const existente = carrito.find((item) => item.product.id === producto.id);
    const cantidadActual = existente ? existente.quantity : 0;

    if (cantidad <= 0) {
        alert("La cantidad debe ser mayor a cero.");
        return;
    }

    if (cantidadActual + cantidad > producto.stock) {
        alert(`No hay stock suficiente. Stock disponible: ${producto.stock}`);
        return;
    }

    if (existente) {
        existente.quantity += cantidad;
    } else {
        carrito.push({ product: producto, quantity: cantidad });
    }

    guardarCarrito(carrito);
    alert("Producto agregado con éxito.");
}

function renderizarDetalle(producto: Product): void {
    const contenedor = document.getElementById("detalle-producto");

    if (!contenedor) return;

    const disponible = producto.available && !producto.deleted && producto.stock > 0;
    const bloqueCompra = esAdmin()
        ? `
            <div class="admin-readonly">
                <strong>Vista de administrador.</strong>
                Este producto se muestra en modo lectura. Para modificarlo, usá Gestión de productos.
            </div>
            <a class="btn-primary" href="../../admin/products/products.html">Gestionar productos</a>
          `
        : `
            <div class="quantity-box">
                <label for="cantidad-producto">Cantidad:</label>
                <input id="cantidad-producto" type="number" min="1" max="${producto.stock}" value="1">
            </div>

            <button id="btn-agregar-detalle" class="btn-primary" type="button" ${disponible ? "" : "disabled"}>
                Agregar al carrito
            </button>
          `;

    contenedor.innerHTML = `
        <div class="detail-layout">
            <img src="${producto.image}" alt="${producto.name}">

            <div class="detail-info">
                <span class="producto-categoria">${producto.category}</span>
                <h1>${producto.name}</h1>
                <p>${producto.description}</p>
                <p class="price">${formatearPrecio(producto.price)}</p>
                <span class="badge ${disponible ? "badge-disponible" : "badge-no-disponible"}">
                    ${disponible ? "Disponible" : "No disponible"}
                </span>

                <div class="detail-actions">
                    ${bloqueCompra}
                    <a class="btn-secondary" href="../home/home.html">Volver al catálogo</a>
                </div>
            </div>
        </div>
    `;

    const botonAgregar = document.getElementById("btn-agregar-detalle") as HTMLButtonElement | null;
    const inputCantidad = document.getElementById("cantidad-producto") as HTMLInputElement | null;

    if (!botonAgregar || !inputCantidad) return;

    botonAgregar.addEventListener("click", () => {
        const cantidad = Number(inputCantidad.value);
        agregarAlCarrito(producto, cantidad);
    });
}

async function iniciarDetalle(): Promise<void> {
    configurarNavegacionPorRol();
    configurarLogout();

    const contenedor = document.getElementById("detalle-producto");
    const idProducto = obtenerIdProducto();

    if (!idProducto) {
        if (contenedor) contenedor.innerHTML = "<p>No se recibió un producto válido.</p>";
        return;
    }

    try {
        const productos = await obtenerProductosTodos();
        const producto = productos.find((item) => item.id === idProducto && item.deleted !== true);

        if (!producto) {
            if (contenedor) contenedor.innerHTML = "<p>No se encontró el producto solicitado.</p>";
            return;
        }

        renderizarDetalle(producto);
    } catch (error) {
        console.error(error);
        if (contenedor) contenedor.innerHTML = "<p>No se pudo cargar el detalle del producto.</p>";
    }
}

iniciarDetalle();
