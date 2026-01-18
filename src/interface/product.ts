import { Database } from '@/types_db';

export type Product = Database['public']['Tables']['product']['Row'] & {
  product_price?: ProductPrice | null;
};

export type ProductPrice = Database['public']['Tables']['product_price']['Row'];

export type CartItem = Database['public']['Tables']['cart']['Row'] & {
  product?: Product | null;
};

export type CartItemWithProduct = CartItem & {
  product: Product;
};

export type ProductWithPrice = Product & {
  product_price: ProductPrice;
};
