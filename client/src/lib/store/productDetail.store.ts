import { create } from 'zustand';

type ProductDetailModalState = {
  open: boolean;
  productId: string | null;
  openModal: (productId: string) => void;
  closeModal: () => void;
};

export const useProductDetailModalStore = create<ProductDetailModalState>((set) => ({
  open: false,
  productId: null,
  openModal: (productId) => set({ open: true, productId }),
  closeModal: () => set({ open: false, productId: null }),
}));