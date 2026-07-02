import { configurarLogout } from "../../../utils/auth";

type EstadoPedido = "PENDIENTE" | "CONFIRMADO" | "TERMINADO" | "CANCELADO";
type FiltroEstado = EstadoPedido | "ACTIVOS" | "TODOS";
type FormaPago = "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";

type ItemPedido = {
    productId: number;
    productName: string;
    quantity: number;
    subtotal: number;
};

type PedidoAdmin = {
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
const estados: EstadoPedido[] = ["PENDIENTE", "CONFIRMADO", "TERMINADO", "CANCELADO"];

let pedidosAdmin: PedidoAdmin[] = [];
let filtroActual: FiltroEstado = obtenerFiltroInicial();

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

function guardarCambioDeEstado(pedidoId: number, estado: EstadoPedido): void {
    const cambios = obtenerCambiosDeEstado();
    cambios[String(pedidoId)] = estado;
    localStorage.setItem(ORDER_STATUS_OVERRIDES_KEY, JSON.stringify(cambios));

    const pedidosLocalesActualizados = obtenerPedidosLocales().map((pedido) => {
        return pedido.id === pedidoId ? { ...pedido, status: estado } : pedido;
    });

    localStorage.setItem("orders", JSON.stringify(pedidosLocalesActualizados));
}

function aplicarCambiosDeEstado(pedidos: PedidoAdmin[]): PedidoAdmin[] {
    const cambios = obtenerCambiosDeEstado();

    return pedidos.map((pedido) => {
        const estadoGuardado = cambios[String(pedido.id)];
        return estadoGuardado ? { ...pedido, status: estadoGuardado } : pedido;
    });
}

function obtenerFiltroInicial(): FiltroEstado {
    const params = new URLSearchParams(window.location.search);
    const estado = params.get("estado")?.toUpperCase();

    if (estado === "PENDIENTE" || estado === "CONFIRMADO" || estado === "TERMINADO" || estado === "CANCELADO" || estado === "TODOS") {
        return estado;
    }

    return "ACTIVOS";
}

function actualizarUrlFiltro(): void {
    const url = new URL(window.location.href);

    if (filtroActual === "ACTIVOS") {
        url.searchParams.delete("estado");
    } else {
        url.searchParams.set("estado", filtroActual);
    }

    window.history.replaceState({}, "", url);
}

function formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleString("es-AR");
}

function formatearPrecio(valor: number): string {
    return `$${valor.toLocaleString("es-AR")}`;
}

function esPedidoOperativo(pedido: PedidoAdmin): boolean {
    return pedido.status === "PENDIENTE" || pedido.status === "CONFIRMADO";
}

function obtenerClaseEstado(estado: EstadoPedido): string {
    return `estado-${estado.toLowerCase()}`;
}

function obtenerLabelEstado(estado: FiltroEstado): string {
    const labels: Record<FiltroEstado, string> = {
        ACTIVOS: "Activos",
        TODOS: "Todos",
        PENDIENTE: "Nuevos",
        CONFIRMADO: "En curso",
        TERMINADO: "Entregados",
        CANCELADO: "Cancelados"
    };

    return labels[estado];
}

function renderizarFiltros(): void {
    const contenedor = document.getElementById("filtro-estados");
    if (!contenedor) return;

    const filtros: FiltroEstado[] = ["ACTIVOS", "PENDIENTE", "CONFIRMADO", "TERMINADO", "CANCELADO", "TODOS"];
    contenedor.innerHTML = "";

    filtros.forEach((filtro) => {
        const cantidad = contarPedidosPorFiltro(filtro);

        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = filtro === filtroActual ? "filter-chip activo" : "filter-chip";
        boton.dataset.estado = filtro;
        boton.textContent = `${obtenerLabelEstado(filtro)} (${cantidad})`;

        boton.addEventListener("click", () => {
            filtroActual = filtro;
            actualizarUrlFiltro();
            aplicarFiltro();
        });

        contenedor.appendChild(boton);
    });
}

function contarPedidosPorFiltro(filtro: FiltroEstado): number {
    if (filtro === "TODOS") return pedidosAdmin.length;
    if (filtro === "ACTIVOS") return pedidosAdmin.filter(esPedidoOperativo).length;

    return pedidosAdmin.filter((pedido) => pedido.status === filtro).length;
}

function obtenerPedidosFiltrados(): PedidoAdmin[] {
    if (filtroActual === "TODOS") return pedidosAdmin;
    if (filtroActual === "ACTIVOS") return pedidosAdmin.filter(esPedidoOperativo);

    return pedidosAdmin.filter((pedido) => pedido.status === filtroActual);
}

function renderizarPedidos(pedidos: PedidoAdmin[]): void {
    const contenedor = document.getElementById("contenedor-pedidos-admin");

    if (!contenedor) return;

    contenedor.innerHTML = "";

    if (pedidos.length === 0) {
        contenedor.innerHTML = `
            <div class="estado-vacio">
                <p>No hay pedidos para este filtro.</p>
            </div>
        `;
        return;
    }

    pedidos.forEach((pedido) => {
        const articulo = document.createElement("article");
        articulo.classList.add("pedido-card");

        const cantidadProductos = pedido.items.reduce((acumulador, item) => acumulador + item.quantity, 0);
        const productosHtml = pedido.items
            .map((item) => {
                return `
                    <li>
                        <div>
                            <strong>${item.productName}</strong>
                            <span>Cantidad: ${item.quantity}</span>
                        </div>
                        <strong>${formatearPrecio(item.subtotal)}</strong>
                    </li>
                `;
            })
            .join("");

        articulo.innerHTML = `
            <div class="pedido-header">
                <div>
                    <p class="pedido-id">Pedido #${pedido.id}</p>
                    <h2>${pedido.userEmail}</h2>
                    <p>${formatearFecha(pedido.date)}</p>
                </div>

                <span class="badge ${obtenerClaseEstado(pedido.status)}">${obtenerLabelEstado(pedido.status)}</span>
            </div>

            <div class="pedido-grid">
                <div class="pedido-productos">
                    <div class="subtitulo-linea">
                        <strong>Productos</strong>
                        <span>${cantidadProductos} unidad/es</span>
                    </div>
                    <ul>${productosHtml}</ul>
                </div>

                <div class="pedido-panel">
                    <p><span>Forma de pago</span><strong>${pedido.paymentMethod}</strong></p>
                    <p><span>Teléfono</span><strong>${pedido.phone ?? "No informado"}</strong></p>
                    <p><span>Dirección</span><strong>${pedido.address ?? "No informada"}</strong></p>
                    <p><span>Total</span><strong>${formatearPrecio(pedido.total)}</strong></p>

                    <label for="estado-${pedido.id}">Estado del pedido</label>
                    <select id="estado-${pedido.id}" data-id="${pedido.id}" class="select-estado">
                        <option value="PENDIENTE" ${pedido.status === "PENDIENTE" ? "selected" : ""}>Nuevo</option>
                        <option value="CONFIRMADO" ${pedido.status === "CONFIRMADO" ? "selected" : ""}>En curso</option>
                        <option value="TERMINADO" ${pedido.status === "TERMINADO" ? "selected" : ""}>Entregado</option>
                        <option value="CANCELADO" ${pedido.status === "CANCELADO" ? "selected" : ""}>Cancelado</option>
                    </select>

                    <button class="btn-actualizar" type="button" data-id="${pedido.id}">Actualizar estado</button>
                </div>
            </div>
        `;

        contenedor.appendChild(articulo);
    });

    configurarBotonesEstado();
}

function configurarBotonesEstado(): void {
    document.querySelectorAll(".btn-actualizar").forEach((boton) => {
        boton.addEventListener("click", () => {
            const pedidoId = Number((boton as HTMLButtonElement).dataset.id);
            const select = document.getElementById(`estado-${pedidoId}`) as HTMLSelectElement | null;

            if (!select) return;

            cambiarEstadoPedido(pedidoId, select.value as EstadoPedido);
        });
    });
}

function cambiarEstadoPedido(pedidoId: number, nuevoEstado: EstadoPedido): void {
    const pedido = pedidosAdmin.find((item) => item.id === pedidoId);

    if (!pedido) return;

    pedido.status = nuevoEstado;
    guardarCambioDeEstado(pedidoId, nuevoEstado);
    aplicarFiltro();
}

function aplicarFiltro(): void {
    renderizarFiltros();
    renderizarPedidos(obtenerPedidosFiltrados());
}

async function iniciarAdminPedidos(): Promise<void> {
    try {
        const pedidosJson = await obtenerPedidosJson();
        const pedidosLocales = obtenerPedidosLocales();

        pedidosAdmin = aplicarCambiosDeEstado([...pedidosJson, ...pedidosLocales]);
        pedidosAdmin.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        aplicarFiltro();
    } catch (error) {
        console.error(error);

        const contenedor = document.getElementById("contenedor-pedidos-admin");

        if (contenedor) {
            contenedor.innerHTML = "<p>No se pudieron cargar los pedidos.</p>";
        }
    }
}

iniciarAdminPedidos();
configurarLogout();
