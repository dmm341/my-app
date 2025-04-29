import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import NewSideBar from "../components/NewSideBar";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Set to false for closed by default
  return (
    <div className="flex">
      <NewSideBar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div
        className={`p-6 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
      </div>
        <div className="flex-1 p-6 bg-gray-100 min-h-screen">
            <Outlet />
            </div>
    </div>
  );
};
export default DashboardLayout;