import { loadHeaderFooter } from "./utils.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

const element = document.querySelector(".product-list");

const cart = new ShoppingCart("so-cart", element);

cart.init();
