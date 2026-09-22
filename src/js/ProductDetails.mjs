import {
  animateCartIcon,
  getCartItems,
  getDiscount,
  setLocalStorage,
  updateCartCount,
} from "./utils.mjs";

export default class ProductDetails {

  constructor(productId, dataSource) {
    this.productId = productId;
    this.product = {};
    this.dataSource = dataSource;
  }

  async init() {
    // use the datasource to get the details for the current product. findProductById will return a promise! use await or .then() to process it
    this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on 'this' to understand why.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    const cartItems = getCartItems();
    // adding the same product again just raises its quantity
    const existing = cartItems.find((item) => item.Id === this.product.Id);
    if (existing) {
      existing.Quantity += 1;
    } else {
      cartItems.push({ ...this.product, Quantity: 1 });
    }
    setLocalStorage("so-cart", cartItems);
    updateCartCount();
    animateCartIcon();
  }

  renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  document.title = `Sleep Outside | ${product.Name}`;

  document.querySelector("h2").textContent = product.Brand.Name;
  document.querySelector("h3").textContent = product.NameWithoutBrand;

  const productImage = document.getElementById("productImage");
  productImage.src = product.Images.PrimaryLarge;
  // let the browser pick a file size that suits the screen
  productImage.srcset = `${product.Images.PrimaryMedium} 160w,
    ${product.Images.PrimaryLarge} 320w,
    ${product.Images.PrimaryExtraLarge} 600w`;
  productImage.sizes = "(min-width: 500px) 500px, 70vw";
  productImage.alt = product.NameWithoutBrand;

  document.getElementById("productPrice").textContent = `$${product.FinalPrice}`;

  const discount = getDiscount(product);
  if (discount) {
    const productDiscount = document.getElementById("productDiscount");
    productDiscount.innerHTML = `
      <span class="product__discount-badge">${discount.percent}% OFF</span>
      Was <s>$${discount.retail}</s> &middot; You save $${discount.amount}`;
    productDiscount.classList.remove("hide");
  }

  document.getElementById("productColor").textContent = product.Colors[0].ColorName;
  document.getElementById("productDesc").innerHTML = product.DescriptionHtmlSimple;

  document.getElementById("addToCart").dataset.id = product.Id;
}