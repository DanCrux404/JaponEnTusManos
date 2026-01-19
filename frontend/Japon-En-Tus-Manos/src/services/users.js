const BASE_URL = "http://localhost:4000/api/users";

export const getUsers = async () => {
  const res = await fetch(`${BASE_URL}`);
  return res.json();
};

export const getUserById = async (userId) => {
  const res = await fetch(`${BASE_URL}/${userId}`);
  return res.json();
};

export const createUser = async (userData) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  return res.json();
};

export const updateUser = async (userData) => {
  const res = await fetch(BASE_URL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Error al actualizar usuario");
  }

  return res.json();
};

export const deleteUser = async (userId) => {
  const res = await fetch(`${BASE_URL}/${userId}`, {
    method: "DELETE",
  });
  return res.json();
};

export const loginUser = async (credentials) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return res.json();
};
