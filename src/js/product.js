import { getParam, loadHeaderFooter } from "./utils.mjs";
import Alert from "./Alert.mjs";
import ExternalServices from "./ExternalServices.mjs";
import ProductDetails from "./ProductDetails.mjs";

loadHeaderFooter();

const alerts = new Alert();

alerts.init();

const dataSource = new ExternalServices();
const productID = getParam("product");

const product = new ProductDetails(productID, dataSource);
product.init();
