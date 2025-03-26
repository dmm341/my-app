import React, { useState, useEffect } from "react";
import { FaCashRegister } from "react-icons/fa";
import { url } from "../../utils/baseUrl";
import ReactPaginate from "react-paginate";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const NewOrder = ({ onOrderUpdated }) => {
  const [farmers, setFarmers] = useState([]);
  const [selectedFarmer, setSelectedFarmer] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [numberOfFruits, setNumberOfFruits] = useState(1);
  const [pricePerFruit, setPricePerFruit] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editNumberOfFruits, setEditNumberOfFruits] = useState(0);
  const [editPricePerFruit, setEditPricePerFruit] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch farmers from backend
  useEffect(() => {
    fetch(`${url}/farmers`)
      .then((res) => res.json())
      .then((data) => setFarmers(data))
      .catch((error) => console.error("Error fetching farmers:", error));
  }, []);

  // Fetch orders from backend
  const fetchOrders = () => {
    fetch(`${url}/orders`)
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((error) => console.error("Error fetching orders:", error));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Calculate total amount whenever numberOfFruits or pricePerFruit changes
  useEffect(() => {
    setTotalAmount(numberOfFruits * pricePerFruit);
  }, [numberOfFruits, pricePerFruit]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFarmer || numberOfFruits < 1 || pricePerFruit < 1) {
      toast.error("Please fill all fields correctly.");
      return;
    }

    const orderData = {
      farmerId: selectedFarmer,
      customerName,
      numberOfFruits,
      pricePerFruit,
      totalAmount,
    };

    try {
      const response = await fetch(`${url}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        toast.success("Order recorded successfully!");
        fetchOrders();
        setSelectedFarmer("");
        setCustomerName("");
        setNumberOfFruits(1);
        setPricePerFruit(1);
        setTotalAmount(0);
        setShowForm(false);
        if (typeof onOrderUpdated === 'function') {
          onOrderUpdated(); // Trigger refresh in Dashboard
        }
      } else {
        const errorData = await response.json();
        toast.error(`Failed to record order: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error recording order:", error);
      toast.error("An error occurred while recording the order.");
    }
  };
  const handleEditOrder = async (orderId) => {
    if (editNumberOfFruits < 1 || editPricePerFruit < 1) {
      toast.error("Please fill all fields correctly.");
      return;
    }

    const updatedOrder = {
      numberOfFruits: editNumberOfFruits,
      pricePerFruit: editPricePerFruit,
      totalAmount: editNumberOfFruits * editPricePerFruit,
    };

    try {
      const response = await fetch(`${url}/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedOrder),
      });

      if (response.ok) {
        toast.success("Order updated successfully!");
        setEditingOrder(null);
        fetchOrders(); 
        // Refresh orders
        fetch(`${url}/farmers`) // Refresh farmers
          .then((res) => res.json())
          .then(setFarmers)
          .catch((error) => console.error("Error fetching farmers:", error));
        if (typeof onOrderUpdated === 'function') {
          onOrderUpdated(); // Trigger refresh in Dashboard
        }
      } else {
        toast.error("Failed to update order.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  // Handle order deletion
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await fetch(`${url}/orders/${orderId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Order deleted successfully!");
        const deletedOrder = orders.find(order => order.id === orderId);
        if (deletedOrder) {
          const farmer = farmers.find(farmer => farmer.id === deletedOrder.farmer_id);
          if (farmer) {
            farmer.number_of_fruits -= deletedOrder.number_of_fruits;
            farmer.total_amount -= deletedOrder.total_amount;
            await fetch(`${url}/farmers/${farmer.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(farmer),
            });
          }
        }
        fetchOrders();
        fetch(`${url}/farmers`) // Refresh farmers
          .then((res) => res.json())
          .then(setFarmers)
          .catch((error) => console.error("Error fetching farmers:", error));
        if (typeof onOrderUpdated === 'function') {
          onOrderUpdated(); // Trigger refresh in Dashboard
        }
      } else {
        toast.error("Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const paginatedOrders = orders.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(orders.length / itemsPerPage);

  // Handle page change
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center space-x-2">
        <FaCashRegister size={28} />
        <span>New Order</span>
      </h2>
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-4"
      >
        {showForm ? "Hide Form" : "New Order"}
      </button>

      {/* New Order Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="space-y-4">
            {/* Farmer Selection */}
            <div>
              <label className="block text-gray-700">Select Customer</label>
              <select
                value={selectedFarmer}
                onChange={(e) => {
                  const selected = farmers.find((farmer) => farmer.id === parseInt(e.target.value));
                  setSelectedFarmer(e.target.value);
                  setCustomerName(selected ? selected.name : "");
                }}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-green-300"
                required
              >
                <option value="" disabled>Choose a customer</option>
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
                onChange={(e) => setNumberOfFruits(parseInt(e.target.value) || 1)}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-green-300"
                min="1"
                required
              />
            </div>

            {/* Price per Fruit */}
            <div>
              <label className="block text-gray-700">Buying Price per Fruit (Ksh)</label>
              <input
                type="number"
                value={pricePerFruit}
                onChange={(e) => setPricePerFruit(parseFloat(e.target.value) || 1)}
                className="w-full p-3 border rounded-lg shadow-sm focus:ring focus:ring-green-300"
                min="1"
                step="0.01"
                required
              />
            </div>

            {/* Total Amount (Read-only) */}
            <div>
              <label className="block text-gray-700">Total Buying Amount (Ksh)</label>
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
                Record Order
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Orders Table */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">All Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-400 shadow-md rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-green-700 text-white border border-gray-400">
                <th className="px-4 py-3 border">Farmer ID</th>
                <th className="px-4 py-3 border">Customer Name</th>
                <th className="px-4 py-3 border">Number of Fruits</th>
                <th className="px-4 py-3 border">Price per Fruit (Ksh)</th>
                <th className="px-4 py-3 border">Total Amount (Ksh)</th>
                <th className="px-4 py-3 border">Order Date</th>
                <th className="px-4 py-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedOrders.map((order) => (
                <tr key={order.id} className="border text-center">
                  <td className="px-4 py-3 border">{order.farmer_id}</td>
                  <td className="px-4 py-3 border">{order.customer_name}</td>
                  <td className="px-4 py-3 border">
                    {editingOrder === order.id ? (
                      <input
                        type="number"
                        value={editNumberOfFruits}
                        onChange={(e) => setEditNumberOfFruits(parseInt(e.target.value))}
                        className="w-16 border p-1 text-center"
                      />
                    ) : (
                      String(order.number_of_fruits) // Ensure value is a string
                    )}
                  </td>
                  <td className="px-4 py-3 border">
                    {editingOrder === order.id ? (
                      <input
                        type="number"
                        value={editPricePerFruit}
                        onChange={(e) => setEditPricePerFruit(parseFloat(e.target.value))}
                        className="w-16 border p-1 text-center"
                      />
                    ) : (
                      String(order.price_per_fruit) // Ensure value is a string
                    )}
                  </td>
                  <td className="px-4 py-3 border">{order.total_amount}</td>
                  <td className="px-4 py-3 border">{new Date(order.order_date).toLocaleDateString("en-GB")}</td>
                  <td className="px-4 py-3 border">
                    {editingOrder === order.id ? (
                      <button
                        className="bg-blue-500 text-white px-2 py-1 rounded"
                        onClick={() => handleEditOrder(order.id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                        onClick={() => {
                          setEditingOrder(order.id);
                          setEditNumberOfFruits(order.number_of_fruits);
                          setEditPricePerFruit(order.price_per_fruit);
                        }}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white px-2 py-1 ml-2 rounded"
                      onClick={() => handleDeleteOrder(order.id)}
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
      </div>
      {/* Toast Notifications */}
            <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default NewOrder;