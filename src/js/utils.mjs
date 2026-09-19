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
export function getCartItems(key = "so-cart") {
  const cart = getLocalStorage(key);
  if (!cart) return [];
  // older versions saved a single product object instead of an array
  const list = Array.isArray(cart) ? cart : [cart];

  // older versions also repeated an item instead of counting it, so merge
  // any repeats and make sure every item has a Quantity
  const merged = [];
  list.forEach((item) => {
    const existing = merged.find((other) => other.Id === item.Id);
    if (existing) {
      existing.Quantity += Number(item.Quantity) || 1;
    } else {
      merged.push({ ...item, Quantity: Number(item.Quantity) || 1 });
    }
  });
  return merged;
}
// total number of items in the cart, counting quantities
export function getCartCount(key = "so-cart") {
  return getCartItems(key).reduce((count, item) => count + item.Quantity, 0);
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
  const count = getCartCount();
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

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  // root-relative paths so this works from any page, even in subfolders
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);

  // the cart icon only exists once the header is loaded
  updateCartCount();
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

// turn a url category like "sleeping-bags" into a label like "Sleeping Bags"
export function categoryLabel(category) {
  if (!category) return "";
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// briefly animate the backpack icon so an add to the cart is noticeable
export function animateCartIcon() {
  const cart = qs(".cart");
  if (!cart) return;

  cart.classList.remove("cart--added");
  // reading offsetWidth restarts the animation on a quick second click
  void cart.offsetWidth;
  cart.classList.add("cart--added");
  cart.addEventListener(
    "animationend",
    () => cart.classList.remove("cart--added"),
    { once: true },
  );
}
