import React, { useState, useEffect } from "react";
import OrderService from "./OrderApi"; 

const NewOrderForm = ({ onOrderCreated }) => {
  const [formData, setFormData] = useState({
    farmerId: "",
    avocadoType: "Hass",
    customerName: "",
    numberOfFruits: "",
    pricePerFruit: "",
    totalAmount: ""
  });
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingFarmers, setFetchingFarmers] = useState(false);
  // Fetch farmers when component mounts
  useEffect(() => {
    const fetchFarmers = async () => {
      setFetchingFarmers(true);
      try {
        const response = await fetch("http://localhost:5000/farmers");
        if (!response.ok) {
          throw new Error("Failed to fetch farmers");
        }
        const data = await response.json();
        setFarmers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchingFarmers(false);
      }
    };

    fetchFarmers();
  }, []);
  // Update farmerId when customerName changes
  useEffect(() => {
    if (formData.customerName) {
      const selectedFarmer = farmers.find(f => f.name === formData.customerName);
      if (selectedFarmer) {
        setFormData(prev => ({
          ...prev,
          farmerId: selectedFarmer.id // Assuming 'id' is the farmerId in your table
        }));
      }
    }
  }, [formData.customerName, farmers]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.numberOfFruits || !formData.pricePerFruit) {
      setError("Please fill in all required fields");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const totalAmount = formData.numberOfFruits * formData.pricePerFruit;
      const orderData = { ...formData, totalAmount };
      await OrderService.createOrder(orderData);
      setFormData({
        farmerId: "",
        avocadoType: "Hass",
        customerName: "",
        numberOfFruits: "",
        pricePerFruit: "",
        totalAmount: ""
      });
      onOrderCreated();
    } catch (err) {
      setError(err.message || "Failed to create order.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-md">
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Display farmerId (read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Farmer ID</label>
        <input
          type="text"
          name="farmerId"
          value={formData.farmerId}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Avocado Type</label>
        <select
          name="avocadoType"
          value={formData.avocadoType}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        >
          <option value="Hass">Hass</option>
          <option value="Fuerte">Fuerte</option>
        </select>
      </div>
      {/* Farmer dropdown (showing names from farmers table) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Farmer Name</label>
        {fetchingFarmers ? (
          <p className="p-2 text-gray-500">Loading farmers...</p>
        ) : (
          <select
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          >
            <option value="">Select Farmer</option>
            {farmers.map(farmer => (
              <option key={farmer.id} value={farmer.name}>
                {farmer.name}
              </option>
            ))}
          </select>
        )}
      </div>
      {/* Number of fruits */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Number of Fruits</label>
        <input
          type="number"
          name="numberOfFruits"
          placeholder="Enter number of fruits"
          value={formData.numberOfFruits}
          onChange={handleChange}
          required
          min="1"
          className="w-full p-2 border rounded"
        />
      </div>
      {/* Price per fruit */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Price per Fruit</label>
        <input
          type="number"
          name="pricePerFruit"
          placeholder="Enter price per fruit"
          value={formData.pricePerFruit}
          onChange={handleChange}
          required
          min="0.01"
          step="0.01"
          className="w-full p-2 border rounded"
        />
      </div>
      {/* Total amount */}
      <div>
        <label className="block text-sm font-medium text-gray-700">total_amount</label>
        <input
          type="number"
          name="totalAmount"
          value={formData.numberOfFruits * formData.pricePerFruit}
          readOnly
          className="w-full p-2 border rounded"
        />
      </div>
      {/* Submit button */}
      <button
        type="submit"
        disabled={loading || fetchingFarmers}
        className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
      >
        {loading ? "Creating..." : "Create Order"}
      </button>
    </form>
  );
};
export default NewOrderForm;