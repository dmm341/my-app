import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar";
const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Set to false for closed by default
  return (
    <div className="flex">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={`p-6 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
};
export default DashboardLayout;