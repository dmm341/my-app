import React, { useState, useEffect } from "react";
import { FaShoppingCart, FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactPaginate from "react-paginate";
import { url } from "../../utils/baseUrl";

const NewSale = () => {
  const [buyers, setBuyers] = useState([]);
  const [selectedBuyer, setSelectedBuyer] = useState("");
  const [numberOfFruits, setNumberOfFruits] = useState(1);
  const [pricePerFruit, setPricePerFruit] = useState(1);
  const [totalAmount, setTotalAmount] = useState(1);
  const [saleDate, setSaleDate] = useState("");
  const [sales, setSales] = useState([]);
  const [editingSale, setEditingSale] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortField, setSortField] = useState("sale_date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [loading, setLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page

  // Fetch buyers and sales on component mount
  useEffect(() => {
    fetch(`${url}/buyers`)
      .then((res) => res.json())
      .then((data) => setBuyers(data))
      .catch((error) => console.error("Error fetching buyers:", error));

    fetchSales();
  }, []);

  // Fetch sales data
  const fetchSales = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${url}/sales`);
      const data = await response.json();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error("Failed to fetch sales.");
    } finally {
      setLoading(false);
    }
  };

  // Calculate total amount
  useEffect(() => {
    setTotalAmount(numberOfFruits * pricePerFruit);
  }, [numberOfFruits, pricePerFruit]);

  // Handle sorting
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedBuyer || numberOfFruits <= 0 || pricePerFruit <= 0 || !saleDate) {
      toast.error("Please fill all fields correctly.");
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
        response = await fetch(`${url}/sales/${editingSale}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saleData),
        });
      } else {
        // Create a new sale
        response = await fetch(`${url}/sales`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(saleData),
        });
      }

      if (response.ok) {
        toast.success(editingSale ? "Sale updated successfully!" : "Sale recorded successfully!");
        fetchSales();
        resetForm();
      } else {
        toast.error("Failed to process sale.");
      }
    } catch (error) {
      console.error("Error processing sale:", error);
      toast.error("An error occurred while processing the sale.");
    }
  };

  // Handle edit sale
  const handleEdit = (sale) => {
    setEditingSale(sale.id);
    setSelectedBuyer(String(sale.buyer_id));
    setNumberOfFruits(sale.number_of_fruits);
    setPricePerFruit(sale.price_per_fruit);
    setTotalAmount(sale.total_amount);
    setSaleDate(new Date(sale.sale_date).toISOString().split("T")[0]);
    setShowForm(true);
  };

  // Handle delete sale
  const handleDelete = async (saleId) => {
    if (!window.confirm("Are you sure you want to delete this sale?")) return;

    try {
      const response = await fetch(`${url}/sales/${saleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Sale deleted successfully!");
        fetchSales();
      } else {
        toast.error("Failed to delete sale.");
      }
    } catch (error) {
      console.error("Error deleting sale:", error);
      toast.error("An error occurred while deleting the sale.");
    }
  };

  // Reset form
  const resetForm = () => {
    setSelectedBuyer("");
    setNumberOfFruits(0);
    setPricePerFruit(0);
    setTotalAmount(0);
    setSaleDate("");
    setEditingSale(null);
    setShowForm(false);
  };

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const paginatedSales = sales.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(sales.length / itemsPerPage);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center space-x-2">
        <FaShoppingCart size={28} className="text-green-600" />
        <span>New Sale</span>
      </h2>

      {/* Toggle Form Button */}
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mb-4 transition duration-300"
      >
        {showForm ? "Hide Form" : "New Sale"}
      </button>

      {/* Sorting Buttons */}
      <div className="mb-4 flex space-x-4">
        <button
          onClick={() => handleSort("sale_date")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Sort by Date
        </button>
        <button
          onClick={() => handleSort("number_of_fruits")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Sort by Fruits
        </button>
        <button
          onClick={() => handleSort("total_amount")}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition duration-300"
        >
          Sort by Amount
        </button>
      </div>

      {/* Add/Edit Sale Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Buyer Selection */}
            <div>
              <label className="block text-gray-700 mb-2">Select Buyer</label>
              <select
                value={selectedBuyer}
                onChange={(e) => setSelectedBuyer(e.target.value)}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-green-300"
                required
              >
                <option value="" disabled>Choose a buyer</option>
                {buyers.map((buyer) => (
                  <option key={buyer.id} value={String(buyer.id)}>
                    {buyer.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Number of Fruits */}
            <div>
              <label className="block text-gray-700 mb-2">Number of Fruits Sold</label>
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
              <label className="block text-gray-700 mb-2">Selling Price per Fruit (Ksh)</label>
              <input
                type="number"
                value={pricePerFruit}
                onChange={(e) => setPricePerFruit(parseFloat(e.target.value) || 0)}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-green-300"
                min="1"
                step="0.01"
                required
              />
            </div>

            {/* Sale Date */}
            <div>
              <label className="block text-gray-700 mb-2">Sale Date</label>
              <input
                type="date"
                value={saleDate}
                onChange={(e) => setSaleDate(e.target.value)}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-green-300"
                required
              />
            </div>

            {/* Total Amount (Read-only) */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Total Selling Amount (Ksh)</label>
              <input
                type="text"
                value={totalAmount.toFixed(2)}
                readOnly
                className="w-full p-3 border rounded-lg shadow-sm bg-gray-100"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold text-lg transition duration-300"
            >
              {editingSale ? "Update Sale" : "Record Sale"}
            </button>
          </div>
        </form>
      )}

      {/* Sales Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">All Sales</h3>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-400 shadow-md rounded-lg overflow-hidden">
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
                  {paginatedSales.map((sale) => (
                    <tr key={sale.id} className="border hover:bg-gray-50 transition duration-200">
                      <td className="px-4 py-3 border">{sale.buyer_name}</td>
                      <td className="px-4 py-3 border">{sale.number_of_fruits}</td>
                      <td className="px-4 py-3 border">{sale.price_per_fruit}</td>
                      <td className="px-4 py-3 border">{sale.total_amount}</td>
                      <td className="px-4 py-3 border">{new Date(sale.sale_date).toLocaleDateString("en-GB")}</td>
                      <td className="px-4 py-3 border">
                        <button
                          onClick={() => handleEdit(sale)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded mr-2 transition duration-300"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(sale.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition duration-300"
                        >
                          <FaTrash />
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
          </>
        )}
      </div>

      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default NewSale;