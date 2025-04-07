import React, { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'
import NewSaleForm from './NewSaleForm'
import SalesTable from './SalesTable'

const NewSale = () => {
  const [showForm, setShowForm] = useState(false);
  
  const handleSaleCreated = () => {
    // You can refetch sales or update state here
    console.log("Sale created successfully!");
    setShowForm(false);
  };

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-blue-700 mb-6 flex items-center space-x-2">
          <FaShoppingCart size={28} />
          <span>Sales Management</span>
        </h2>
      </div>
      
      <div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {showForm ? "Hide Form" : "New Sale"}
        </button>
      </div>
      
      {showForm && <NewSaleForm onSaleCreated={handleSaleCreated} />}
      
      <div className='p-6'>
        <SalesTable />
      </div>
    </>
  )
}

export default NewSale