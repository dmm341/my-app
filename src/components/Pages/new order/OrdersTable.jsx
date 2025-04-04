import React, { useState, useEffect } from 'react';
import OrderService from '../new order/OrderApi';
import { FaEdit, FaTrash, FaSync, FaSearch, FaSort, FaSortUp, FaSortDown, FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight } from 'react-icons/fa';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'order_date',
    direction: 'desc'
  });
  const [editFormData, setEditFormData] = useState({
    numberOfFruits: '',
    pricePerFruit: '',
    totalAmount: ''
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await OrderService.getOrders();
      setOrders(data);
      setFilteredOrders(data);
      setCurrentPage(1); // Reset to first page when new data loads
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply search filter whenever searchTerm or orders change
  useEffect(() => {
    const filtered = orders.filter(order => {
      const searchLower = searchTerm.toLowerCase();
      return (
        order.id.toString().includes(searchLower) ||
        order.farmer_id.toString().includes(searchLower) ||
        order.avocado_type.toLowerCase().includes(searchLower) ||
        order.customer_name.toLowerCase().includes(searchLower) ||
        order.number_of_fruits.toString().includes(searchLower) ||
        order.total_amount.toString().includes(searchLower));
    });
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchTerm, orders]);

  // Sort orders
  const sortedOrders = React.useMemo(() => {
    let sortableOrders = [...filteredOrders];
    if (sortConfig.key) {
      sortableOrders.sort((a, b) => {
        // Handle different data types for sorting
        let aValue, bValue;
        
        if (sortConfig.key === 'order_date') {
          aValue = new Date(a[sortConfig.key]);
          bValue = new Date(b[sortConfig.key]);
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableOrders;
  }, [filteredOrders, sortConfig]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);
  const firstPage = () => setCurrentPage(1);
  const lastPage = () => setCurrentPage(totalPages);

  // Request sort
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon for header
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="ml-1 opacity-30" />;
    if (sortConfig.direction === 'asc') return <FaSortUp className="ml-1" />;
    return <FaSortDown className="ml-1" />;
  };

  // Handle edit button click
  const handleEditClick = (order) => {
    setEditingOrder(order.id);
    setEditFormData({
      numberOfFruits: order.number_of_fruits,
      pricePerFruit: order.price_per_fruit,
      totalAmount: order.total_amount
    });
  };

  // Handle edit form input change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    const newValue = name === 'pricePerFruit' ? parseFloat(value) : parseInt(value);
    
    setEditFormData(prev => ({
      ...prev,
      [name]: newValue,
      totalAmount: name === 'numberOfFruits' 
        ? newValue * prev.pricePerFruit 
        : name === 'pricePerFruit' 
          ? prev.numberOfFruits * newValue 
          : prev.totalAmount
    }));
  };

  // Handle edit form submission
  const handleEditSubmit = async (orderId) => {
    try {
      await OrderService.updateOrder(orderId, editFormData);
      await fetchOrders(); // Refresh orders after update
      setEditingOrder(null);
    } catch (err) {
      setError(err.message || 'Failed to update order');
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await OrderService.deleteOrder(orderId);
        await fetchOrders(); // Refresh orders after delete
      } catch (err) {
        setError(err.message || 'Failed to delete order');
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Page number buttons
  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-3 py-1 mx-1 rounded ${currentPage === i ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          {i}
        </button>
      );
    }

    return pageNumbers;
  };

  if (loading) return <div className="text-center py-4">Loading orders...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600">Items per page:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page when changing items per page
              }}
              className="border rounded p-1 text-sm"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          
          <button
            onClick={fetchOrders}
            className="flex items-center justify-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            <FaSync className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-green-50">
            <tr>
              <th 
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => requestSort('id')}
              >
                <div className="flex items-center justify-center">
                  ID {getSortIcon('id')}
                </div>
              </th>
              <th 
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => requestSort('order_date')}
              >
                <div className="flex items-center justify-center">
                  Order Date {getSortIcon('order_date')}
                </div>
              </th>
              <th 
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => requestSort('farmer_id')}
              >
                <div className="flex items-center justify-center">
                  Farmer ID {getSortIcon('farmer_id')}
                </div>
              </th>
              <th className="py-2 px-4 border-b">Avocado Type</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th 
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => requestSort('number_of_fruits')}
              >
                <div className="flex items-center justify-center">
                  Quantity {getSortIcon('number_of_fruits')}
                </div>
              </th>
              <th className="py-2 px-4 border-b">Price/Fruit</th>
              <th 
                className="py-2 px-4 border-b cursor-pointer"
                onClick={() => requestSort('total_amount')}
              >
                <div className="flex items-center justify-center">
                  Total {getSortIcon('total_amount')}
                </div>
              </th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan="9" className="py-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            ) : (
              currentItems.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-center">{order.id}</td>
                  <td className="py-2 px-4 border-b text-center">{formatDate(order.order_date)}</td>
                  <td className="py-2 px-4 border-b text-center">{order.farmer_id}</td>
                  <td className="py-2 px-4 border-b text-center">{order.avocado_type}</td>
                  <td className="py-2 px-4 border-b text-center">{order.customer_name}</td>
                  
                  {editingOrder === order.id ? (
                    <>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="number"
                          name="numberOfFruits"
                          value={editFormData.numberOfFruits}
                          onChange={handleEditFormChange}
                          className="w-full p-1 border rounded"
                          min="1"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="number"
                          name="pricePerFruit"
                          value={editFormData.pricePerFruit}
                          onChange={handleEditFormChange}
                          className="w-full p-1 border rounded"
                          min="0.01"
                          step="0.01"
                        />
                      </td>
                      <td className="py-2 px-4 border-b">
                        <input
                          type="number"
                          name="totalAmount"
                          value={editFormData.totalAmount}
                          readOnly
                          className="w-full p-1 border rounded bg-gray-100"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2 px-4 border-b text-center">{order.number_of_fruits}</td>
                      <td className="py-2 px-4 border-b text-center">{order.price_per_fruit.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b text-center">{order.total_amount.toFixed(2)}</td>
                    </>
                  )}
                  
                  <td className="py-2 px-4 border-b text-center">
                    {editingOrder === order.id ? (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditSubmit(order.id)}
                          className="p-1 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingOrder(null)}
                          className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditClick(order)}
                          className="p-1 text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      {sortedOrders.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
          <div className="mb-2 sm:mb-0">
            <span className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedOrders.length)} of {sortedOrders.length} entries
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={firstPage}
              disabled={currentPage === 1}
              className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="First Page"
            >
              <FaAngleDoubleLeft />
            </button>
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <FaAngleLeft />
            </button>
            
            {renderPageNumbers()}
            
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Page"
            >
              <FaAngleRight />
            </button>
            <button
              onClick={lastPage}
              disabled={currentPage === totalPages}
              className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Last Page"
            >
              <FaAngleDoubleRight />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;