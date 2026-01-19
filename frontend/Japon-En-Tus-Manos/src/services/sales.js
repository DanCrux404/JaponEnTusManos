const BASE_URL = "http://localhost:4000/api/sales";

export const getSales = async () => {
  const res = await fetch(`${BASE_URL}/`);
  return res.json();
};

export const getSaleById = async (saleId) => {
  const res = await fetch(`${BASE_URL}/${saleId}`);
  return res.json();
};

export const getSalesByUserId = async (userId) => {
  const res = await fetch(`${BASE_URL}/user/${userId}`);
  return res.json();
};

export const createSale = async ({ UserID, Total, PaymentStatus, PaymentMethod, Items }) => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ UserID, Total, PaymentStatus, PaymentMethod, Items }),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al crear venta");
  }

  return res.json();

};
