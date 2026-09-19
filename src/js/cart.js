import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./Alert.mjs";
import ShoppingCart from "./ShoppingCart.mjs";

loadHeaderFooter();

const alerts = new Alert();

alerts.init();

const element = document.querySelector(".product-list");

const cart = new ShoppingCart("so-cart", element);

cart.init();
