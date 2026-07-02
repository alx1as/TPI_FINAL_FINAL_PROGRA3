import type { CartItem } from "../../../types/product";
import { configurarLogout, getCurrentUser } from "../../../utils/auth";

const ENVIO = 0;

type FormaPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";

type PedidoLocal = {
    id: number;
    date: string;
    status: "PENDIENTE";
    total: number;
    paymentMethod: FormaPago;
    phone: string;
    address: string;
    userEmail: string;
    items: {
        productId: number;
        productName: string;
        quantity: number;
        subtotal: number;
    }[];
};

function protegerCarrito(): boolean {
    const usuario = getCurrentUser();

    if (usuario?.role === "admin") {
        alert("El carrito corresponde al rol cliente. Desde administración podés revisar la tienda, pero no generar compras.");
        window.location.href = "../../admin/home.html";
        return false;
    }

    return true;
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

function calcularSubtotal(carrito: CartItem[]): number {
    return carrito.reduce((subtotal, item) => subtotal + item.product.price * item.quantity, 0);
}

function formatearPrecio(precio: number): string {
    return `$${precio.toLocaleString("es-AR")}`;
}

function actualizarResumen(carrito: CartItem[]): void {
    const subtotalElemento = document.getElementById("subtotal-carrito");
    const envioElemento = document.getElementById("envio-carrito");
    const totalElemento = document.getElementById("total-carrito");

    const subtotal = calcularSubtotal(carrito);
    const total = subtotal + ENVIO;

    if (subtotalElemento) subtotalElemento.textContent = formatearPrecio(subtotal);
    if (envioElemento) envioElemento.textContent = formatearPrecio(ENVIO);
    if (totalElemento) totalElemento.textContent = formatearPrecio(total);
}

function renderizarCarrito(): void {
    const contenedorCarrito = document.getElementById("contenedor-carrito");

    if (!contenedorCarrito) return;

    const carrito = obtenerCarrito();
    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <div class="estado-vacio">
                <p>El carrito está vacío.</p>
                <a href="../home/home.html">Volver a la tienda</a>
            </div>
        `;
        actualizarResumen(carrito);
        return;
    }

    carrito.forEach((item) => {
        const itemCarrito = document.createElement("article");
        itemCarrito.classList.add("item-carrito");

        const subtotal = item.product.price * item.quantity;

        itemCarrito.innerHTML = `
            <img src="${item.product.image}" alt="${item.product.name}">

            <div class="item-info">
                <h3>${item.product.name}</h3>
                <p>Precio unitario: ${formatearPrecio(item.product.price)}</p>
                <p>Stock disponible: ${item.product.stock}</p>
                <p><strong>Subtotal: ${formatearPrecio(subtotal)}</strong></p>

                <div class="cantidad-controles">
                    <button class="btn-restar" type="button">-</button>
                    <span>${item.quantity}</span>
                    <button class="btn-sumar" type="button">+</button>
                </div>

                <button class="btn-eliminar" type="button">Eliminar</button>
            </div>
        `;

        itemCarrito.querySelector(".btn-restar")?.addEventListener("click", () => cambiarCantidad(item.product.id, -1));
        itemCarrito.querySelector(".btn-sumar")?.addEventListener("click", () => cambiarCantidad(item.product.id, 1));
        itemCarrito.querySelector(".btn-eliminar")?.addEventListener("click", () => eliminarProducto(item.product.id));

        contenedorCarrito.appendChild(itemCarrito);
    });

    actualizarResumen(carrito);
}

function cambiarCantidad(productId: number, cambio: number): void {
    const carrito = obtenerCarrito();
    const item = carrito.find((item) => item.product.id === productId);

    if (!item) return;

    const nuevaCantidad = item.quantity + cambio;

    if (nuevaCantidad > item.product.stock) {
        alert("No hay más stock disponible para este producto.");
        return;
    }

    if (nuevaCantidad <= 0) {
        guardarCarrito(carrito.filter((item) => item.product.id !== productId));
        renderizarCarrito();
        return;
    }

    item.quantity = nuevaCantidad;
    guardarCarrito(carrito);
    renderizarCarrito();
}

function eliminarProducto(productId: number): void {
    const carrito = obtenerCarrito().filter((item) => item.product.id !== productId);
    guardarCarrito(carrito);
    renderizarCarrito();
}

function vaciarCarrito(): void {
    localStorage.removeItem("cart");
    renderizarCarrito();
}

function obtenerPedidosLocales(): PedidoLocal[] {
    const pedidosGuardados = localStorage.getItem("orders");

    if (!pedidosGuardados) return [];

    try {
        return JSON.parse(pedidosGuardados) as PedidoLocal[];
    } catch {
        return [];
    }
}

function guardarPedido(pedido: PedidoLocal): void {
    const pedidos = obtenerPedidosLocales();
    pedidos.push(pedido);
    localStorage.setItem("orders", JSON.stringify(pedidos));
}

function confirmarCompra(): void {
    const carrito = obtenerCarrito();

    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    const usuario = getCurrentUser();

    if (!usuario) {
        alert("Debe iniciar sesión para confirmar la compra.");
        window.location.href = "/src/pages/auth/login/login.html";
        return;
    }

    if (usuario.role === "admin") {
        alert("El administrador no puede generar pedidos desde la tienda.");
        window.location.href = "../../admin/home.html";
        return;
    }

    const telefonoInput = document.getElementById("telefono-entrega") as HTMLInputElement | null;
    const direccionInput = document.getElementById("direccion-entrega") as HTMLTextAreaElement | null;
    const selectFormaPago = document.getElementById("forma-pago") as HTMLSelectElement | null;

    if (!telefonoInput || !direccionInput || !selectFormaPago) {
        alert("No se pudieron obtener los datos del pedido.");
        return;
    }

    const telefono = telefonoInput.value.trim();
    const direccion = direccionInput.value.trim();

    if (!telefono || !direccion) {
        alert("Completá el teléfono y la dirección de entrega.");
        return;
    }

    const formaPago = selectFormaPago.value as FormaPago;
    const subtotal = calcularSubtotal(carrito);
    const total = subtotal + ENVIO;
    const nuevoPedido: PedidoLocal = {
        id: Date.now(),
        date: new Date().toISOString(),
        status: "PENDIENTE",
        total,
        paymentMethod: formaPago,
        phone: telefono,
        address: direccion,
        userEmail: usuario.email,
        items: carrito.map((item) => {
            return {
                productId: item.product.id,
                productName: item.product.name,
                quantity: item.quantity,
                subtotal: item.product.price * item.quantity
            };
        })
    };

    guardarPedido(nuevoPedido);
    localStorage.removeItem("cart");
    alert("Pedido generado con éxito.");
    window.location.href = "../../client/orders/orders.html";
}

function configurarEventosCarrito(): void {
    document.getElementById("btn-vaciar-carrito")?.addEventListener("click", vaciarCarrito);
    document.getElementById("btn-confirmar-compra")?.addEventListener("click", confirmarCompra);
}

if (protegerCarrito()) {
    renderizarCarrito();
    configurarEventosCarrito();
    configurarLogout();
}
