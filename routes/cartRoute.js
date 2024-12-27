// import express from "express"
// import  {addToCart,removeFromCart,getCart} from "../controllers/cartControllers.js"
// import authMiddleware from "../middleware/auth.js";

// cartRouter = express.Router();

// cartRouter.post("/add",authMiddleware, addToCart)
// cartRouter.post("/remove",authMiddleware, removeFromCart)
// cartRouter.post("/add",authMiddleware, getCart)

// export default cartRouter;

import express from "express";
import { addToCart, removeFromCart, getCart } from "../controllers/cartControllers.js";
import authMiddleware from "../middleware/auth.js";

const cartRouter = express.Router(); // Declare cartRouter with const

cartRouter.post("/add", authMiddleware, addToCart); // POST for adding to cart
cartRouter.post("/remove", authMiddleware, removeFromCart); // POST for removing from cart
 cartRouter.post("/get", authMiddleware, getCart); // GET for retrieving the cart
// cartRouter.get("/get", authMiddleware, getCart); // GET for retrieving the cart

export default cartRouter;
