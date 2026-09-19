import { getCartItems, updateCartCount } from "./utils.mjs";

function renderCartContents() {
  const cartItems = getCartItems();
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  renderCartTotal(cartItems);
}

function renderCartTotal(cartItems) {
  if (cartItems.length === 0) return;

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.FinalPrice),
    0,
  );
  document.querySelector(".cart-total").innerHTML =
    `Total: <span class="cart-total__amount">$${total.toFixed(2)}</span>`;
  document.querySelector(".cart-footer").classList.remove("hide");
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

renderCartContents();
updateCartCount();
