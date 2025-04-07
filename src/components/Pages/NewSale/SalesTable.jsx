import React, { useState, useEffect } from 'react';
import SaleService from './SaleApi'; 
import { FaEdit, FaTrash, FaSync, FaSearch, FaSort, FaSortUp, FaSortDown, FaAngleLeft, FaAngleRight, FaAngleDoubleLeft, FaAngleDoubleRight, } from 'react-icons/fa';

const SalesTable = () => {
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingSale, setEditingSale] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'sale_date',
    direction: 'desc'
  });
  const [editFormData, setEditFormData] = useState({
    buyerId: '',
    buyerName: '',
    numberOfFruits: '',
    pricePerFruit: '',
    totalAmount: ''
  });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch sales
  const fetchSales = async () => {
    setLoading(true);
    try {
      const data = await SaleService.getSales();
      setSales(data);
      setFilteredSales(data);
      setCurrentPage(1);
    } catch (err) {
      setError(err.message || 'Failed to fetch sales');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // Apply search filter
  useEffect(() => {
    const filtered = sales.filter(sale => {
      const searchLower = searchTerm.toLowerCase();
      return (
        sale.id.toString().includes(searchLower) ||
        sale.buyer_id.toString().includes(searchLower) ||
        (sale.buyer_name && sale.buyer_name.toLowerCase().includes(searchLower)) ||
        sale.avocado_type.toLowerCase().includes(searchLower) ||
        sale.number_of_fruits.toString().includes(searchLower) ||
        sale.total_amount.toString().includes(searchLower));
    });
    setFilteredSales(filtered);
    setCurrentPage(1);
  }, [searchTerm, sales]);

  // Sort sales
  const sortedSales = React.useMemo(() => {
    let sortableSales = [...filteredSales];
    if (sortConfig.key) {
      sortableSales.sort((a, b) => {
        let aValue, bValue;
        
        if (sortConfig.key === 'sale_date') {
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
    return sortableSales;
  }, [filteredSales, sortConfig]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedSales.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedSales.length / itemsPerPage);

  // Handle edit click
  const handleEditClick = (sale) => {
    setEditingSale(sale.id);
    setEditFormData({
      buyerId: sale.buyer_id,
      buyerName: sale.buyer_name,
      numberOfFruits: sale.number_of_fruits,
      pricePerFruit: sale.price_per_fruit,
      totalAmount: sale.total_amount
    });
  };

  // Handle edit form change
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

  // Handle edit submit
  const handleEditSubmit = async (saleId) => {
    try {
      await SaleService.updateSale(saleId, editFormData);
      await fetchSales();
      setEditingSale(null);
    } catch (err) {
      setError(err.message || 'Failed to update sale');
    }
  };

  // Handle delete sale
  const handleDeleteSale = async (saleId) => {
    if (window.confirm('Are you sure you want to delete this sale?')) {
      try {
        await SaleService.deleteSale(saleId);
        await fetchSales();
      } catch (err) {
        setError(err.message || 'Failed to delete sale');
      }
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Table headers
  const headers = [
    { key: 'id', label: 'ID' },
    { key: 'sale_date', label: 'Sale Date' },
    { key: 'buyer_id', label: 'Buyer ID' },
    { key: 'buyer_name', label: 'Buyer Name' },
    { key: 'avocado_type', label: 'Avocado Type' },
    { key: 'number_of_fruits', label: 'Quantity' },
    { key: 'price_per_fruit', label: 'Price/Fruit' },
    { key: 'total_amount', label: 'Total' }
  ];

  if (loading) return <div className="text-center py-4">Loading sales...</div>;
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>;

  return (
    <div className="space-y-4">
      {/* Search and controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-grow max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                setCurrentPage(1);
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
            onClick={fetchSales}
            className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <FaSync className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Sales table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-blue-50">
            <tr>
              {headers.map(header => (
                <th 
                  key={header.key}
                  className="py-2 px-4 border-b cursor-pointer"
                  onClick={() => requestSort(header.key)}
                >
                  <div className="flex items-center justify-center">
                    {header.label} {FaSort(header.key)}
                  </div>
                </th>
              ))}
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td colSpan={headers.length + 1} className="py-4 text-center text-gray-500">
                  No sales found
                </td>
              </tr>
            ) : (
              currentItems.map((sale) => (
                <tr key={sale.id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b text-center">{sale.id}</td>
                  <td className="py-2 px-4 border-b text-center">{formatDate(sale.sale_date)}</td>
                  <td className="py-2 px-4 border-b text-center">{sale.buyer_id}</td>
                  <td className="py-2 px-4 border-b text-center">{sale.buyer_name}</td>
                  <td className="py-2 px-4 border-b text-center">{sale.avocado_type}</td>
                  
                  {editingSale === sale.id ? (
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
                      <td className="py-2 px-4 border-b text-center">{sale.number_of_fruits}</td>
                      <td className="py-2 px-4 border-b text-center">{sale.price_per_fruit.toFixed(2)}</td>
                      <td className="py-2 px-4 border-b text-center">{sale.total_amount.toFixed(2)}</td>
                    </>
                  )}
                  
                  <td className="py-2 px-4 border-b text-center">
                    {editingSale === sale.id ? (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditSubmit(sale.id)}
                          className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSale(null)}
                          className="p-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleEditClick(sale)}
                          className="p-1 text-blue-500 hover:text-blue-700"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteSale(sale.id)}
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
      {sortedSales.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4">
          <div className="mb-2 sm:mb-0">
            <span className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedSales.length)} of {sortedSales.length} entries
            </span>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="First Page"
            >
              <FaAngleDoubleLeft />
            </button>
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Previous Page"
            >
              <FaAngleLeft />
            </button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = currentPage <= 3 
                ? i + 1 
                : currentPage >= totalPages - 2 
                  ? totalPages - 4 + i 
                  : currentPage - 2 + i;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 mx-1 rounded ${currentPage === pageNum ? 'bg-blue-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              title="Next Page"
            >
              <FaAngleRight />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
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

export default SalesTable;