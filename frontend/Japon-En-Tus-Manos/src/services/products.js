const BASE_URL = "http://localhost:4000/api/products";

export const getProducts = async () => {
  const res = await fetch(`${BASE_URL}`);
  return res.json();
};

export const getProductById = async (productId) => {
  const res = await fetch(`${BASE_URL}/${productId}`);
  return res.json();
};

export const createProduct = async (productData) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
  return res.json();
};

export const updateProduct = async (productData) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productData),
  });
  return res.json();
};

export const deleteProduct = async (productId) => {
  const res = await fetch(`${BASE_URL}/${productId}`, {
    method: "DELETE",
  });
  return res.json();
};

//DO NOT REMOVE THIS FUNCTION, IF SO...IT DOES NOT WORK THE PROJECT AJAJAJAJ
export const decreaseStock = async (productId, quantity) => {
  const res = await fetch(`${BASE_URL}/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ quantity }),
  });
  return res.json();
};
