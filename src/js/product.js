import { getCartItems, setLocalStorage, updateCartCount } from "./utils.mjs";
import ProductData from "./ProductData.mjs";

const dataSource = new ProductData("tents");

function addProductToCart(product) {
  const cartItems = getCartItems();
  cartItems.push(product);
  setLocalStorage("so-cart", cartItems);
  updateCartCount();
}
// add to cart button event handler
async function addToCartHandler(e) {
  const product = await dataSource.findProductById(e.target.dataset.id);
  addProductToCart(product);
}

updateCartCount();

// add listener to Add to Cart button
document
  .getElementById("addToCart")
  .addEventListener("click", addToCartHandler);
