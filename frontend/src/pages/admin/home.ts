import { configurarLogout } from "../../utils/auth";
import { obtenerCategoriasCompletas, obtenerProductosTodos } from "../../data/data";
import type { Product } from "../../types/product";
import type { ICategoria } from "../../types/categoria";

type EstadoPedido = "PENDIENTE" | "CONFIRMADO" | "TERMINADO" | "CANCELADO";

type PedidoAdmin = {
    id: number;
    date: string;
    status: EstadoPedido;
    total: number;
    paymentMethod: string;
    userEmail: string;
    items: {
        productId: number;
        productName: string;
        quantity: number;
        subtotal: number;
    }[];
};

const ORDER_STATUS_OVERRIDES_KEY = "foodstore_order_status_overrides";
const estados: EstadoPedido[] = ["PENDIENTE", "CONFIRMADO", "TERMINADO", "CANCELADO"];

async function obtenerPedidosJson(): Promise<PedidoAdmin[]> {
    const response = await fetch("/data/pedidos.json");

    if (!response.ok) {
        throw new Error("No se pudieron cargar los pedidos.");
    }

    return response.json() as Promise<PedidoAdmin[]>;
}

function obtenerPedidosLocales(): PedidoAdmin[] {
    const pedidosGuardados = localStorage.getItem("orders");

    if (!pedidosGuardados) return [];

    try {
        return JSON.parse(pedidosGuardados) as PedidoAdmin[];
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

function aplicarCambiosDeEstado(pedidos: PedidoAdmin[]): PedidoAdmin[] {
    const cambios = obtenerCambiosDeEstado();

    return pedidos.map((pedido) => {
        const estadoGuardado = cambios[String(pedido.id)];
        return estadoGuardado ? { ...pedido, status: estadoGuardado } : pedido;
    });
}

function esPedidoOperativo(pedido: PedidoAdmin): boolean {
    return pedido.status === "PENDIENTE" || pedido.status === "CONFIRMADO";
}

function renderizarEstadisticas(
    productos: Product[],
    categorias: ICategoria[],
    pedidos: PedidoAdmin[]
): void {
    const statCategorias = document.getElementById("stat-categorias");
    const statProductos = document.getElementById("stat-productos");
    const statPedidosActivos = document.getElementById("stat-pedidos-activos");
    const statPedidosOperativos = document.getElementById("stat-pedidos-operativos");

    const categoriasActivas = categorias.filter((categoria) => categoria.deleted !== true);
    const productosActivos = productos.filter((producto) => producto.deleted !== true);
    const pedidosOperativos = pedidos.filter(esPedidoOperativo);

    if (statCategorias) statCategorias.textContent = String(categoriasActivas.length);
    if (statProductos) statProductos.textContent = String(productosActivos.length);
    if (statPedidosActivos) statPedidosActivos.textContent = String(pedidosOperativos.length);
    if (statPedidosOperativos) statPedidosOperativos.textContent = String(pedidosOperativos.length);
}

function obtenerClaseEstado(estado: EstadoPedido): string {
    return `estado-${estado.toLowerCase()}`;
}

function obtenerLabelEstado(estado: EstadoPedido): string {
    const labels: Record<EstadoPedido, string> = {
        PENDIENTE: "Nuevos",
        CONFIRMADO: "En curso",
        TERMINADO: "Entregados",
        CANCELADO: "Cancelados"
    };

    return labels[estado];
}

function obtenerDescripcionEstado(estado: EstadoPedido): string {
    const labels: Record<EstadoPedido, string> = {
        PENDIENTE: "Sin aceptar",
        CONFIRMADO: "Aceptados",
        TERMINADO: "Finalizados",
        CANCELADO: "No vigentes"
    };

    return labels[estado];
}

function renderizarResumenPedidos(pedidos: PedidoAdmin[]): void {
    const contenedorResumen = document.getElementById("resumen-pedidos");

    if (!contenedorResumen) return;

    contenedorResumen.innerHTML = "";

    estados.forEach((estado) => {
        const cantidad = pedidos.filter((pedido) => pedido.status === estado).length;
        const itemResumen = document.createElement("a");
        itemResumen.className = `status-card ${obtenerClaseEstado(estado)}`;
        itemResumen.href = `./orders/orders.html?estado=${estado}`;
        itemResumen.innerHTML = `
            <span>${obtenerLabelEstado(estado)}</span>
            <strong>${cantidad}</strong>
            <small>${obtenerDescripcionEstado(estado)}</small>
        `;

        contenedorResumen.appendChild(itemResumen);
    });
}

async function iniciarAdmin(): Promise<void> {
    try {
        const productos = await obtenerProductosTodos();
        const categorias = await obtenerCategoriasCompletas();
        const pedidosJson = await obtenerPedidosJson();
        const pedidosLocales = obtenerPedidosLocales();
        const todosLosPedidos = aplicarCambiosDeEstado([...pedidosJson, ...pedidosLocales]);

        renderizarEstadisticas(productos, categorias, todosLosPedidos);
        renderizarResumenPedidos(todosLosPedidos);
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar los datos del panel de administración.");
    }
}

iniciarAdmin();
configurarLogout();
