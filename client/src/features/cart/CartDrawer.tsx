import { Drawer, Box, Typography, IconButton, Button, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCartStore } from '../../lib/store/cart.store';
import { Add, Close, Delete, Remove } from '@mui/icons-material';


export default function CartDrawer() {
  const {
    items,
    drawerOpen,
    toggleDrawer,
    removeItem,
    clearCart,
    updateQuantity,
  } = useCartStore();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}  slotProps={{ paper:{
        sx: {
            width: { xs: '100%', sm: 420 },
            backgroundColor: 'rgba(250, 248, 245, 0.95)',
            backdropFilter: 'blur(8px)',
          },
    }
        
      }}>
      <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
        }}>
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 3,
                borderBottom: '1px solid #E8E6E3',
            }}
            >
            <Typography
                variant="h5"
                sx={{
                fontFamily: 'Newsreader, serif',
                fontWeight: 600,
                color: '#2D2A26',
                }}
            >
                Your Cart
            </Typography>
            <IconButton onClick={() => toggleDrawer(false)}>
                <Close />
            </IconButton>
        </Box>

        {items.length === 0 ? (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  gap: 2,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: 'Newsreader, serif',
                    fontSize: '20px',
                    color: '#888',
                  }}
                >
                  Your cart is empty
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => toggleDrawer(false)}
                  sx={{
                    backgroundColor: '#D32F2F',
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: '8px',
                    px: 4,
                    '&:hover': {
                      backgroundColor: '#B71C1C',
                    },
                  }}
                >
                  Continue Shopping
                </Button>
              </Box>
            ) : (
              items.map((item) => (
                  <Box
                    sx={{
                      display: 'flex',
                      gap: 2,
                      p: 2,
                      mb: 2,
                      backgroundColor: '#fff',
                      borderRadius: '12px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    }}
                    key={item.id}
                  >
                    <Box
                      component="img"
                      //src={item.product.image}
                      alt={item.name}
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '8px',
                        objectFit: 'cover',
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        sx={{
                          fontFamily: 'Newsreader, serif',
                          fontWeight: 600,
                          color: '#2D2A26',
                          fontSize: '16px',
                          mb: 0.5,
                        }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        sx={{
                          fontFamily: 'Manrope, sans-serif',
                          color: '#D32F2F',
                          fontWeight: 600,
                          fontSize: '15px',
                        }}
                      >
                        ${item.price.toFixed(2)}
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 1,
                        }}
                      >
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          sx={{
                            backgroundColor: '#E8E6E3',
                            '&:hover': { backgroundColor: '#D32F2F', color: '#fff' },
                          }}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography
                          sx={{
                            fontFamily: 'Manrope, sans-serif',
                            fontWeight: 600,
                            minWidth: 30,
                            textAlign: 'center',
                          }}
                        >
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          sx={{
                            backgroundColor: '#E8E6E3',
                            '&:hover': { backgroundColor: '#D32F2F', color: '#fff' },
                          }}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => removeItem(item.id)}
                          sx={{
                            ml: 'auto',
                            color: '#888',
                            '&:hover': { color: '#D32F2F' },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
            
              ))
            )}

        <Typography mt={3} fontWeight={700}>
          Subtotal: ${subtotal.toFixed(2)}
        </Typography>

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2 }}
        >
          Proceed to Checkout
        </Button>

        <Button
          fullWidth
          color="inherit"
          sx={{ mt: 1 }}
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </Box>
    </Drawer>
  );
}
