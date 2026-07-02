import { configurarLogout, getCurrentUser } from "../../../utils/auth";

type EstadoPedido = "PENDIENTE" | "CONFIRMADO" | "TERMINADO" | "CANCELADO";
type FormaPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";

type ItemPedido = {
    productId: number;
    productName: string;
    quantity: number;
    subtotal: number;
};

type Pedido = {
    id: number;
    date: string;
    status: EstadoPedido;
    total: number;
    paymentMethod: FormaPago;
    phone?: string;
    address?: string;
    userEmail: string;
    items: ItemPedido[];
};

const ORDER_STATUS_OVERRIDES_KEY = "foodstore_order_status_overrides";

async function obtenerPedidosJson(): Promise<Pedido[]> {
    const response = await fetch("/data/pedidos.json");

    if (!response.ok) {
        throw new Error("No se pudieron cargar los pedidos.");
    }

    return response.json() as Promise<Pedido[]>;
}

function obtenerPedidosLocales(): Pedido[] {
    const pedidosGuardados = localStorage.getItem("orders");

    if (!pedidosGuardados) return [];

    try {
        return JSON.parse(pedidosGuardados) as Pedido[];
    } catch {
        return [];
    }
}

function obtenerCambiosDeEstado(): Record<string, EstadoPedido> {
    const texto = localStorage.getItem(ORDER_STATUS_OVERRIDES_KEY);

    if (!texto) return {};

    try {
        return JSON.parse(texto) as Record<string, EstadoPedido>;
    } catch {
        return {};
    }
}

function aplicarCambiosDeEstado(pedidos: Pedido[]): Pedido[] {
    const cambios = obtenerCambiosDeEstado();

    return pedidos.map((pedido) => {
        const estadoGuardado = cambios[String(pedido.id)];
        return estadoGuardado ? { ...pedido, status: estadoGuardado } : pedido;
    });
}

function formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString("es-AR");
}

function formatearPrecio(precio: number): string {
    return `$${precio.toLocaleString("es-AR")}`;
}

function obtenerLabelEstado(estado: EstadoPedido): string {
    const labels: Record<EstadoPedido, string> = {
        PENDIENTE: "Nuevo",
        CONFIRMADO: "En curso",
        TERMINADO: "Entregado",
        CANCELADO: "Cancelado"
    };

    return labels[estado];
}

function renderizarPedidos(pedidos: Pedido[]): void {
    const contenedorPedidos = document.getElementById("contenedor-pedidos");

    if (!contenedorPedidos) return;

    contenedorPedidos.innerHTML = "";

    if (pedidos.length === 0) {
        contenedorPedidos.innerHTML = `
            <div class="estado-vacio">
                <p>No tenés pedidos todavía.</p>
                <a href="../../store/home/home.html">Volver a la tienda</a>
            </div>
        `;
        return;
    }

    pedidos.forEach((pedido) => {
        const articuloPedido = document.createElement("article");
        articuloPedido.classList.add("pedido-card");

        const productosHtml = pedido.items
            .map((item) => {
                return `
                    <li>
                        <span>${item.productName} x${item.quantity}</span>
                        <strong>${formatearPrecio(item.subtotal)}</strong>
                    </li>
                `;
            })
            .join("");

        articuloPedido.innerHTML = `
            <div class="pedido-header">
                <div>
                    <h2>Pedido #${pedido.id}</h2>
                    <p>${formatearFecha(pedido.date)}</p>
                </div>

                <span class="badge estado-${pedido.status.toLowerCase()}">${obtenerLabelEstado(pedido.status)}</span>
            </div>

            <div class="pedido-body">
                <p><strong>Forma de pago:</strong> ${pedido.paymentMethod}</p>
                <p><strong>Teléfono:</strong> ${pedido.phone ?? "No informado"}</p>
                <p><strong>Dirección:</strong> ${pedido.address ?? "No informada"}</p>

                <ul class="pedido-productos">${productosHtml}</ul>

                <p class="pedido-total">Total: ${formatearPrecio(pedido.total)}</p>
            </div>
        `;

        contenedorPedidos.appendChild(articuloPedido);
    });
}

async function iniciarPedidos(): Promise<void> {
    const usuarioActual = getCurrentUser();

    if (!usuarioActual) {
        alert("Debe iniciar sesión para ver sus pedidos.");
        window.location.href = "/src/pages/auth/login/login.html";
        return;
    }

    if (usuarioActual.role === "admin") {
        window.location.href = "../../admin/home.html";
        return;
    }

    try {
        const pedidosJson = await obtenerPedidosJson();
        const pedidosLocales = obtenerPedidosLocales();
        const todosLosPedidos = aplicarCambiosDeEstado([...pedidosJson, ...pedidosLocales]);
        const pedidosDelUsuario = todosLosPedidos.filter((pedido) => pedido.userEmail === usuarioActual.email);

        pedidosDelUsuario.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        renderizarPedidos(pedidosDelUsuario);
    } catch (error) {
        console.error(error);

        const contenedorPedidos = document.getElementById("contenedor-pedidos");

        if (contenedorPedidos) {
            contenedorPedidos.innerHTML = "<p>No se pudieron cargar los pedidos.</p>";
        }
    }
}

iniciarPedidos();
configurarLogout();
