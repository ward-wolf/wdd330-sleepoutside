import { categoryLabel, getParam, loadHeaderFooter } from "./utils.mjs";
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import Alert from "./Alert.mjs";

loadHeaderFooter();

const alerts = new Alert();

alerts.init();

const category = getParam("category");
const search = getParam("search");

const dataSource = new ProductData();

const element = document.querySelector(".product-list");

if (search) {
  document.title = `Sleep Outside | Search: ${search}`;

  const productList = new ProductList(null, dataSource, element);

  productList.search(search);
} else {
  document.title = `Sleep Outside | ${categoryLabel(category)}`;

  const productList = new ProductList(category, dataSource, element);

  productList.init();
}
