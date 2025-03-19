import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { url } from "../../utils/baseUrl";
import ReactPaginate from "react-paginate";
import { FaSort, FaFileExport } from "react-icons/fa";

const Buyers = () => {
  const [buyers, setBuyers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showForm, setShowForm] = useState(false);
  const [editingBuyer, setEditingBuyer] = useState(null);
  const [newBuyer, setNewBuyer] = useState({ name: "", contact: "", location: "" });
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch buyers on component mount
  useEffect(() => {
    fetchBuyers();
  }, []);

  const fetchBuyers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/buyers`);
      if (!response.ok) throw new Error("Failed to fetch buyers");
      const data = await response.json();
      setBuyers(data);
    } catch (error) {
      console.error("Error fetching buyers:", error);
      toast.error("Failed to fetch buyers");
    } finally {
      setLoading(false);
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

    if (typeof valueA === "number" && typeof valueB === "number") {
      return sortOrder === "asc" ? valueA - valueB : valueB - valueA;
    } else {
      return sortOrder === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    }
  });

  const filteredBuyers = sortedBuyers.filter((buyer) =>
    `${buyer.name} ${buyer.contact} ${buyer.location} ${buyer.total_fruits} ${buyer.total_money}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const paginatedBuyers = filteredBuyers.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(filteredBuyers.length / itemsPerPage);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  // Save or update buyer
  const saveBuyer = async () => {
    if (!newBuyer.name || !newBuyer.contact || !newBuyer.location) {
      toast.error("Please fill all fields.");
      return;
    }

    const method = editingBuyer ? "PUT" : "POST";
    const endpoint = editingBuyer ? `${url}/buyers/${editingBuyer.id}` : `${url}/buyers`;

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBuyer),
      });

      if (!response.ok) throw new Error("Failed to save buyer");
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
      const response = await fetch(`${url}/buyers/${id}`, { method: "DELETE" });
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

  // Export to CSV
  const exportToCSV = () => {
    const headers = ["Name", "Contact", "Location", "Total Fruits", "Total Money"];
    const data = buyers.map((buyer) => [
      buyer.name,
      buyer.contact,
      buyer.location,
      buyer.total_fruits,
      buyer.total_money,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      headers.join(",") +
      "\n" +
      data.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "buyers.csv");
    document.body.appendChild(link);
    link.click();
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
          onClick={exportToCSV}
          className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md transition flex items-center"
        >
          <FaFileExport className="mr-2" /> Export to CSV
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
              <th className="px-4 py-3 border cursor-pointer" onClick={() => handleSort("name")}>
                Name <FaSort className="inline" />
              </th>
              <th className="px-4 py-3 border cursor-pointer" onClick={() => handleSort("contact")}>
                Contact <FaSort className="inline" />
              </th>
              <th className="px-4 py-3 border cursor-pointer" onClick={() => handleSort("location")}>
                Location <FaSort className="inline" />
              </th>
              <th className="px-4 py-3 border cursor-pointer" onClick={() => handleSort("total_fruits")}>
                Total Fruits <FaSort className="inline" />
              </th>
              <th className="px-4 py-3 border cursor-pointer" onClick={() => handleSort("total_money")}>
                Total Money <FaSort className="inline" />
              </th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedBuyers.map((buyer) => (
              <tr key={buyer.id} className="border text-center hover:bg-gray-50 transition duration-200">
                <td className="px-4 py-3 border">{buyer.name}</td>
                <td className="px-4 py-3 border">{buyer.contact}</td>
                <td className="px-4 py-3 border">{buyer.location}</td>
                <td className="px-4 py-3 border">{buyer.total_fruits}</td>
                <td className="px-4 py-3 border">{buyer.total_money}</td>
                <td className="px-4 py-3 border">
                  <button
                    onClick={() => editBuyer(buyer)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBuyer(buyer.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={handlePageClick}
        containerClassName={"flex justify-center mt-6 space-x-2"}
        previousClassName={"bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"}
        nextClassName={"bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"}
        pageClassName={"bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg"}
        activeClassName={"bg-green-600 text-white"}
        disabledClassName={"bg-gray-300 text-gray-500 cursor-not-allowed"}
      />

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Buyers;