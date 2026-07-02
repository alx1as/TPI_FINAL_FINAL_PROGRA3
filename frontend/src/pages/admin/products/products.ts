import { configurarLogout } from "../../../utils/auth";
import {
    guardarCategoriasAdmin,
    guardarProductosAdmin,
    obtenerCategorias,
    obtenerCategoriasCompletas,
    obtenerProductosTodos
} from "../../../data/data";
import type { Product } from "../../../types/product";
import type { ICategoria } from "../../../types/categoria";

let productos: Product[] = [];
let categorias: ICategoria[] = [];
let nombresCategorias: string[] = [];

type TabGestion = "productos" | "categorias";

function renderizarProductos(): void {
    const tabla = document.getElementById("tabla-productos") as HTMLTableSectionElement | null;

    if (!tabla) return;

    const productosActivos = productos.filter((producto) => producto.deleted !== true);
    tabla.innerHTML = "";

    if (productosActivos.length === 0) {
        tabla.innerHTML = `<tr><td colspan="9">No hay productos cargados.</td></tr>`;
        return;
    }

    productosActivos.forEach((producto) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${producto.id}</td>
            <td><img src="${producto.image}" alt="${producto.name}"></td>
            <td>${producto.name}</td>
            <td>${producto.description}</td>
            <td>$${producto.price.toLocaleString("es-AR")}</td>
            <td>${producto.category}</td>
            <td>${producto.stock}</td>
            <td>
                <span class="badge ${producto.available ? "badge-disponible" : "badge-no-disponible"}">
                    ${producto.available ? "Disponible" : "No disponible"}
                </span>
            </td>
            <td>
                <button class="btn-editar-producto" data-id="${producto.id}" type="button">Editar</button>
                <button class="btn-eliminar-producto" data-id="${producto.id}" type="button">Eliminar</button>
            </td>
        `;

        tabla.appendChild(fila);
    });

    configurarBotonesProducto();
}

function renderizarCategorias(): void {
    const tabla = document.getElementById("tabla-categorias") as HTMLTableSectionElement | null;

    if (!tabla) return;

    const categoriasActivas = categorias.filter((categoria) => categoria.deleted !== true);
    tabla.innerHTML = "";

    if (categoriasActivas.length === 0) {
        tabla.innerHTML = `<tr><td colspan="5">No hay categorías cargadas.</td></tr>`;
        return;
    }

    categoriasActivas.forEach((categoria) => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${categoria.id}</td>
            <td><img src="${categoria.image}" alt="${categoria.name}"></td>
            <td>${categoria.name}</td>
            <td>${categoria.description}</td>
            <td>
                <button class="btn-editar-categoria" data-id="${categoria.id}" type="button">Editar</button>
                <button class="btn-eliminar-categoria" data-id="${categoria.id}" type="button">Eliminar</button>
            </td>
        `;

        tabla.appendChild(fila);
    });

    configurarBotonesCategoria();
}

function configurarBotonesProducto(): void {
    document.querySelectorAll(".btn-editar-producto").forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = Number((boton as HTMLButtonElement).dataset.id);
            editarProducto(id);
        });
    });

    document.querySelectorAll(".btn-eliminar-producto").forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = Number((boton as HTMLButtonElement).dataset.id);
            eliminarProducto(id);
        });
    });
}

function configurarBotonesCategoria(): void {
    document.querySelectorAll(".btn-editar-categoria").forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = Number((boton as HTMLButtonElement).dataset.id);
            editarCategoria(id);
        });
    });

    document.querySelectorAll(".btn-eliminar-categoria").forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = Number((boton as HTMLButtonElement).dataset.id);
            eliminarCategoria(id);
        });
    });
}

function pedirTexto(mensaje: string, valorActual = ""): string | null {
    const valor = window.prompt(mensaje, valorActual);

    if (valor === null) return null;

    return valor.trim();
}

function pedirNumero(mensaje: string, valorActual = ""): number | null {
    const texto = pedirTexto(mensaje, valorActual);

    if (texto === null) return null;

    const numero = Number(texto.replace(",", "."));

    if (!Number.isFinite(numero)) {
        alert("Debe ingresar un número válido.");
        return null;
    }

    return numero;
}

function actualizarNombresCategorias(): void {
    nombresCategorias = categorias
        .filter((categoria) => categoria.deleted !== true)
        .map((categoria) => categoria.name);
}

function pedirCategoria(valorActual = ""): string | null {
    const opciones = nombresCategorias.join(" / ");
    const categoria = pedirTexto(`Categoría (${opciones})`, valorActual);

    if (categoria === null) return null;

    if (!nombresCategorias.includes(categoria)) {
        alert("La categoría ingresada no existe. Podés crearla desde la pestaña Categorías.");
        return null;
    }

    return categoria;
}

function nuevoProducto(): void {
    const name = pedirTexto("Nombre del producto");
    if (!name) return;

    const description = pedirTexto("Descripción", "") ?? "";
    const price = pedirNumero("Precio", "0");
    if (price === null || price <= 0) {
        alert("El precio debe ser mayor a 0.");
        return;
    }

    const category = pedirCategoria();
    if (!category) return;

    const stock = pedirNumero("Stock", "0");
    if (stock === null || stock < 0) {
        alert("El stock no puede ser negativo.");
        return;
    }

    const image = pedirTexto("URL de imagen", "") ?? "";
    const available = window.confirm("¿El producto está disponible?");
    const maxId = productos.reduce((max, producto) => Math.max(max, producto.id), 0);

    productos.push({
        id: maxId + 1,
        name,
        description,
        price,
        category,
        image,
        stock,
        available,
        deleted: false
    });

    guardarProductosAdmin(productos);
    renderizarProductos();
}

function editarProducto(id: number): void {
    const producto = productos.find((item) => item.id === id);
    if (!producto) return;

    const name = pedirTexto("Nuevo nombre", producto.name);
    if (name === null || name === "") return;

    const description = pedirTexto("Nueva descripción", producto.description);
    if (description === null) return;

    const price = pedirNumero("Nuevo precio", String(producto.price));
    if (price === null || price <= 0) {
        alert("El precio debe ser mayor a 0.");
        return;
    }

    const category = pedirCategoria(producto.category);
    if (!category) return;

    const stock = pedirNumero("Nuevo stock", String(producto.stock));
    if (stock === null || stock < 0) {
        alert("El stock no puede ser negativo.");
        return;
    }

    const image = pedirTexto("Nueva URL de imagen", producto.image);
    if (image === null) return;

    producto.name = name;
    producto.description = description;
    producto.price = price;
    producto.category = category;
    producto.stock = stock;
    producto.image = image;
    producto.available = window.confirm("Aceptar = disponible / Cancelar = no disponible");

    guardarProductosAdmin(productos);
    renderizarProductos();
}

function eliminarProducto(id: number): void {
    const producto = productos.find((item) => item.id === id);
    if (!producto) return;

    const confirma = window.confirm(`¿Eliminar el producto ${producto.name}?`);
    if (!confirma) return;

    producto.deleted = true;
    guardarProductosAdmin(productos);
    renderizarProductos();
}

function nuevaCategoria(): void {
    const name = pedirTexto("Nombre de la categoría");
    if (!name) return;

    const description = pedirTexto("Descripción", "") ?? "";
    const image = pedirTexto("URL de imagen", "") ?? "";
    const maxId = categorias.reduce((max, categoria) => Math.max(max, categoria.id), 0);

    categorias.push({
        id: maxId + 1,
        name,
        description,
        image,
        deleted: false
    });

    actualizarNombresCategorias();
    guardarCategoriasAdmin(categorias);
    renderizarCategorias();
}

function editarCategoria(id: number): void {
    const categoria = categorias.find((item) => item.id === id);
    if (!categoria) return;

    const nombreAnterior = categoria.name;
    const name = pedirTexto("Nuevo nombre", categoria.name);
    if (name === null || name === "") return;

    const description = pedirTexto("Nueva descripción", categoria.description);
    if (description === null) return;

    const image = pedirTexto("Nueva URL de imagen", categoria.image);
    if (image === null) return;

    categoria.name = name;
    categoria.description = description;
    categoria.image = image;

    if (nombreAnterior !== name) {
        productos = productos.map((producto) => {
            return producto.category === nombreAnterior ? { ...producto, category: name } : producto;
        });
        guardarProductosAdmin(productos);
        renderizarProductos();
    }

    actualizarNombresCategorias();
    guardarCategoriasAdmin(categorias);
    renderizarCategorias();
}

function eliminarCategoria(id: number): void {
    const categoria = categorias.find((item) => item.id === id);
    if (!categoria) return;

    const productosAsociados = productos.filter((producto) => {
        return producto.category === categoria.name && producto.deleted !== true;
    });

    if (productosAsociados.length > 0) {
        alert("No se puede eliminar una categoría con productos activos asociados.");
        return;
    }

    const confirma = window.confirm(`¿Eliminar la categoría ${categoria.name}?`);
    if (!confirma) return;

    categoria.deleted = true;
    actualizarNombresCategorias();
    guardarCategoriasAdmin(categorias);
    renderizarCategorias();
}

function activarTab(tab: TabGestion): void {
    const panelProductos = document.getElementById("panel-productos");
    const panelCategorias = document.getElementById("panel-categorias");
    const tabProductos = document.getElementById("tab-productos");
    const tabCategorias = document.getElementById("tab-categorias");

    const mostrandoProductos = tab === "productos";

    panelProductos?.classList.toggle("activo", mostrandoProductos);
    panelCategorias?.classList.toggle("activo", !mostrandoProductos);
    tabProductos?.classList.toggle("activo", mostrandoProductos);
    tabCategorias?.classList.toggle("activo", !mostrandoProductos);

    if (panelProductos) panelProductos.hidden = !mostrandoProductos;
    if (panelCategorias) panelCategorias.hidden = mostrandoProductos;

    window.location.hash = mostrandoProductos ? "productos" : "categorias";
}

function configurarTabs(): void {
    document.querySelectorAll<HTMLButtonElement>(".tab-btn").forEach((boton) => {
        boton.addEventListener("click", () => {
            const tab = boton.dataset.tab === "categorias" ? "categorias" : "productos";
            activarTab(tab);
        });
    });

    if (window.location.hash === "#categorias") {
        activarTab("categorias");
    }
}

async function iniciarGestionCatalogo(): Promise<void> {
    try {
        productos = await obtenerProductosTodos();
        categorias = await obtenerCategoriasCompletas();
        nombresCategorias = await obtenerCategorias();

        renderizarProductos();
        renderizarCategorias();
        configurarTabs();
        configurarLogout();

        const botonNuevo = document.getElementById("btn-nuevo-producto") as HTMLButtonElement | null;
        const botonNuevaCategoria = document.getElementById("btn-nueva-categoria") as HTMLButtonElement | null;

        botonNuevo?.addEventListener("click", nuevoProducto);
        botonNuevaCategoria?.addEventListener("click", nuevaCategoria);
    } catch (error) {
        console.error(error);
        alert("No se pudo cargar la gestión del catálogo.");
    }
}

iniciarGestionCatalogo();
