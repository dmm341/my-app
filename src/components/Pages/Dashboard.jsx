import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUsers, FaShoppingBasket, FaMoneyBillWave } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const Dashboard = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false); // Refresh state to trigger re-fetch
  const navigate = useNavigate();

  // Fetch farmers data
  const fetchFarmers = async () => {
    try {
      const response = await fetch("http://localhost:5000/farmers");
      const data = await response.json();
      setFarmers(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      setLoading(false);
    }
  };

  // Fetch farmers data and re-fetch when `refresh` state changes
useEffect(() => {
  setLoading(true);
  fetchFarmers();
}, [refresh]); // ✅ Add refresh as a dependency


  // Calculate totals
  const totalFarmers = farmers.length;
  const totalFruits = farmers.reduce((sum, farmer) => sum + farmer.total_fruits, 0);
  const totalMoney = farmers.reduce((sum, farmer) => sum + farmer.total_money, 0);

  // Data for the chart
  const chartData = farmers.map((farmer) => ({
    name: farmer.name,
    fruits: farmer.total_fruits,
    money: farmer.total_money,
  }));

  // Function to manually refresh data
  const handleRefresh = () => {
    setRefresh((prev) => !prev); // Toggle refresh state to trigger re-fetch
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 mb-6">Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-100 p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaUsers className="text-4xl text-green-700" />
            <div>
              <p className="text-gray-600">Total Farmers</p>
              <p className="text-2xl font-bold text-green-700">{totalFarmers}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaShoppingBasket className="text-4xl text-green-700" />
            <div>
              <p className="text-gray-600">Total Fruits</p>
              <p className="text-2xl font-bold text-green-700">{totalFruits}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-100 p-6 rounded-lg shadow-md">
          <div className="flex items-center space-x-4">
            <FaMoneyBillWave className="text-4xl text-green-700" />
            <div>
              <p className="text-gray-600">Total Money</p>
              <p className="text-2xl font-bold text-green-700">Ksh{totalMoney.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8 flex space-x-4">
        <Link
          to="farmers"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          View Farmers
        </Link>
        <Link
          to="analytics"
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          📊 View Analytics
        </Link>
        <button
          onClick={handleRefresh}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Fruits Purchased from Farmers</h3>
        <BarChart width={800} height={300} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="fruits" fill="#4CAF50" />
        </BarChart>
      </div>

      {/* Best Farmers Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Best Farmers</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-green-700 text-white border border-gray-400">
                <th className="px-4 py-3 border">Farmer</th>
                <th className="px-4 py-3 border">Fruits</th>
                <th className="px-4 py-3 border">Money</th>
                <th className="px-4 py-3 border">Location</th>
              </tr>
            </thead>
            <tbody>
              {farmers
                .sort((a, b) => b.total_fruits - a.total_fruits)
                .slice(0, 5)
                .map((farmer) => (
                  <tr key={farmer.id} className="border text-center">
                    <td className="px-4 py-3 border">{farmer.name}</td>
                    <td className="px-4 py-3 border">{farmer.total_fruits}</td>
                    <td className="px-4 py-3 border">Ksh{farmer.total_money}</td>
                    <td className="px-4 py-3 border">{farmer.location}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;