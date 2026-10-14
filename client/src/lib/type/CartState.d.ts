export type CartState = {
    items: CartItem[];
    drawerOpen: boolean;
    
    
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    updateQuantity: (id: string, quantity: number) => void;
    removeItem: (id: string) => void;
    clearCart: () => void;
    toggleDrawer: (open?: boolean) => void;
    };