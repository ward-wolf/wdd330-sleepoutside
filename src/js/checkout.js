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
