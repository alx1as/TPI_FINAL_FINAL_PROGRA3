import { configurarLogout } from "../../../utils/auth";
import { guardarCategoriasAdmin, obtenerCategoriasCompletas } from "../../../data/data";
import type { ICategoria } from "../../../types/categoria";

let categorias: ICategoria[] = [];

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
                <button class="btn-editar" data-id="${categoria.id}" type="button">Editar</button>
                <button class="btn-eliminar" data-id="${categoria.id}" type="button">Eliminar</button>
            </td>
        `;

        tabla.appendChild(fila);
    });

    configurarBotones();
}

function configurarBotones(): void {
    document.querySelectorAll(".btn-editar").forEach((boton) => {
        boton.addEventListener("click", () => {
            const id = Number((boton as HTMLButtonElement).dataset.id);
            editarCategoria(id);
        });
    });

    document.querySelectorAll(".btn-eliminar").forEach((boton) => {
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

    guardarCategoriasAdmin(categorias);
    renderizarCategorias();
}

function editarCategoria(id: number): void {
    const categoria = categorias.find((item) => item.id === id);
    if (!categoria) return;

    const name = pedirTexto("Nuevo nombre", categoria.name);
    if (name === null || name === "") return;

    const description = pedirTexto("Nueva descripción", categoria.description);
    if (description === null) return;

    const image = pedirTexto("Nueva URL de imagen", categoria.image);
    if (image === null) return;

    categoria.name = name;
    categoria.description = description;
    categoria.image = image;

    guardarCategoriasAdmin(categorias);
    renderizarCategorias();
}

function eliminarCategoria(id: number): void {
    const categoria = categorias.find((item) => item.id === id);
    if (!categoria) return;

    const confirma = window.confirm(`¿Eliminar la categoría ${categoria.name}?`);
    if (!confirma) return;

    categoria.deleted = true;
    guardarCategoriasAdmin(categorias);
    renderizarCategorias();
}

async function iniciarCategorias(): Promise<void> {
    try {
        categorias = await obtenerCategoriasCompletas();
        renderizarCategorias();
        configurarLogout();

        const botonNueva = document.getElementById("btn-nueva-categoria") as HTMLButtonElement | null;
        botonNueva?.addEventListener("click", nuevaCategoria);
    } catch (error) {
        console.error(error);
        alert("No se pudieron cargar las categorías.");
    }
}

iniciarCategorias();
