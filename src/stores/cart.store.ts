import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ProductWithPrice } from '@/interface/product';

export interface CartItem {
  id: string; // ID único generado localmente
  productId: number;
  product: ProductWithPrice;
  quantity: number;
  addedAt: string; // ISO timestamp
}

interface CartStore {
  items: CartItem[];
  addItem: (product: ProductWithPrice, quantity?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotalPoints: () => number;
  getTotalStars: () => number;
  getTotalARS: () => number;
  getItemByProductId: (productId: number) => CartItem | undefined;
}

const generateItemId = () => `cart-item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const state = get();
        const existingItem = state.items.find(item => item.productId === product.id);

        if (existingItem) {
          // Si el producto ya está en el carrito, actualizar la cantidad
          const newQuantity = existingItem.quantity + quantity;

          // Verificar stock
          if (product.quantity !== null && newQuantity > product.quantity) {
            throw new Error('Stock insuficiente');
          }

          set({
            items: state.items.map(item =>
              item.id === existingItem.id
                ? { ...item, quantity: newQuantity }
                : item
            ),
          });
        } else {
          // Verificar stock
          if (product.quantity !== null && quantity > product.quantity) {
            throw new Error('Stock insuficiente');
          }

          // Agregar nuevo item
          const newItem: CartItem = {
            id: generateItemId(),
            productId: product.id,
            product,
            quantity,
            addedAt: new Date().toISOString(),
          };

          set({
            items: [...state.items, newItem],
          });
        }
      },

      removeItem: (itemId) => {
        set({
          items: get().items.filter(item => item.id !== itemId),
        });
      },

      updateQuantity: (itemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(itemId);
          return;
        }

        const state = get();
        const item = state.items.find(i => i.id === itemId);

        if (!item) return;

        // Verificar stock
        if (item.product.quantity !== null && quantity > item.product.quantity) {
          throw new Error('Stock insuficiente');
        }

        set({
          items: state.items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          ),
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getTotalPoints: () => {
        return get().items.reduce((sum, item) => {
          const price = item.product.product_price;
          return sum + (price?.price_points || 0) * item.quantity;
        }, 0);
      },

      getTotalStars: () => {
        return get().items.reduce((sum, item) => {
          const price = item.product.product_price;
          return sum + (price?.price_star || 0) * item.quantity;
        }, 0);
      },

      getTotalARS: () => {
        return get().items.reduce((sum, item) => {
          const price = item.product.product_price;
          return sum + (price?.price_ars || 0) * item.quantity;
        }, 0);
      },

      getItemByProductId: (productId) => {
        return get().items.find(item => item.productId === productId);
      },
    }),
    {
      name: 'store-cart',
      version: 1,
    }
  )
);
