export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;

  //campos que agrego para el tpi:
  //agregar en los json también.
  stock: number;
  available: boolean;
  deleted: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
/* product guarda el producto completo
quantity guarda cuántas unidades tiene en el carrito */