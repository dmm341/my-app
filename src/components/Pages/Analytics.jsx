import {url} from "../../utils/baseUrl";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import React, { useState, useEffect } from "react";
const Analytics = () => {
   const [farmers, setFarmers] = useState([]);
   const fetchFarmers = async () => {
    try {
      const response = await fetch(`${url}/farmers`); 
      const data = await response.json();
      setFarmers(data);
    } catch (error) {
      console.error("Error fetching farmers:", error);
    }
  };
  useEffect(() => {
    fetchFarmers();
  });
  // Data for the chart
  const chartData = farmers.map((farmer) => ({
    name: farmer.name,
    fruits: farmer.total_fruits,
    money: farmer.total_money,
  }));

   return (
    <> 
    {/* Chart */}
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
    <h3 className="text-xl font-bold text-gray-800 mb-4">Fruits Purchased from Farmers</h3>
    <BarChart width={300} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="fruits" fill="#4CAF50" />
    </BarChart>
  </div>
     </>
  )
}

export default Analytics;