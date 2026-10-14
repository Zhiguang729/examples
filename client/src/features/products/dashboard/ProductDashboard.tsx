import { Grid } from "@mui/material";
import ProductList from "./ProductList";
import ProductDetailModal from "../ProductDetailModal";


export default function ProductDashboard() {
  return (
    <Grid container spacing={8}>
        <ProductList />
        <ProductDetailModal />
    </Grid>

  )
}
