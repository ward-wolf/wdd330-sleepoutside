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

document.querySelector("#checkoutSubmit").addEventListener("click", (e) => {
  // stop the browser from reloading the page with the form values in the url
  e.preventDefault();

  const myForm = document.forms.checkout;
  const chk_status = myForm.checkValidity();
  // show the browser's own messages for empty or badly formatted fields
  myForm.reportValidity();

  if (chk_status) {
    order.checkout();
  }
});
