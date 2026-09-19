export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// retrieve the cart as an array (empty if nothing has been added yet)
export function getCartItems() {
  const cart = getLocalStorage("so-cart");
  if (!cart) return [];
  // older versions saved a single product object instead of an array
  return Array.isArray(cart) ? cart : [cart];
}
// show the number of items in the cart as a superscript on the backpack icon
export function updateCartCount() {
  const cartLink = qs(".cart a");
  if (!cartLink) return;
  let badge = qs(".cart-count", cartLink);
  if (!badge) {
    badge = document.createElement("sup");
    badge.classList.add("cart-count");
    cartLink.appendChild(badge);
  }
  const count = getCartItems().length;
  badge.textContent = count;
  badge.hidden = count === 0;
}
// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// get the product id from the query string
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(template, parentElement, list, position = "afterbegin", clear = false) {
  const htmlStrings = list.map(template);
  // if clear is true we need to clear out the contents of the parent.
  if (clear) {
    parentElement.innerHTML = "";
  }
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// works for any product with FinalPrice and SuggestedRetailPrice;
// returns null when the product is not discounted
export function getDiscount(product) {
  const retail = Number(product.SuggestedRetailPrice);
  const final = Number(product.FinalPrice);
  if (!retail || !final || final >= retail) return null;
  return {
    retail: retail.toFixed(2),
    amount: (retail - final).toFixed(2),
    percent: Math.round(((retail - final) / retail) * 100),
  };
}
