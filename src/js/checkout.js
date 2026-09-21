import { loadHeaderFooter } from "./utils.mjs";
import Alert from "./Alert.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

loadHeaderFooter();

const alerts = new Alert();

alerts.init();

const order = new CheckoutProcess("so-cart", ".order-summary");

order.init();

// shipping and tax are only worked out once we know where the order is going
document
  .querySelector("#zip")
  .addEventListener("blur", () => order.calculateOrderTotal());

document.querySelector("#checkoutForm").addEventListener("submit", (event) => {
  // stop the browser from reloading the page with the form values in the url
  event.preventDefault();

  // let the browser show its own messages for empty or badly formatted fields
  if (!event.target.checkValidity()) {
    event.target.reportValidity();
    return;
  }

  order.checkout();
});
