import { getDiscount, renderListWithTemplate } from "./utils.mjs";

function productCardTemplate(product) {
  const discount = getDiscount(product);
  const discountBadge = discount
    ? `<span class="product-card__discount">${discount.percent}% OFF</span>`
    : "";
  const retailPrice = discount
    ? `<p class="product-card__retail">Was <s>$${discount.retail}</s> &middot; Save $${discount.amount}</p>`
    : "";

  return `
    <li class="product-card">
      <a href="product_pages/?product=${product.Id}">
        ${discountBadge}
        <img src="${product.Image}" alt="${product.Name}">
        <h2 class="card__brand">${product.Brand.Name}</h2>
        <h3 class="card__name">${product.NameWithoutBrand}</h3>
        <p class="product-card__price">$${product.FinalPrice}</p>
        ${retailPrice}
      </a>
    </li>
    `;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    // You passed in this information to make the class as reusable as possible.
    // Being able to define these things when you use the class will make it very flexible
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    // the dataSource will return a Promise...so you can use await to resolve it.
    const list = await this.dataSource.getData();
    // next, render the list
    this.renderList(list);
  }
    
  renderList(list) {
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    renderListWithTemplate(productCardTemplate, this.listElement, list);

  }
}