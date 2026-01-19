const BASE_URL = "http://localhost:4000/api/chat";

export const getAllRooms = async () => {
  const res = await fetch(`${BASE_URL}/rooms`);
  return res.json();
};

export const getMessages = async (roomID) => {
  const res = await fetch(`${BASE_URL}/messages/${roomID}`);
  return res.json();
};

export const sendMessage = async (data) => {
  const res = await fetch(`${BASE_URL}/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};
