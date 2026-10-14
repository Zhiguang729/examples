
import { AppBar, Badge, IconButton, Toolbar, Typography } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCartStore } from '../../lib/store/cart.store';


export default function Navbar() {
    const itemCount = useCartStore(
        s => s.items.reduce((sum, i) => sum + i.quantity, 0)
    );
    const toggleDrawer = useCartStore(s => s.toggleDrawer);


    return (
        <AppBar position="sticky" color="inherit" elevation={1}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <Typography fontWeight={800} color="primary">Oriental Pantry</Typography>
                <IconButton color="primary" onClick={() => toggleDrawer(true)}>
                    <Badge badgeContent={itemCount} color="primary">
                        {/* <ShoppingCartIcon /> */}
                        <ShoppingCartIcon fontSize="large" />
                    </Badge>
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}