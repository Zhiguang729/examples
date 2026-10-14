import { Router } from "express";
import "express-async-errors";

import { ensureLoggedIn } from "../ensureLoggedIn";

import { createOrder } from "./createOrder";
import { listOrders } from "./listOrders";
import { editOrder } from "./editOrder";

export const orderRouter = Router();

orderRouter.use(ensureLoggedIn("user"));

orderRouter.post("/create", createOrder);
orderRouter.get("/list", listOrders);
orderRouter.patch("/edit/:id", editOrder);
