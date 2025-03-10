import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaCashRegister } from "react-icons/fa";

const NewSale = () => {
  const [farmers, setFarmers] = useState([]); // List of farmers (customers)
  const [selectedFarmer, setSelectedFarmer] = useState(""); // Selected farmer ID
  const [numberOfFruits, setNumberOfFruits] = useState(0); // Number of fruits
  const [pricePerFruit, setPricePerFruit] = useState(0); // Price per fruit
  const [totalAmount, setTotalAmount] = useState(0); // Calculated total amount
  const [loading, setLoading] = useState(true); // Loading state
  const navigate = useNavigate();

  // Fetch farmers from the backend
  useEffect(() => {
    fetch("http://localhost:5000/farmers")
      .then((res) => res.json())
      .then((data) => {
        setFarmers(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching farmers:", error);
        setLoading(false);
      });
  }, []);

  // Calculate total amount whenever numberOfFruits or pricePerFruit changes
  useEffect(() => {
    setTotalAmount(numberOfFruits * pricePerFruit);
  }, [numberOfFruits, pricePerFruit]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFarmer || numberOfFruits <= 0 || pricePerFruit <= 0) {
      alert("Please fill all fields correctly.");
      return;
    }

    const saleData = {
      farmerId: selectedFarmer,
      numberOfFruits,
      pricePerFruit,
      totalAmount,
    };

    try {
      const response = await fetch("http://localhost:5000/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });

      if (response.ok) {
        alert("Sale recorded successfully!");
        navigate("/dashboard"); // Redirect to dashboard after successful submission
      } else {
        alert("Failed to record sale.");
      }
    } catch (error) {
      console.error("Error recording sale:", error);
      alert("An error occurred while recording the sale.");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center space-x-2">
        <FaCashRegister size={28} />
        <span>New Sale</span>
      </h2>

      {/* New Sale Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="space-y-4">
          {/* Farmer Selection */}
          <div>
            <label className="block text-gray-700">Select Customer</label>
            <select
              value={selectedFarmer}
              onChange={(e) => setSelectedFarmer(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-green-300"
              required
            >
              <option value="" disabled>
                Choose a customer
              </option>
              {farmers.map((farmer) => (
                <option key={farmer.id} value={farmer.id}>
                  {farmer.name}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Fruits */}
          <div>
            <label className="block text-gray-700">Number of Fruits</label>
            <input
              type="number"
              value={numberOfFruits}
              onChange={(e) => setNumberOfFruits(parseInt(e.target.value) || 0)}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-green-300"
              min="1"
              required
            />
          </div>

          {/* Price per Fruit */}
          <div>
            <label className="block text-gray-700">Price per Fruit (Ksh)</label>
            <input
              type="number"
              value={pricePerFruit}
              onChange={(e) => setPricePerFruit(parseFloat(e.target.value) || 0)}
              className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-green-300"
              min="0"
              step="0.01"
              required
            />
          </div>

          {/* Total Amount (Read-only) */}
          <div>
            <label className="block text-gray-700">Total Amount (Ksh)</label>
            <input
              type="text"
              value={totalAmount.toFixed(2)}
              readOnly
              className="w-full p-3 border rounded-lg shadow-sm bg-gray-100"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition"
            >
              Record Sale
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewSale;