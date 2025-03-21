import React, { useState, useEffect } from "react";
import { FaCashRegister } from "react-icons/fa";
import { url } from "../../utils/baseUrl";
import ReactPaginate from "react-paginate";
const NewOrder = () => {
  const [farmers, setFarmers] = useState([]); // List of farmers for dropdown
  const [selectedFarmer, setSelectedFarmer] = useState(""); // Farmer ID
  const [customerName, setCustomerName] = useState(""); // Farmer's Name (Auto-filled)
  const [numberOfFruits, setNumberOfFruits] = useState(1);
  const [pricePerFruit, setPricePerFruit] = useState(1);
  const [totalAmount, setTotalAmount] = useState(0);
  const [ShowForm, setShowForm] = useState(false);
  const[OrderDate, setOrderDate] =useState();
  const [orders, setOrders] = useState([]); // List of orders
  const [editingOrder, setEditingOrder] = useState(null); // Track order being edited
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

    if (!selectedFarmer || numberOfFruits <= 1 || pricePerFruit <= 1) {
      alert("Please fill all fields correctly.");
      return;
    }

    const orderData = {
      farmerId: selectedFarmer,
      customerName, // Auto-filled based on selected farmer
      numberOfFruits,
      pricePerFruit,
      totalAmount,
    };

    try {
      const response = await fetch("http://localhost:5000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        alert("Order recorded successfully!");
        fetchOrders();
        setSelectedFarmer("");
        setCustomerName("");
        setNumberOfFruits(1);
        setPricePerFruit(1);
        setTotalAmount(0);
        setShowForm(false);
      } else {
        const errorData = await response.json();
        alert(`Failed to record order: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error recording order:", error);
      alert("An error occurred while recording the order.");
    }
  };
  // Handle edit order form submission
  const handleEditOrder = async (orderId) => {
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
        alert("Order updated successfully!");
        setEditingOrder(null);
        fetchOrders();
      } else {
        alert("Failed to update order.");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };
  // Handle order deliting
  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
  
    try {
      const response = await fetch(`${url}/orders/${orderId}`, {
        method: "DELETE",
      });
  
      if (response.ok) {
        alert("Order deleted successfully!");
        fetchOrders();
      } else {
        alert("Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };
  // Pagination logic
  const offset = currentPage * itemsPerPage;
  const paginatedorders = orders.slice(offset, offset + itemsPerPage);
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
      <button onClick={() => setShowForm(!ShowForm)} className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-4">
        {ShowForm ? "Hide Form" : "New order"}
      </button>
      
      
      {/* New Order Form */}
      {ShowForm && (
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
                setCustomerName(selected ? selected.name : ""); // Auto-fill customer name
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
                <th className="px-4 py-3 border">order date</th>
                <th className="px-4 py-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
  {paginatedorders.map((order) => (
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
          order.number_of_fruits
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
          order.price_per_fruit
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
          <button
        className="bg-green-300 px-2 py-2 ml-4 mt-3 rounded"
        onClick={() => {
          setItemsPerPage(itemsPerPage === 10 ? 5 : 10);
        }}
      >
        {itemsPerPage === 5 ? "more" : "less"}
      </button>
        </div>
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
    </div>
  );
};

export default NewOrder;
