import React, { useState, useEffect } from "react";
import SaleService from "./SaleApi"; 

const NewSaleForm = ({ onSaleCreated }) => {
  const [formData, setFormData] = useState({
    buyerId: "",
    buyerName: "",
    avocadoType: "Hass",
    numberOfFruits: "",
    pricePerFruit: "",
    totalAmount: "",
    sale_date: new Date().toISOString().split('T')[0] 
  });
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingBuyers, setFetchingBuyers] = useState(false);
  // Fetch buyers when component mounts
  useEffect(() => {
    const fetchBuyers = async () => {
      setFetchingBuyers(true);
      try {
        const response = await fetch("http://localhost:5000/buyers");
        if (!response.ok) {
          throw new Error("Failed to fetch buyers");
        }
        const data = await response.json();
        setBuyers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchingBuyers(false);
      }
    };

    fetchBuyers();
  }, []);
  useEffect(() => { 
    if (formData.buyerName) {
      const selectedBuyer = buyers.find(b => b.name === formData.buyerName);
      if (selectedBuyer) {
        setFormData(prev => ({
         ...prev,
          buyerId: selectedBuyer.id
        }));
      }
    }
  }, [formData.buyerName, buyers]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.buyerName || !formData.numberOfFruits || !formData.pricePerFruit) {
      alert("Please fill in all required fields.");
      return;
    }
  
    setLoading(true);
    setError(null);
    
    try {
      const totalAmount = formData.numberOfFruits * formData.pricePerFruit;
      const saleData = {
        buyerId: formData.buyerId,
        buyerName: formData.buyerName,
        avocadoType: formData.avocadoType,
        numberOfFruits: parseInt(formData.numberOfFruits),
        pricePerFruit: parseFloat(formData.pricePerFruit),
        totalAmount: totalAmount,
        sale_date: new Date().toISOString().slice(0, 19).replace('T', ' ') // MySQL format
      };
      
      console.log("Submitting sale data:", saleData); // Debug log
      
      await SaleService.createSale(saleData);
      setFormData({
        buyerId: "",
        buyerName: "",
        avocadoType: "Hass",
        numberOfFruits: "",
        pricePerFruit: "",
        totalAmount: "",
        sale_date: new Date().toISOString().split('T')[0]
      });
      onSaleCreated();
    } catch (error) {
      console.error("Sale creation error:", error);
      setError(error.message || "Failed to create sale");
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md shadow-md">
      {error && <p className="text-red-500">{error}</p>}
      {/* display buyerid(readonly) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Buyer ID
        </label>
        <input
          type="text"
          name="buyerId"
          value={formData.buyerId}
          readOnly
          className="w-full p-2 border rounded bg-gray-100"
        /> 
      </div>   
        {/* avocado type */}
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
        {/* buyer name dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Buyer Name</label>
          {fetchingBuyers ? (
            <p className="p-2 text-gray-500">Loading buyers...</p>
          ) : (
            <select
              name="buyerName"
              value={formData.buyerName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a buyer</option>
              {buyers.map((buyer) => (
                <option key={buyer.id} value={buyer.name}>
                  {buyer.name}
                </option>
              ))}
            </select>
          )}
        </div>
        {/* number of fruits */}
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
        {/* price per fruit */}
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
        {/* total amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Total Amount</label>
          <input
            type="number"
            name="totalAmount"
            value={formData.numberOfFruits * formData.pricePerFruit}
            readOnly
            className="w-full p-2 border rounded bg-gray-100"
          />
        </div>
        {/* submit button */}
        <button
          type="submit"
          disabled={loading|| fetchingBuyers}
          className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 "
          >
            {loading ? "Creating Sale..." : "Create Sale"}
          </button>
          </form>
          );
};
export default NewSaleForm;


      
 
    