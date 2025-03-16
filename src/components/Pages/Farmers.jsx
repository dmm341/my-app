import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Farmers = () => {
  const [farmers, setFarmers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [sortOrder, setSortOrder] = useState("asc");
  const [newFarmer, setNewFarmer] = useState({
    name: "",
    contact: "",
    location: "",
    avocado_type: "Hass",
    total_fruits: 0,
    total_money: 0.0,
  });
  const [editingFarmer, setEditingFarmer] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch all farmers and re-fetch when refresh state changes
useEffect(() => {
  setLoading(true);
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
}, [refresh]); // ✅ Add refresh as a dependency


  // Filter farmers based on search input
  const filteredFarmers = farmers.filter((farmer) =>
    `${farmer.name} ${farmer.contact} ${farmer.location}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Sort farmers based on selected field
  const sortedFarmers = [...filteredFarmers].sort((a, b) => {
    if (!sortField) return 0;

    const valueA = a[sortField];
    const valueB = b[sortField];

    if (typeof valueA === "string") {
      return sortOrder === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    } else {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    }
  });

  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Add or Update Farmer
  const saveFarmer = async () => {
    if (!validateForm()) return;

    const url = editingFarmer
      ? `http://localhost:5000/farmers/${editingFarmer.id}`
      : "http://localhost:5000/farmers";

    const method = editingFarmer ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFarmer),
    });

    if (response.ok) {
      const updatedFarmer = await response.json();
      if (editingFarmer) {
        setFarmers(
          farmers.map((farmer) =>
            farmer.id === updatedFarmer.id ? updatedFarmer : farmer
          )
        );
      } else {
        setFarmers([...farmers, updatedFarmer]);
      }
      resetForm();
      toast.success("Farmer saved successfully!");
    } else {
      toast.error("Failed to save farmer.");
    }
  };

  // Delete Farmer
  const deleteFarmer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this farmer?")) return;

    const response = await fetch(`http://localhost:5000/farmers/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      setFarmers(farmers.filter((farmer) => farmer.id !== id));
      toast.success("Farmer deleted successfully!");
    } else {
      toast.error("Failed to delete farmer.");
    }
  };

  // Populate fields for editing
  const editFarmer = (farmer) => {
    setNewFarmer(farmer);
    setEditingFarmer(farmer);
    setShowForm(true);
  };

  // Reset form fields
  const resetForm = () => {
    setNewFarmer({
      name: "",
      contact: "",
      location: "",
      avocado_type: "Hass",
      total_fruits: 0,
      total_money: 0.0,
    });
    setEditingFarmer(null);
    setShowForm(false);
  };

  // Validate form
  const validateForm = () => {
    if (!newFarmer.name.trim()) {
      toast.error("Please enter the farmer's name.");
      return false;
    }
    if (!newFarmer.contact.trim()) {
      toast.error("Please enter the farmer's contact.");
      return false;
    }
    if (!newFarmer.location.trim()) {
      toast.error("Please enter the farmer's location.");
      return false;
    }
    if (isNaN(newFarmer.total_fruits) || newFarmer.total_fruits < 0) {
      toast.error("Please enter a valid number for total fruits.");
      return false;
    }
    if (isNaN(newFarmer.total_money) || newFarmer.total_money < 0) {
      toast.error("Please enter a valid number for total money.");
      return false;
    }
    return true;
  };

  // Calculate total fruits and total money
  const totalFruits = farmers.reduce((sum, farmer) => sum + farmer.total_fruits, 0);
  const totalMoney = farmers.reduce((sum, farmer) => sum + farmer.total_money, 0);

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedFarmers = sortedFarmers.slice(indexOfFirstItem, indexOfLastItem);

  // Export to CSV
  const exportToCSV = () => {
    const headers = [
      "ID",
      "Name",
      "Contact",
      "Location",
      "Avocado Type",
      "Total Fruits",
      "Total Money",
    ];
    const data = farmers.map((farmer) => [
      farmer.id,
      farmer.name,
      farmer.contact,
      farmer.location,
      farmer.avocado_type,
      farmer.total_fruits,
      farmer.total_money,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      data.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "farmers.csv");
    document.body.appendChild(link);
    link.click();
  };
  const handleRefresh = () => {
    setRefresh((prev) => !prev); // Toggle refresh state to trigger re-fetch
  };
  

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 mb-6">Farmers</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="🔍 Search farmers by name, contact, or location..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="p-3 border rounded-lg w-full mb-6 shadow-sm focus:ring focus:ring-green-300"
      />

      {/* Summary Section */}
      <div className="bg-green-100 p-4 rounded-lg mb-6">
        <h3 className="text-xl font-bold text-green-700 mb-2">Summary</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-600">Total Fruits</p>
            <p className="text-2xl font-bold text-green-700">{totalFruits}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-gray-600">Total Money</p>
            <p className="text-2xl font-bold text-green-700">Ksh{totalMoney.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => {
            setShowForm(true);
            setEditingFarmer(null);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          ➕ Add Farmer
        </button>
        <button
          onClick={() => handleSort("name")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Sort by Name {sortField === "name" && (sortOrder === "asc" ? "⬆" : "⬇")}
        </button>
        <button
          onClick={() => handleSort("total_fruits")}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Sort by Fruits {sortField === "total_fruits" && (sortOrder === "asc" ? "⬆" : "⬇")}
        </button>
        <button
          onClick={() => handleSort("total_money")}
          className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Sort by Money {sortField === "total_money" && (sortOrder === "asc" ? "⬆" : "⬇")}
        </button>
        <button
  onClick={() => handleSort("id")}
  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-md transition"
>
  Sort by ID {sortField === "id" && (sortOrder === "asc" ? "⬆" : "⬇")}
</button>

        <button
          onClick={exportToCSV}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Export to CSV
        </button>
        <button
          onClick={handleRefresh}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg shadow-md transition"
        >
          🔄 Refresh Data
        </button>
      </div>

      {/* Add/Edit Farmer Form (Hidden by Default) */}
      {showForm && (
        <div className="bg-white p-6 mb-6 rounded-lg shadow-md border">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {editingFarmer ? "Edit Farmer" : "Add Farmer"}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newFarmer.name}
              onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })}
              className="p-3 border rounded-lg w-full shadow-sm"
            />
            <input
              type="text"
              placeholder="Contact"
              value={newFarmer.contact}
              onChange={(e) => setNewFarmer({ ...newFarmer, contact: e.target.value })}
              className="p-3 border rounded-lg w-full shadow-sm"
            />
            <input
              type="text"
              placeholder="Location"
              value={newFarmer.location}
              onChange={(e) => setNewFarmer({ ...newFarmer, location: e.target.value })}
              className="p-3 border rounded-lg w-full shadow-sm"
            />
            <select
              value={newFarmer.avocado_type}
              onChange={(e) => setNewFarmer({ ...newFarmer, avocado_type: e.target.value })}
              className="p-3 border rounded-lg w-full shadow-sm"
            >
              <option value="Hass">Hass</option>
              <option value="Fuerte">Fuerte</option>
              <option value="Both">Both</option>
            </select>
            <input
              type="number"
              placeholder="Total Fruits"
              value={newFarmer.total_fruits === 0 ? "" : newFarmer.total_fruits}
              onChange={(e) =>
                setNewFarmer({
                  ...newFarmer,
                  total_fruits: parseInt(e.target.value) || 0,
                })
              }
              className="p-3 border rounded-lg w-full shadow-sm"
            />
            <input
              type="number"
              placeholder="Total Money"
              value={newFarmer.total_money === 0.0 ? "" : newFarmer.total_money}
              onChange={(e) =>
                setNewFarmer({
                  ...newFarmer,
                  total_money: parseFloat(e.target.value) || 0.0,
                })
              }
              className="p-3 border rounded-lg w-full shadow-sm"
            />
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={saveFarmer}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md transition"
            >
              {editingFarmer ? "Update" : "Save"}
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

      {/* Farmers Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-green-700 text-white border border-gray-400">
                <th className="px-4 py-3 border">ID</th>
                <th className="px-4 py-3 border">Name</th>
                <th className="px-4 py-3 border">Contact</th>
                <th className="px-4 py-3 border">Location</th>
                <th className="px-4 py-3 border">Avocado Type</th>
                <th className="px-4 py-3 border">Total Fruits</th>
                <th className="px-4 py-3 border">Total Money</th>
                <th className="px-4 py-3 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFarmers.map((farmer) => (
                <tr key={farmer.id} className="border text-center">
                  <td className="px-4 py-3 border">{farmer.id}</td>
                  <td className="px-4 py-3 border">{farmer.name}</td>
                  <td className="px-4 py-3 border">{farmer.contact}</td>
                  <td className="px-4 py-3 border">{farmer.location}</td>
                  <td className="px-4 py-3 border">{farmer.avocado_type}</td>
                  <td className="px-4 py-3 border">{farmer.total_fruits}</td>
                  <td className="px-4 py-3 border">Ksh{farmer.total_money}</td>
                  <td className="px-4 py-3 border">
                    <button
                      onClick={() => editFarmer(farmer)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteFarmer(farmer.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="mt-6 flex justify-between items-center">
        <div>
          <span className="text-gray-600">Show </span>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="p-2 border rounded-lg"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span className="text-gray-600"> entries</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-green-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-600">
            Page {currentPage} of {Math.ceil(sortedFarmers.length / itemsPerPage)}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, Math.ceil(sortedFarmers.length / itemsPerPage))
              )
            }
            disabled={currentPage === Math.ceil(sortedFarmers.length / itemsPerPage)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg disabled:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={300} />
    </div>
  );
};

export default Farmers;