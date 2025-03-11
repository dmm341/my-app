import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import StartUp from "../src/components/StartUp";
import Login from "../src/components/Login";
import Register from "../src/components/Register";
import DashboardLayout from "./Layouts/DashboardLayouts";
import Dashboard from "./components/Pages/Dashboard";
import Analytics from "./components/Pages/Analytics";
import NotFound from "./components/NotFound"; // Add this component
import Farmers from "./components/Pages/Farmers";
import NewSale from "./components/Pages/NewOrder";
import Buyers from "./components/Pages/Buyers";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/overview" element={<Dashboard />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<Dashboard />} />
  <Route path="NewSale" element={<NewSale />} />
  <Route path="analytics" element={<Analytics />} />
  <Route path="farmers" element={<Farmers />} />
  <Route path="Buyers" element={<Buyers />} />
</Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;