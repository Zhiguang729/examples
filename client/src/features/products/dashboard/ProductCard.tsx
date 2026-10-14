import { Box, Button, Card, CardContent, CardMedia, IconButton, Stack, Typography } from '@mui/material';
import { useCartStore } from '../../../lib/store/cart.store';
import AddIcon from '@mui/icons-material/Add';
import { Visibility, Add } from '@mui/icons-material';
import { useProductDetailModalStore } from '../../../lib/store/productDetail.store';
import { useState } from 'react';


{/* <CardMedia component="img" height={200} image={product.image} /> */}
      {/* <CardContent>
        <Typography fontWeight={600} variant="h5" component="h2">
          {product.name}
        </Typography>
        <Typography color="primary" fontWeight={700} variant="h5" component="h2">
          {product.price.toLocaleString('en-US', { style: 'currency', currency: 'NZD' })}
        </Typography>
        <Box display="flex" justifyContent="flex-end">
          <IconButton
            color="primary"
            onClick={() => addItem(product)}
          >
            <AddIcon />
          </IconButton>
        </Box>

      </CardContent> */}
// type Props = {
//     product: Product;
// }

// export default function ProductCard({ product }: Props) {
//   const addItem = useCartStore(state => state.addItem);

//   return (
//     <Card
//       sx={{
//         backgroundColor: '#fff',
//             borderRadius: '16px',
//             overflow: 'hidden',
//             transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
//             boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
//             cursor: 'pointer',
//             '&:hover': {
//               transform: 'translateY(-4px)',
//               boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
//         },
//       }}
//     >
      
//       <Box
//             sx={{
//               position: 'relative',
//               height: 220,
//               overflow: 'hidden',
//             }}
//           >
//             <Box
//               component="img"
//               //src={product.image}
//               alt={product.name}
//               sx={{
//                 width: '100%',
//                 height: '100%',
//                 objectFit: 'cover',
//                 transition: 'transform 0.3s ease',
//                 '&:hover': {
//                   transform: 'scale(1.05)',
//                 }
//               }}
//             />
        
//             {/* Hover Actions */}
//             <Box
//               sx={{
//                 position: 'absolute',
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 p: 1.5,
//                 display: 'flex',
//                 gap: 1,
//                 justifyContent: 'center',
//                 backgroundColor: 'rgba(0,0,0,0.3)',
//                 backdropFilter: 'blur(4px)',
//                 //transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
//                 transition: 'transform 0.3s ease',
//               }}
//             >
//               <Button
//                 startIcon={<Visibility />}
//                 //onClick={() => setModalOpen(true)}
//                 sx={{
//                   backgroundColor: '#fff',
//                   color: '#2D2A26',
//                   fontFamily: 'Manrope, sans-serif',
//                   fontWeight: 500,
//                   textTransform: 'none',
//                   borderRadius: '8px',
//                   px: 2,
//                   '&:hover': {
//                     backgroundColor: '#fff',
//                   },
//                 }}
//               >
//                 Quick View
//               </Button>
//               <IconButton
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   addItem(product);
//                 }}
//                 sx={{
//                   backgroundColor: '#D32F2F',
//                   color: '#fff',
//                   '&:hover': {
//                     backgroundColor: '#B71C1C',
//                   },
//                 }}
//               >
//                 <Add />
//               </IconButton>
//             </Box>
//           </Box>

//           {/* Content */}
//           <Box sx={{ p: 2.5 }}>
//             <Typography
//               sx={{
//                 fontFamily: 'Newsreader, serif',
//                 fontWeight: 600,
//                 fontSize: '18px',
//                 color: '#2D2A26',
//                 mb: 1,
//                 lineHeight: 1.3,
//               }}
//             >
//               {product.name}
//             </Typography>
//             <Box
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//               }}
//             >
//               <Typography
//                 sx={{
//                   fontFamily: 'Newsreader, serif',
//                   fontWeight: 700,
//                   fontSize: '20px',
//                   color: '#D32F2F',
//                 }}
//               >
//                 {product.price.toLocaleString('en-US', { style: 'currency', currency: 'NZD' })}
//               </Typography>
//               <Typography
//                 sx={{
//                   fontFamily: 'Manrope, sans-serif',
//                   fontSize: '12px',
//                   color: product.stock > 10 ? '#4CAF50' : '#FF9800',
//                   fontWeight: 500,
//                 }}
//               >
//                 {product.stock > 10 ? 'In Stock' : `Only ${product.stock} left`}
//               </Typography>
//             </Box>
//           </Box>
//     </Card>
//   );
// }


type Props = {
  product: Product;
};

export default function ProductCard({ product }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const openQuickView = useProductDetailModalStore((s) => s.openModal);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
      sx={{
        backgroundColor: '#fff',
            borderRadius: '16px',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }
          }}
      >
      {/* Image */}
      <Box sx={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <Box
          component="img"
          //src={product.image}
          alt={product.name}
          sx={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)'
          }}
        />

        {/* Hover actions */}
        <Box
          sx={{
            position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 1.5,
                px: 3,
                display: 'flex',
                //gap: 1,
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.3)',
                backdropFilter: 'blur(4px)',
                transform: isHovered ? 'translateY(0)' : 'translateY(100%)',
                transition: 'transform 0.3s ease',
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              //width: '100%',
              justifyContent: 'center',
              flexWrap: 'nowrap',
              //marginRight: 3,
              px: 1,
            }}
          >
            <Button
              startIcon={<Visibility />}
              onClick={(e) => {
                e.stopPropagation();
                openQuickView(product.id);
              }}
              sx={{
                bgcolor: '#fff',
                color: '#2D2A26',
                textTransform: 'none',
                borderRadius: 1,
                //px: 2,
                //minWidth: 120,
                flexShrink: 0,
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#fff' },
              }}
            >
              Quick View
            </Button>

            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                addItem(product);
              }}
              sx={{
                bgcolor: '#D32F2F',
                color: '#fff',
                // width: 44,
                // height: 44,
                flexShrink: 0,
                '&:hover': { bgcolor: '#B71C1C' },
              }}
            >
              <Add />
            </IconButton>
          </Stack>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ p: 2 }}>
        <Typography
          sx={{
            fontFamily: 'Newsreader, serif',
            fontWeight: 600,
            fontSize: 18,
            mb: 1,
          }}
        >
          {product.name}
        </Typography>

        <Stack direction="row" justifyContent="space-between">
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 20,
              color: '#D32F2F',
            }}
          >
            {product.price.toLocaleString('en-US', {
              style: 'currency',
              currency: 'NZD',
            })}
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: product.stock > 10 ? '#4CAF50' : '#FF9800',
            }}
          >
            {product.stock > 10
              ? 'In Stock'
              : `Only ${product.stock} left`}
          </Typography>
        </Stack>
      </Box>
    </Card>
  );
}

