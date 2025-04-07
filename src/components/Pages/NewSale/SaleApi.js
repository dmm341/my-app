const API_URL ="http://localhost:5000/sales";
const SaleService = {
  /**
   * Create a new sale
   * @param {Object} saleData - Sale details
   */
  createSale: async (saleData) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(saleData),
      });

      if (!response.ok) {
        throw await response.json();
      }
      return await response.json();
    } catch (error) {
      throw error.message || "Failed to create sale.";
    }
  },

  /**
   * Get all sales
   */
  getSales: async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw await response.json();
      }
      return await response.json();
    } catch (error) {
      throw error.message || "Failed to fetch sales.";
    }
  },

  /**
   * Update an existing sale
   * @param {string} saleId - Sale ID
   * @param {Object} updatedData - Updated sale details
   */
  updateSale: async (saleId, updatedData) => {
    try {
      const response = await fetch(`${API_URL}/${saleId}`, {
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
      throw error.message || "Failed to update sale.";
    }
  },
  /**
   * Delete a sale
   * @param {string} saleId - Sale ID
   */
  deleteSale: async (saleId) => {
    try {
      const response = await fetch(`${API_URL}/${saleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw await response.json();
      }
      return await response.json();
    } catch (error) {
      throw error.message || "Failed to delete sale.";
    }
  },
};
export default SaleService;

