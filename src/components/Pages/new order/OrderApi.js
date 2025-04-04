const API_URL = "http://localhost:5000/orders";

const OrderService = {
  /**
   * Create a new order
   * @param {Object} orderData - Order details
   */
  createOrder: async (orderData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw await response.json();
      }
      
      return await response.json();
    } catch (error) {
      throw error.message || "Failed to create order.";
    }
  },

  /**
   * Get all orders
   */
  getOrders: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw await response.json();
      }
      return await response.json();
    } catch (error) {
      throw error.message || "Failed to fetch orders.";
    }
  },

  /**
   * Update an existing order
   * @param {string} orderId - Order ID
   * @param {Object} updatedData - Updated order details
   */
  updateOrder: async (orderId, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/${orderId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw await response.json();
      }
      
      return await response.json();
    } catch (error) {
      throw error.message || "Failed to update order.";
    }
  },

  /**
   * Delete an order
   * @param {string} orderId - Order ID
   */
  deleteOrder: async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/${orderId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw await response.json();
      }

      return await response.json();
    } catch (error) {
      throw error.message || "Failed to delete order.";
    }
  },
};

export default OrderService;
