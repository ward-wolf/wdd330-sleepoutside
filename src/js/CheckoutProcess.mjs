import { getCartItems } from "./utils.mjs";

const TAX_RATE = 0.06;
// $10 for the first item, $2 for each additional item
const FIRST_ITEM_SHIPPING = 10;
const EXTRA_ITEM_SHIPPING = 2;

export default class CheckoutProcess {
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.itemCount = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getCartItems(this.key);
    this.calculateItemSummary();
  }

  calculateItemSummary() {
    // calculate and display the total dollar amount of the items in the cart, and the number of items.
    this.itemCount = this.list.reduce((count, item) => count + item.Quantity, 0);
    this.itemTotal = this.list.reduce(
      (total, item) => total + Number(item.FinalPrice) * item.Quantity,
      0,
    );

    this.displayText("#num-items", this.itemCount);
    this.displayText("#cartTotal", `$${this.itemTotal.toFixed(2)}`);
  }

  calculateOrderTotal() {
    // calculate the tax and shipping amounts. Add those to the cart total to figure out the order total
    this.tax = this.itemTotal * TAX_RATE;
    this.shipping =
      this.itemCount === 0
        ? 0
        : FIRST_ITEM_SHIPPING + (this.itemCount - 1) * EXTRA_ITEM_SHIPPING;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    // display the totals.
    this.displayOrderTotals();
  }

  displayOrderTotals() {
    // once the totals are all calculated display them in the order summary page
    this.displayText("#shipping", `$${this.shipping.toFixed(2)}`);
    this.displayText("#tax", `$${this.tax.toFixed(2)}`);
    this.displayText("#orderTotal", `$${this.orderTotal.toFixed(2)}`);
  }

  displayText(selector, value) {
    const element = document.querySelector(`${this.outputSelector} ${selector}`);
    if (element) {
      element.innerText = value;
    }
  }
}
