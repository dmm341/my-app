// src/utils/api.js
const API_URL = "http://localhost:5000";

export const fetchFarmers = async () => {
  const response = await fetch(`${API_URL}/farmers`);
  return response.json();
};

export const fetchOrders = async () => {
  const response = await fetch(`${API_URL}/orders`);
  return response.json();
};

export const addOrder = async (orderData) => {
  const response = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  return response.json();
};

export const updateOrder = async (orderId, updatedOrder) => {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedOrder),
  });
  return response.json();
};

export const deleteOrder = async (orderId) => {
  const response = await fetch(`${API_URL}/orders/${orderId}`, {
    method: "DELETE",
  });
  return response.json();
};
