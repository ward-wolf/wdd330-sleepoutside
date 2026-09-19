const baseURL = import.meta.env.VITE_SERVER_URL

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error("Bad Response");
  }
}

// the API only searches by category name, so a text search has to look
// through every category and filter the results here
const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];

export default class ProductData {
  async searchProducts(query) {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    const lists = await Promise.all(categories.map((c) => this.getData(c)));
    return lists
      .flat()
      .filter((product) =>
        `${product.Brand.Name} ${product.Name}`.toLowerCase().includes(term),
      );
  }
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}
