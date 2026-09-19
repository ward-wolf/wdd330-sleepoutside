import { getCartItems, renderListWithTemplate } from "./utils.mjs";

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="/product_pages/?product=${item.Id}" class="cart-card__image">
        <img src="${item.Image}" alt="${item.Name}">
      </a>
      <a href="/product_pages/?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">qty: 1</p>
      <p class="cart-card__price">$${item.FinalPrice}</p>
    </li>
    `;
}

export default class ShoppingCart {
  constructor(key, listElement) {
    // the local storage key and list element are passed in so the class
    // can be reused, the same way ProductList takes a category and element
    this.key = key;
    this.listElement = listElement;
  }

  init() {
    // local storage is synchronous, so unlike ProductList there is no await
    const list = getCartItems(this.key);
    this.renderList(list);
    this.renderTotal(list);
  }

  renderList(list) {
    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }

  renderTotal(list) {
    // leave the cart footer hidden when the cart is empty
    if (list.length === 0) return;

    const total = list.reduce((sum, item) => sum + Number(item.FinalPrice), 0);
    document.querySelector(".cart-total").innerHTML =
      `Total: <span class="cart-total__amount">$${total.toFixed(2)}</span>`;
    document.querySelector(".cart-footer").classList.remove("hide");
  }
}
