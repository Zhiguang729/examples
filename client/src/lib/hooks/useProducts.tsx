import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useLocation } from "react-router";
import agent from "../../api/agent";



export const useProducts = (id?: string) => {
    const queryClient = useQueryClient();
    const location = useLocation();

    const {data: products, isPending: isProductsPending} = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            const response = await agent.get<Product[]>('/products');
            return response.data;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !id && location.pathname === '/products',
    })

    const {data: product, isPending: isProductLoading} = useQuery({
        queryKey: ['product', id],
        queryFn: async () => {
            const response = await agent.get<Product>(`/products/${id}`);
            return response.data;
        },
        enabled: !!id,
    })

    const updateProduct = useMutation({
        mutationFn: async (updatedProduct: Product) => {
            const response = await agent.put<Product>('/products', updatedProduct);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    })  

    const createProduct = useMutation({
        mutationFn: async (newProduct: Product) => {
            const response = await agent.post<Product>('/products', newProduct);
            return response.data;
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    })

    const deleteProduct = useMutation({
        mutationFn: async (productId: string) => {
            await agent.delete(`/products/${productId}`);
        },
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['products'] });
        }
    })



    return { 
        products, 
        product,
        isProductsPending,
        isProductLoading,
        updateProduct,
        createProduct,
        deleteProduct
    };
}