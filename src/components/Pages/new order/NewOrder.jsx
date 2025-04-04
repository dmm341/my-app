import React,{useState,useEffect} from 'react'
import { FaCashRegister } from 'react-icons/fa'
import NewOrderForm from './NewOrderForm'
import OrdersTable from './OrdersTable'

const NewOrder = () => {
  const [showForm, setShowForm] = useState(false);
  const handleOrderCreated = () => {
    // You can refetch orders or update state here
    console.log("Order created successfully!");
    setShowForm(false);
  };
  return (
    <>
     <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-green-700 mb-6 flex items-center space-x-2">
        <FaCashRegister size={28} />
        <span>Order Management</span>
      </h2>
      </div>
      <div>
        <button onClick={()=> setShowForm(!showForm)}
         className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400">
          {showForm ? "hide form":"new order"}</button></div>
          {showForm && <NewOrderForm  onOrderCreated={handleOrderCreated}/>}
      <div className='p-6'>< OrdersTable/></div>

    </>
  )
}

export default NewOrder