import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import HomePage from "../../features/home/HomePage";
import ProductDashboard from "../../features/products/dashboard/ProductDashboard";
import LoginForm from "../../features/account/LoginForm";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <HomePage />,
            },
            {
                path: "products",
                element: <ProductDashboard />,
            },
            // {
            //     path: "products/:id",
            //     element: <ProductDetail />,
            // }



            {
                path: "login",
                element: <LoginForm />,
            }
        ],
    },
]);