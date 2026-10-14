import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartState } from '../type/CartState';

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
        items: [],
        drawerOpen: false,


        addItem: (item) => {
            const existing = get().items.find(i => i.id === item.id);


            if (existing) {
                set({
                    items: get().items.map(i =>
                        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
                    )
                });
                } else {
                set({ items: [...get().items, { ...item, quantity: 1 }] });
            }
            //set({ drawerOpen: true }); // UX: open cart on add
        },


        updateQuantity: (id, quantity) =>
            set({
                items: get().items.map(i =>
                    i.id === id ? { ...i, quantity } : i
                )
            }),


        removeItem: (id) =>
            set({ items: get().items.filter(i => i.id !== id) }),


        clearCart: () => set({ items: [] }),


        toggleDrawer: (open) =>
            set({ drawerOpen: open ?? !get().drawerOpen })
        
    }),
        { name: 'asian-ecommerce-cart' }
    )
);