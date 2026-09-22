const baseURL = import.meta.env.VITE_SERVER_URL

export async function convertToJson(response) {
  const jsonResponse = await response.json();
  if (response.ok) {
    return jsonResponse;
  }
  throw {
    name: "servicesError",
    message: jsonResponse,
  };
}

// the API only searches by category name, so a text search has to look
// through every category and filter the results here
const categories = ["tents", "backpacks", "sleeping-bags", "hammocks"];

export default class ExternalServices {
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

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(`${baseURL}checkout/`, options).then(convertToJson);
  }
}
