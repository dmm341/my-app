import React, { useState, useEffect } from "react";
import { FaCashRegister } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NewOrder = ({ onOrderUpdated }) => {
  const [farmers, setFarmers] = useState([]);
  const [formData, setFormData] = useState({
    farmerId: "",
    avocadoType: "Hass",
    numberOfFruits: 1,
    pricePerFruit: 1,
    totalAmount: 1
  });
  const [orders, setOrders] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editFormData, setEditFormData] = useState({
    numberOfFruits: 0,
    pricePerFruit: 0,
    totalAmount: 0
  });
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchFarmers();
    fetchOrders();
  }, []);

  const fetchFarmers = async () => {
    try {
      const response = await fetch("http://localhost:5000/farmers/dropdown");
      const data = await response.json();
      setFarmers(data);
    } catch (error) {
      console.error("Error fetching farmers:", error);
      toast.error("Failed to load farmers");
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/orders");
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = name.includes("number") || name.includes("price") 
      ? parseFloat(value) || 0 
      : value;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: numericValue
      };
      
      if (name === "numberOfFruits" || name === "pricePerFruit") {
        newData.totalAmount = newData.numberOfFruits * newData.pricePerFruit;
      }
      
      return newData;
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;
    
    setEditFormData(prev => {
      const newData = {
        ...prev,
        [name]: numericValue
      };
      
      newData.totalAmount = newData.numberOfFruits * newData.pricePerFruit;
      
      return newData;
    });
  };

  const resetForm = () => {
    setFormData({
      farmerId: "",
      avocadoType: "Hass",
      numberOfFruits: 1,
      pricePerFruit: 1,
      totalAmount: 1
    });
    setShowForm(false);
  };

  

  const handleEditOrder = async (orderId) => {
    if (editFormData.numberOfFruits < 1 || editFormData.pricePerFruit < 1) {
      toast.error("Please enter valid values");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editFormData)
      });

      if (!response.ok) throw new Error("Failed to update order");

      toast.success("Order updated successfully!");
      setEditingOrder(null);
      fetchOrders();
      if (onOrderUpdated) onOrderUpdated();
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error(error.message);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const response = await fetch(`http://localhost:5000/orders/${orderId}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete order");

      toast.success("Order deleted successfully!");
      fetchOrders();
      if (onOrderUpdated) onOrderUpdated();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(error.message);
    }
  };

  // Pagination logic
  const pageCount = Math.ceil(orders.length / itemsPerPage);
  const paginatedOrders = orders.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center space-x-2">
        <FaCashRegister size={28} />
        <span>Order Management</span>
      </h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mb-6 transition"
      >
        {showForm ? "Hide Order Form" : "Create New Order"}
      </button>

      

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Orders</h3>
        
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders found</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead>
                  <tr className="bg-green-700 text-white">
                    <th className="px-4 py-3 text-left">Farmer</th>
                    <th className="px-4 py-3 text-left">Type</th>
                    <th className="px-4 py-3 text-right">Quantity</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map(order => {
                    const isEditing = editingOrder === order.id;
                    return (
                      <tr key={order.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">
                          {farmers.find(f => f.id === order.farmer_id)?.name || order.farmer_id}
                        </td>
                        <td className="px-4 py-3">{order.avocado_type}</td>
                        <td className="px-4 py-3 text-right">
                          {isEditing ? (
                            <input
                              type="number"
                              name="numberOfFruits"
                              min="1"
                              value={editFormData.numberOfFruits}
                              onChange={handleEditInputChange}
                              className="w-20 p-1 border rounded text-right"
                            />
                          ) : (
                            order.number_of_fruits
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isEditing ? (
                            <input
                              type="number"
                              name="pricePerFruit"
                              min="1"
                              step="0.01"
                              value={editFormData.pricePerFruit}
                              onChange={handleEditInputChange}
                              className="w-20 p-1 border rounded text-right"
                            />
                          ) : (
                            order.price_per_fruit.toFixed(2)
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {isEditing ? editFormData.totalAmount.toFixed(2) : order.total_amount.toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          {new Date(order.order_date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleEditOrder(order.id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded mr-2"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingOrder(null)}
                                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingOrder(order.id);
                                  setEditFormData({
                                    numberOfFruits: order.number_of_fruits,
                                    pricePerFruit: order.price_per_fruit,
                                    totalAmount: order.total_amount
                                  });
                                }}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {pageCount > 1 && (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 0))}
                  disabled={currentPage === 0}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-gray-700">
                  Page {currentPage + 1} of {pageCount}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, pageCount - 1))}
                  disabled={currentPage >= pageCount - 1}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default NewOrder;