import {
    Dialog,
    Box,
    Typography,
    IconButton,
    Button,
    Divider,
  } from '@mui/material';
  import { Close, Add, Remove, ShoppingCart } from '@mui/icons-material';
import { useCartStore } from '../../lib/store/cart.store';
import { useProductDetailModalStore } from '../../lib/store/productDetail.store';
import { useProducts } from '../../lib/hooks/useProducts';
  
  
  export default function ProductDetailModal() {
    const { addItem, drawerOpen } = useCartStore();
    //const [quantity, setQuantity] = useState(1);
    const { open, openModal, closeModal, productId } = useProductDetailModalStore();

    const { product } = useProducts(productId ?? undefined);    

    if (!product) {
      return <Typography>Product not found</Typography>;
    }

    return (
      <Dialog
        open={open}
        onClose={closeModal}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '16px',
            overflow: 'hidden',
            backgroundColor: '#FAF8F5',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Image */}
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              height: { xs: 300, md: 500 },
              position: 'relative',
            }}
          >
            <Box
              component="img"
              //src={product.image}
              alt={product.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <IconButton
              onClick={closeModal}
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: 'rgba(255,255,255,0.9)',
                '&:hover': { backgroundColor: '#fff' },
              }}
            >
              <Close />
            </IconButton>
          </Box>
  
          {/* Content */}
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              p: 4,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Manrope, sans-serif',
                fontSize: '12px',
                color: '#888',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                mb: 1,
              }}
            >
              {product.category1}
            </Typography>
  
            <Typography
              variant="h4"
              sx={{
                fontFamily: 'Newsreader, serif',
                fontWeight: 700,
                color: '#2D2A26',
                mb: 2,
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </Typography>
  
            <Typography
              sx={{
                fontFamily: 'Newsreader, serif',
                fontWeight: 700,
                fontSize: '28px',
                color: '#D32F2F',
                mb: 2,
              }}
            >
              ${product.price.toFixed(2)}
            </Typography>
  
            <Box sx={{ mt: 'auto', pt: 3 }}>
              <Typography
                sx={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: '14px',
                  color: product.stock > 10 ? '#4CAF50' : '#FF9800',
                  fontWeight: 500,
                  mb: 2,
                }}
              >
                {product.stock > 10
                  ? `${product.stock} in stock`
                  : `Only ${product.stock} left in stock`}
              </Typography>
  
              {/* <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#fff',
                    borderRadius: '8px',
                    border: '1px solid #E8E6E3',
                  }}
                >
                  <IconButton
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    sx={{ color: '#888' }}
                  >
                    <Remove />
                  </IconButton>
                  <Typography
                    sx={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: 600,
                      minWidth: 40,
                      textAlign: 'center',
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    sx={{ color: '#888' }}
                  >
                    <Add />
                  </IconButton>
                </Box>
              </Box> */}
  
              <Button
                fullWidth
                variant="contained"
                startIcon={<ShoppingCart />}
                onClick={() => addItem(product)}
                sx={{
                  backgroundColor: '#D32F2F',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: '8px',
                  py: 1.5,
                  fontSize: '16px',
                  '&:hover': {
                    backgroundColor: '#B71C1C',
                  },
                  '&:active': {
                    transform: 'scale(0.98)',
                  },
                }}
              >
                Add to Cart — ${(product.price).toFixed(2)}
              </Button>
            </Box>
          </Box>
        </Box>
      </Dialog>
    );
  }