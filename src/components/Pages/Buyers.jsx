import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Buyers = () => {
  const [buyers, setBuyers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showForm, setShowForm] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState(null);
  const [newBuyer, setNewBuyer] = useState({ name: "", contact: "", location: "" });

  // Fetch buyers on component mount
  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    try {
      const response = await fetch("http://localhost:5000/buyers");
      if (!response.ok) throw new Error("Failed to fetch buyers");
      const data = await response.json();
      setBuyers(data);
    } catch (error) {
      console.error("Error fetching buyers:", error);
      toast.error("Failed to fetch buyers");
    }
  };

  // Handle sorting
  const handleSort = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
  };

  // Sort and filter buyers
  const sortedBuyers = [...buyers].sort((a, b) => {
    if (!sortField) return 0;
    const valueA = a[sortField];
    const valueB = b[sortField];
    return sortOrder === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA);
  });

  const filteredBuyers = sortedBuyers.filter((buyer) =>
    `${buyer.name} ${buyer.contact} ${buyer.location} ${buyer.total_fruits} ${buyer.total_money}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Save or update buyer
  const saveBuyer = async () => {
    if (!newBuyer.name || !newBuyer.contact || !newBuyer.location) {
      toast.error("Please fill all fields.");
      return;
    }
  
    const url = editingBuyer
      ? `http://localhost:5000/buyers/${editingBuyer.id}`
      : "http://localhost:5000/buyers";
    const method = editingBuyer ? "PUT" : "POST";
  
      
    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBuyer),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server response:", errorData); // ✅ Log response
        throw new Error(errorData.message || "Failed to save buyer");
      }
  
      toast.success(`Buyer ${editingBuyer ? "updated" : "added"} successfully!`);
      fetchBuyers();
      resetForm();
    } catch (error) {
      console.error("Error saving buyer:", error);
      toast.error(error.message);
    }
  };
  
  // Delete buyer
  const deleteBuyer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this buyer?")) return;

    try {
      const response = await fetch(`http://localhost:5000/buyers/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete buyer");
      toast.success("Buyer deleted successfully!");
      fetchBuyers();
    } catch (error) {
      console.error("Error deleting buyer:", error);
      toast.error(error.message);
    }
  };

  // Edit buyer
  const editBuyer = (buyer) => {
    setNewBuyer(buyer);
    setEditingBuyer(buyer);
    setShowForm(true);
  };

  // Reset form
  const resetForm = () => {
    setNewBuyer({ name: "", contact: "", location: "" });
    setEditingBuyer(null);
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 mb-6">Buyers</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search buyers by name, contact, or location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-3 border rounded-lg w-full mb-6 shadow-sm focus:ring focus:ring-green-300"
      />

      {/* Action Buttons */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          ➕ Add Buyer
        </button>
        <button
          onClick={() => handleSort("name")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Sort by Name {sortField === "name" && (sortOrder === "asc" ? "⬆" : "⬇")}
        </button>
        <button
          onClick={() => handleSort("name")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Sort by total_fruits{sortField === "total_fruits" && (sortOrder === "asc" ? "⬆" : "⬇")}
        </button>
        <button
          onClick={() => handleSort("name")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Sort by total_money{sortField === "total_money" && (sortOrder === "asc" ? "⬆" : "⬇")}
        </button>
        
      </div>

      {/* Add/Edit Buyer Form */}
      {showForm && (
        <div className="bg-white p-6 mb-6 rounded-lg shadow-md border">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingBuyer ? "Edit Buyer" : "Add Buyer"}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newBuyer.name}
              onChange={(e) => setNewBuyer({ ...newBuyer, name: e.target.value })}
              className="p-3 border rounded-lg w-full shadow-sm"
            />
            <input
              type="text"
              placeholder="Contact"
              value={newBuyer.contact}
              onChange={(e) => setNewBuyer({ ...newBuyer, contact: e.target.value })}
              className="p-3 border rounded-lg w-full shadow-sm"
            />
            <input
              type="text"
              placeholder="Location"
              value={newBuyer.location}
              onChange={(e) => setNewBuyer({ ...newBuyer, location: e.target.value })}
              className="p-3 border rounded-lg w-full shadow-sm"
            />
            
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={saveBuyer}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              {editingBuyer ? "Update" : "Save"}
            </button>
            <button
              onClick={resetForm}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Buyers Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-green-400 shadow-md rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-green-700 text-white border border-gray-400">
              <th className="px-4 py-3 border">Name</th>
              <th className="px-4 py-3 border">Contact</th>
              <th className="px-4 py-3 border">Location</th>
              <th className="px-4 py-3 border"> total fruits</th>
              <th className="px-4 py-3 border"> total money</th>
              <th className="px-4 py-3 border">Actions</th>
              
            </tr>
          </thead>
          <tbody>
            {filteredBuyers.map((buyer) => (
              <tr key={buyer.id} className="border text-center">
                <td className="px-4 py-3 border">{buyer.name}</td>
                <td className="px-4 py-3 border">{buyer.contact}</td>
                <td className="px-4 py-3 border">{buyer.location}</td>
                <td className="px-4 py-3 border">{buyer.total_fruits}</td>
                <td className="px-4 py-3 border">{buyer.total_money}</td>
                <td className="px-4 py-3 border">
                  <button onClick={() => editBuyer(buyer)} className="bg-yellow-500 text-white px-2 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => deleteBuyer(buyer.id)} className="bg-red-500 text-white px-2 py-1 rounded ml-2">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Buyers;