import type { Product } from "../types/product.ts";
import type { IUser } from "../types/IUser.ts";
import type { ICategoria } from "../types/categoria.ts";

const PRODUCTOS_LOCAL_KEY = "foodstore_productos_admin";
const CATEGORIAS_LOCAL_KEY = "foodstore_categorias_admin";

async function fetchJson<T>(url: string): Promise<T> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`No se pudieron cargar los datos desde ${url}.`);
  }

  return response.json() as Promise<T>;
}

function leerLocalStorage<T>(key: string): T[] | null {
  const texto = localStorage.getItem(key);

  if (!texto) return null;

  try {
    return JSON.parse(texto) as T[];
  } catch {
    return null;
  }
}

export function guardarProductosAdmin(productos: Product[]): void {
  localStorage.setItem(PRODUCTOS_LOCAL_KEY, JSON.stringify(productos));
}

export function guardarCategoriasAdmin(categorias: ICategoria[]): void {
  localStorage.setItem(CATEGORIAS_LOCAL_KEY, JSON.stringify(categorias));
}

export async function obtenerProductosTodos(): Promise<Product[]> {
  const productosLocales = leerLocalStorage<Product>(PRODUCTOS_LOCAL_KEY);

  if (productosLocales) {
    return productosLocales;
  }

  return fetchJson<Product[]>("/data/productos.json");
}

export async function obtenerProductos(): Promise<Product[]> {
  const productos = await obtenerProductosTodos();

  return productos.filter((producto) => {
    const estaDisponible = producto.available !== false;
    const noEstaEliminado = producto.deleted !== true;

    return estaDisponible && noEstaEliminado;
  });
}

export async function obtenerCategoriasCompletas(): Promise<ICategoria[]> {
  const categoriasLocales = leerLocalStorage<ICategoria>(CATEGORIAS_LOCAL_KEY);

  if (categoriasLocales) {
    return categoriasLocales;
  }

  return fetchJson<ICategoria[]>("/data/categorias.json");
}

export async function obtenerCategorias(): Promise<string[]> {
  const categorias = await obtenerCategoriasCompletas();

  return categorias
    .filter((categoria) => categoria.deleted !== true)
    .map((categoria) => categoria.name);
}

// Login lee los usuarios desde el JSON con fetch().
export async function obtenerUsuarios(): Promise<IUser[]> {
  return fetchJson<IUser[]>("/data/usuarios.json");
}
