import { getCartItems } from "./utils.mjs";

import ExternalServices from "./ExternalServices.mjs";

const services = new ExternalServices();

function formDataToJSON(formElement) {
  // convert the form data to a JSON object
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

function packageItems(items) {
  const simplifiedItems = items.map((item) => ({
    id: item.Id,
    price: item.FinalPrice,
    name: item.Name,
    quantity: item.Quantity,
  }));
  return simplifiedItems;
}

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
    this.itemCount = this.list.reduce(
      (count, item) => count + item.Quantity,
      0,
    );
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
    const element = document.querySelector(
      `${this.outputSelector} ${selector}`,
    );
    if (element) {
      element.innerText = value;
    }
  }

  async checkout() {
    const formElement = document.forms["checkout"];
    const order = formDataToJSON(formElement);

    order.orderDate = new Date().toISOString();
    // send money amounts rounded to cents, not raw floating point results
    order.orderTotal = this.orderTotal.toFixed(2);
    order.tax = this.tax.toFixed(2);
    order.shipping = this.shipping;
    order.items = packageItems(this.list);

    try {
      const response = await services.checkout(order);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }
}
