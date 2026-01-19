const BASE_URL = "http://localhost:4000/api/admin";

export const getAdmins = async () => {
  const res = await fetch(`${BASE_URL}`);
  return res.json();
};

export const createAdmin = async (adminData) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(adminData),
  });
  return res.json();
};

export const loginAdmin = async (credentials) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return res.json();
};
