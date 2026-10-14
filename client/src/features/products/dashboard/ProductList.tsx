import React from 'react'
import { useProducts } from '../../../lib/hooks/useProducts';
import { Box, Typography } from '@mui/material';
import ProductCard from './ProductCard';

export default function ProductList() {
  const { products, isProductsPending } = useProducts();

  if (!products || isProductsPending) return <Typography>Loading products...</Typography>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </Box>
  )
}
