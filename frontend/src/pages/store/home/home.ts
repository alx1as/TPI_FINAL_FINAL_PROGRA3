import { obtenerProductos, obtenerCategorias } from "../../../data/data";
import type { Product, CartItem } from "../../../types/product";
import { configurarLogout, getCurrentUser } from "../../../utils/auth";

let productosCargados: Product[] = [];
let categoriaActual = "TODOS";
let textoBusquedaActual = "";
let ordenActual = "default";

function esAdmin(): boolean {
  return getCurrentUser()?.role === "admin";
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

function configurarNavegacionPorRol(): void {
  const adminLink = document.getElementById("admin-link") as HTMLAnchorElement | null;
  const cartLink = document.getElementById("cart-link") as HTMLAnchorElement | null;
  const ordersLink = document.getElementById("orders-link") as HTMLAnchorElement | null;
  const avisoAdmin = document.getElementById("admin-store-notice");

  if (!esAdmin()) return;

  adminLink?.removeAttribute("hidden");
  cartLink?.setAttribute("hidden", "true");
  ordersLink?.setAttribute("hidden", "true");
  avisoAdmin?.removeAttribute("hidden");
}

function actualizarContadorCarrito(): void {
  const contador = document.getElementById("cart-count");

  if (!contador || esAdmin()) return;

  const cantidad = obtenerCarrito().reduce((total, item) => total + item.quantity, 0);
  contador.textContent = String(cantidad);
}

function aplicarFiltrosYOrden(): Product[] {
  let productos = [...productosCargados];

  if (categoriaActual !== "TODOS") {
    productos = productos.filter((producto) => producto.category === categoriaActual);
  }

  if (textoBusquedaActual) {
    productos = productos.filter((producto) => {
      return producto.name.toLowerCase().includes(textoBusquedaActual);
    });
  }

  productos.sort((a, b) => {
    switch (ordenActual) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return productos;
}

function actualizarVista(): void {
  const productos = aplicarFiltrosYOrden();
  renderizarProductos(productos);
  actualizarContadorProductos(productos.length);
  marcarCategoriaActiva();
}

function actualizarContadorProductos(cantidad: number): void {
  const contador = document.getElementById("contador-productos");
  if (!contador) return;
  contador.textContent = cantidad === 1 ? "1 producto" : `${cantidad} productos`;
}

function formatearPrecio(precio: number): string {
  return `$${precio.toLocaleString("es-AR")}`;
}

function renderizarProductos(productos: Product[]): void {
  const contenedorProductos = document.getElementById("contenedor-productos");

  if (!contenedorProductos) return;

  contenedorProductos.innerHTML = "";

  if (productos.length === 0) {
    contenedorProductos.innerHTML = `
      <div class="estado-vacio">
        <p>No se encontraron productos con esos criterios.</p>
      </div>
    `;
    return;
  }

  productos.forEach((producto) => {
    const articuloProducto = document.createElement("article");
    articuloProducto.classList.add("producto-item");

    const botonAgregar = esAdmin()
      ? ""
      : `<button class="agregar-btn" type="button">Agregar</button>`;

    articuloProducto.innerHTML = `
      <img src="${producto.image}" alt="${producto.name}">
      <div class="producto-contenido">
        <span class="producto-categoria">${producto.category}</span>
        <h3>${producto.name}</h3>
        <p>${producto.description}</p>
        <div class="producto-meta">
          <span>Disponible para pedir</span>
          <strong>${formatearPrecio(producto.price)}</strong>
        </div>
        <div class="producto-acciones">
          <a class="detalle-link" href="../productDetail/productDetail.html?id=${producto.id}">Ver detalle</a>
          ${botonAgregar}
        </div>
      </div>
    `;

    const boton = articuloProducto.querySelector(".agregar-btn") as HTMLButtonElement | null;

    boton?.addEventListener("click", () => {
      agregarAlCarrito(producto);
    });

    contenedorProductos.appendChild(articuloProducto);
  });
}

async function renderizarCategorias(): Promise<void> {
  const listaCategorias = document.getElementById("lista-categorias");

  if (!listaCategorias) return;

  listaCategorias.innerHTML = "";
  const categorias = await obtenerCategorias();

  const itemTodos = document.createElement("li");
  itemTodos.textContent = "Todos los productos";
  itemTodos.classList.add("categoria-item");
  itemTodos.dataset.categoria = "TODOS";

  itemTodos.addEventListener("click", () => {
    categoriaActual = "TODOS";
    actualizarVista();
  });

  listaCategorias.appendChild(itemTodos);

  categorias.forEach((categoria) => {
    const itemCategoria = document.createElement("li");
    itemCategoria.classList.add("categoria-item");
    itemCategoria.textContent = categoria;
    itemCategoria.dataset.categoria = categoria;

    itemCategoria.addEventListener("click", () => {
      categoriaActual = categoria;
      actualizarVista();
    });

    listaCategorias.appendChild(itemCategoria);
  });

  marcarCategoriaActiva();
}

function marcarCategoriaActiva(): void {
  document.querySelectorAll(".categoria-item").forEach((item) => {
    const elemento = item as HTMLElement;
    elemento.classList.toggle("activa", elemento.dataset.categoria === categoriaActual);
  });
}

function configurarBusqueda(): void {
  const formularioBuscar = document.getElementById("form-busqueda") as HTMLFormElement | null;
  const inputBuscar = document.getElementById("input-busqueda") as HTMLInputElement | null;

  if (!formularioBuscar || !inputBuscar) return;

  const input = inputBuscar;

  function buscarProductosPorNombre(): void {
    textoBusquedaActual = input.value.trim().toLowerCase();
    actualizarVista();
  }

  input.addEventListener("input", buscarProductosPorNombre);

  formularioBuscar.addEventListener("submit", (evento) => {
    evento.preventDefault();
    buscarProductosPorNombre();
  });
}

function configurarOrdenamiento(): void {
  const selectOrden = document.getElementById("orden-productos") as HTMLSelectElement | null;

  if (!selectOrden) return;

  selectOrden.addEventListener("change", () => {
    ordenActual = selectOrden.value;
    actualizarVista();
  });
}

function agregarAlCarrito(productoElegido: Product): void {
  if (esAdmin()) {
    alert("El administrador puede revisar la tienda, pero las compras pertenecen al rol cliente.");
    return;
  }

  const carrito = obtenerCarrito();

  const productoExistente = carrito.find((item) => {
    return item.product.id === productoElegido.id;
  });

  if (productoExistente && productoExistente.quantity >= productoElegido.stock) {
    alert("No hay más stock disponible para este producto.");
    return;
  }

  if (!productoExistente && productoElegido.stock <= 0) {
    alert("Este producto no tiene stock disponible.");
    return;
  }

  if (productoExistente) {
    productoExistente.quantity += 1;
  } else {
    carrito.push({ product: productoElegido, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(carrito));
  actualizarContadorCarrito();
  alert("Producto agregado con éxito.");
}

async function iniciarHome(): Promise<void> {
  try {
    configurarNavegacionPorRol();
    productosCargados = await obtenerProductos();
    await renderizarCategorias();
    actualizarVista();
    configurarBusqueda();
    configurarOrdenamiento();
    configurarLogout();
    actualizarContadorCarrito();
  } catch (error) {
    const contenedorProductos = document.getElementById("contenedor-productos");

    if (contenedorProductos) {
      contenedorProductos.innerHTML = "<p>No se pudieron cargar los productos.</p>";
    }

    console.error(error);
  }
}

iniciarHome();
