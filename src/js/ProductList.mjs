import {
  categoryLabel,
  getDiscount,
  renderListWithTemplate,
} from "./utils.mjs";

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
      <a href="/product_pages/?product=${product.Id}">
        ${discountBadge}
        <img src="${product.Images.PrimaryMedium}"
          srcset="${product.Images.PrimarySmall} 80w,
                  ${product.Images.PrimaryMedium} 160w,
                  ${product.Images.PrimaryLarge} 320w"
          sizes="(min-width: 500px) 250px, 45vw"
          alt="${product.Name}">
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
    const list = await this.dataSource.getData(this.category);
    // next, render the list
    this.renderList(list);
    this.renderHeading(`Top Products: ${categoryLabel(this.category)}`);
  }

  async search(term) {
    const list = await this.dataSource.searchProducts(term);
    this.renderList(list);
    this.renderHeading(`Search Results: ${term} (${list.length})`);
  }

  renderHeading(text) {
    const heading = document.querySelector(".products h2");
    if (heading) {
      heading.textContent = text;
    }
  }
    
  renderList(list) {
    if (list.length === 0) {
      this.listElement.innerHTML = `<li class="product-list__empty">No products found.</li>`;
      return;
    }
    // const htmlStrings = list.map(productCardTemplate);
    // this.listElement.insertAdjacentHTML("afterbegin", htmlStrings.join(""));

    // apply use new utility function instead of the commented code above
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true,
    );

  }
}