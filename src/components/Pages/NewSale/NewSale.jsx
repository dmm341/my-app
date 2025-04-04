import React from 'react'
import { FaShoppingCart } from 'react-icons/fa'
const NewSale = () => {
  return (
    <>
    <div className="p-6 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center space-x-2">
            <FaShoppingCart size={28} className="text-green-600" />
            <span>New Sale</span>
          </h2>
          </div>
    </>
  )
}

export default NewSale