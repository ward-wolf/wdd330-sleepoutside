import {
  getCartItems,
  renderListWithTemplate,
  setLocalStorage,
  updateCartCount,
} from "./utils.mjs";

function cartItemTemplate(item) {
  return `
    <li class="cart-card divider">
      <a href="/product_pages/?product=${item.Id}" class="cart-card__image">
        <img src="${item.Images.PrimaryMedium}" alt="${item.Name}">
      </a>
      <a href="/product_pages/?product=${item.Id}">
        <h2 class="card__name">${item.Name}</h2>
      </a>
      <p class="cart-card__color">${item.Colors[0].ColorName}</p>
      <p class="cart-card__quantity">
        <label for="qty-${item.Id}">qty:</label>
        <input type="number" id="qty-${item.Id}" class="cart-card__qty"
          data-id="${item.Id}" value="${item.Quantity}" min="0" step="1">
      </p>
      <p class="cart-card__price">$${(item.FinalPrice * item.Quantity).toFixed(2)}</p>
      <button class="cart-card__remove" data-id="${item.Id}"
        aria-label="Remove ${item.Name} from cart">X</button>
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
    this.renderCart();
    // one listener on the list handles every X, even after re-rendering
    this.listElement.addEventListener("click", (event) => {
      const removeButton = event.target.closest(".cart-card__remove");
      if (removeButton) {
        this.removeItem(removeButton.dataset.id);
      }
    });
    // same idea for the quantity boxes
    this.listElement.addEventListener("change", (event) => {
      const quantityInput = event.target.closest(".cart-card__qty");
      if (quantityInput) {
        this.updateQuantity(quantityInput.dataset.id, quantityInput.value);
      }
    });
  }

  updateQuantity(id, value) {
    const quantity = Number(value);
    // ignore anything that is not a whole number
    if (!Number.isInteger(quantity) || quantity < 0) {
      this.renderCart();
      return;
    }
    // dropping to zero removes the item, like clicking the X
    if (quantity === 0) {
      this.removeItem(id);
      return;
    }

    const list = getCartItems(this.key);
    const item = list.find((cartItem) => cartItem.Id === id);
    if (!item) return;

    item.Quantity = quantity;
    setLocalStorage(this.key, list);
    this.renderCart();
    updateCartCount();
  }

  renderCart() {
    const list = getCartItems(this.key);
    this.renderList(list);
    this.renderTotal(list);
  }

  removeItem(id) {
    const list = getCartItems(this.key);
    // only remove one copy, in case the same product was added twice
    const index = list.findIndex((item) => item.Id === id);
    if (index === -1) return;

    list.splice(index, 1);
    setLocalStorage(this.key, list);
    this.renderCart();
    updateCartCount();
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
    const cartFooter = document.querySelector(".cart-footer");
    // hide the footer again when the last item is removed
    if (list.length === 0) {
      cartFooter.classList.add("hide");
      return;
    }

    const total = list.reduce(
      (sum, item) => sum + Number(item.FinalPrice) * item.Quantity,
      0,
    );
    document.querySelector(".cart-total").innerHTML =
      `Total: <span class="cart-total__amount">$${total.toFixed(2)}</span>`;
    cartFooter.classList.remove("hide");
  }
}
