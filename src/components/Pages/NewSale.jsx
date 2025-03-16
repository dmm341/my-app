import React, { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";

const NewSale = () => {
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [numberOfFruits, setNumberOfFruits] = useState(0);
  const [pricePerFruit, setPricePerFruit] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [saleDate, setSaleDate] = useState("");
  const [sales, setSales] = useState([]);
  const [editingSale, setEditingSale] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortField, setSortField] = useState("sale_date");
  const [sortOrder, setSortOrder] = useState("desc");
  
  
  useEffect(() => {
    fetch("http://localhost:5000/buyers")
      .then((res) => res.json())
      .then((data) => setBuyers(data))
      .catch((error) => console.error("Error fetching buyers:", error));
    fetchSales();
  }, []);
  
  const fetchSales = () => {
    fetch("http://localhost:5000/sales")
      .then((res) => res.json())
      .then((data) => setSales(data))
      .catch((error) => console.error("Error fetching sales:", error));
  };
  
  useEffect(() => {
    setTotalAmount(numberOfFruits * pricePerFruit);
  }, [numberOfFruits, pricePerFruit]);
  const handleSort = (field) => {
    const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
    
    const sortedSales = [...sales].sort((a, b) => {
      if (order === "asc") {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    setSales(sortedSales);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBuyer || numberOfFruits <= 0 || pricePerFruit <= 0 || !saleDate) {
      alert("Please fill all fields correctly.");
      return;
    }
  
    const saleData = {
      buyerId: selectedBuyer,
      numberOfFruits,
      pricePerFruit,
      totalAmount,
      saleDate,
    };
  
    try {
      let response;
      
      if (editingSale) {
        // Update an existing sale
        response = await fetch(`http://localhost:5000/sales/${editingSale}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saleData),
        });
      } else {
        // Create a new sale
        response = await fetch("http://localhost:5000/sales", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saleData),
        });
      }
  
      if (response.ok) {
        alert(editingSale ? "Sale updated successfully!" : "Sale recorded successfully!");
        fetchSales();
        setSelectedBuyer("");
        setNumberOfFruits(0);
        setPricePerFruit(0);
        setTotalAmount(0);
        setSaleDate("");
        setEditingSale(null);
        setShowForm(false);
      } else {
        alert("Failed to process sale.");
      }
    } catch (error) {
      console.error("Error processing sale:", error);
    }
  };
  
  const handleEdit = (sale) => {
    setEditingSale(sale.id);
    setSelectedBuyer(String(sale.buyer_id)); // Ensure it's a string
    setNumberOfFruits(sale.number_of_fruits);
    setPricePerFruit(sale.price_per_fruit);
    setTotalAmount(sale.total_amount);
  
    // Format date to "YYYY-MM-DD" for input field compatibility
    const formattedDate = new Date(sale.sale_date).toISOString().split("T")[0];
    setSaleDate(formattedDate);
  
    setShowForm(true);
  };
  
  
  

  const handleDelete = async (saleId) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;

    try {
      const response = await fetch(`http://localhost:5000/sales/${saleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Sale deleted successfully!");
        fetchSales();
      } else {
        alert("Failed to delete sale.");
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center space-x-2">
        <FaShoppingCart size={28} />
        <span>New Sale</span>
      </h2>
      
      <button onClick={() => setShowForm(!showForm)} className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-4">
        {showForm ? "Hide Form" : "New Sale"}
      </button>
       {/* Sorting Buttons */}
       <div className="mb-4">
        <button onClick={() => handleSort("sale_date")} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">Sort by Date</button>
        <button onClick={() => handleSort("number_of_fruits")} className="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2">Sort by Fruits</button>
        <button onClick={() => handleSort("total_amount")} className="bg-gray-500 text-white px-4 py-2 rounded-lg">Sort by Amount</button>
      </div>


      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="space-y-4">
            <label className="block text-gray-700">Select Buyer</label>
            <select
  value={selectedBuyer}
  onChange={(e) => setSelectedBuyer(e.target.value)}
  className="w-full p-3 border rounded-lg"
>
  <option value="" disabled>Choose a buyer</option>
  {buyers.map((buyer) => (
    <option key={buyer.id} value={String(buyer.id)}> {/* Convert to string */}
      {buyer.name}
    </option>
  ))}
</select>



            <label className="block text-gray-700">Number of Fruits Sold</label>
            <input type="number" value={numberOfFruits} onChange={(e) => setNumberOfFruits(parseInt(e.target.value) || 0)} className="w-full p-3 border rounded-lg" />

            <label className="block text-gray-700">Selling Price per Fruit (Ksh)</label>
            <input type="number" value={pricePerFruit} onChange={(e) => setPricePerFruit(parseFloat(e.target.value) || 0)} className="w-full p-3 border rounded-lg" />
            
            <label className="block text-gray-700">Sale Date</label>
            <input type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} className="w-full p-3 border rounded-lg" />
            
            <label className="block text-gray-700">Total Selling Amount (Ksh)</label>
            <input type="text" value={totalAmount.toFixed(2)} readOnly className="w-full p-3 border rounded-lg bg-gray-100" />
            
            <button type="submit" className="w-full bg-green-600 text-white px-6 py-3 rounded-lg">
  {editingSale ? "Update Sale" : "Record Sale"}
</button>

          </div>
        </form>
      )}

      {/* Sales Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-4">All Sales</h3>
        <table className="w-full border border-gray-400">
          <thead>
            <tr className="bg-green-700 text-white">
              <th className="px-4 py-3 border">Buyer</th>
              <th className="px-4 py-3 border">Fruits Sold</th>
              <th className="px-4 py-3 border">Price/Fruit (Ksh)</th>
              <th className="px-4 py-3 border">Total Amount (Ksh)</th>
              <th className="px-4 py-3 border">Date</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id} className="border">
                <td className="px-4 py-3 border">{sale.buyer_name}</td>
                <td className="px-4 py-3 border">{sale.number_of_fruits}</td>
                <td className="px-4 py-3 border">{sale.price_per_fruit}</td>
                <td className="px-4 py-3 border">{sale.total_amount}</td>
                <td className="px-4 py-3 border">{new Date(sale.sale_date).toLocaleDateString("en-GB")}</td>
                <td className="px-4 py-3 border">
                  <button onClick={() => handleEdit(sale)} className="bg-yellow-500 text-white px-2 py-1 rounded mr-2">Edit</button>
                  <button onClick={() => handleDelete(sale.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewSale;
