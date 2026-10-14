
import { useLocation, Outlet } from 'react-router'
import { Box, Container, CssBaseline } from '@mui/material'
import HomePage from '../../features/home/HomePage'
import NavBar from './NavBar'
import CartDrawer from '../../features/cart/CartDrawer';
import ProductDetailModal from '../../features/products/ProductDetailModal';

function App() {
  const location = useLocation();
  return (
    <Box>
      <CssBaseline />
      {location.pathname === '/' ? <HomePage /> : (
        <>
          <NavBar />
          <CartDrawer />
          <Container sx={{ mt: 5 }}>
            <Outlet />
            
          </Container>
        </>
      )}
    </Box>
  )
}

export default App
