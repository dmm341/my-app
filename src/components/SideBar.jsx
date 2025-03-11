import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBars, FaChartBar, FaSignOutAlt, FaHome, FaUsers,FaTruck,FaShoppingCart } from "react-icons/fa";
import { Tooltip } from "react-tooltip"; // Import Tooltip

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div
        className={`bg-green-700 text-white h-screen p-5 flex flex-col fixed top-0 left-0 transition-all duration-300 ${
          isOpen ? "w-64" : "w-[80px]"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between">
          <h1 className={`text-xl font-bold ${!isOpen && "hidden"}`}>Avocado Hub</h1>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-green-300 focus:outline-none"
            data-tooltip-id="sidebar-tooltip" // Add tooltip ID
            data-tooltip-content="Toggle Sidebar" // Add tooltip content
          >
            <FaBars size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-10 flex flex-col space-y-4">
          <Link
            to="/dashboard"
            className="flex items-center space-x-3 p-3 rounded-lg hover:bg-green-600 transition"
            data-tooltip-id="sidebar-tooltip" // Add tooltip ID
            data-tooltip-content="Dashboard" // Add tooltip content
          >
            <FaHome size={20} />
            <span className={`${!isOpen && "hidden"}`}>Dashboard</span>
          </Link>
          <Link
            to="/dashboard/NewSale"
            className="inline-flex items-center space-x-3 p-3 rounded-lg hover:bg-green-600 transition"
            data-tooltip-id="sidebar-tooltip" // Add tooltip ID
            data-tooltip-content="new order" // Add tooltip content
          >
            <FaShoppingCart size={20} />
            <span className={`${!isOpen && "hidden"}`}>new sale</span>
          </Link>
          <Link
            to="/dashboard/Buyers"
            className="inline-flex items-center space-x-3 p-3 rounded-lg hover:bg-green-600 transition"
            data-tooltip-id="sidebar-tooltip" // Add tooltip ID
            data-tooltip-content="Buyer" // Add tooltip content
          >
            <FaTruck size={20} />
            <span className={`${!isOpen && "hidden"}`}>Buyer</span>
          </Link>
          <Link
            to="/dashboard/analytics"
            className="inline-flex items-center space-x-3 p-3 rounded-lg hover:bg-green-600 transition"
            data-tooltip-id="sidebar-tooltip" // Add tooltip ID
            data-tooltip-content="Analytics" // Add tooltip content
          >
            <FaChartBar size={20} />
            <span className={`${!isOpen && "hidden"}`}>Analytics</span>
          </Link>

          <Link
            to="/dashboard/Farmers"
            className="inline-flex items-center space-x-3 p-3 rounded-lg hover:bg-green-600 transition"
            data-tooltip-id="sidebar-tooltip" // Add tooltip ID
            data-tooltip-content="Farmers" // Add tooltip content
          >
            <FaUsers size={20} />
            <span className={`${!isOpen && "hidden"}`}>Farmers</span>
          </Link>

          
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-3 p-3 rounded-lg hover:bg-red-600 transition"
            data-tooltip-id="sidebar-tooltip" // Add tooltip ID
            data-tooltip-content="Logout" // Add tooltip content
          >
            <FaSignOutAlt size={20} />
            <span className={`${!isOpen && "hidden"}`}>Logout</span>
          </button>
        </nav>
      </div>

      {/* Tooltip Component */}
      <Tooltip id="sidebar-tooltip" place="right" delayShow={300} className="z-50" />
    </div>
  );
};

export default Sidebar;