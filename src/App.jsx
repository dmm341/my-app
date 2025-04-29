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
import NewOrder from "./components/Pages/new order/NewOrder";
import Buyers from "./components/Pages/Buyers";
import NewSale from "./components/Pages/NewSale/NewSale";
import LayoutSelector from "./main views/LayoutSelector";
import NewLayout from "./Layouts/NewLayout";
import Trips from "./components/pages-2/Trips/Trips";
import Sales from "./components/pages-2/sale/Sales";
import Purchases from "./components/pages-2/purchase/Purchases";
import Labour from "./components/pages-2/labour/labour";
import Home from "./components/pages-2/Home";
import NewAnalytics from "./components/pages-2/analytics/NewAnalytics";
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/overview" element={<Dashboard />} />
        <Route path="/LayoutSelector" element={<LayoutSelector />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<Dashboard />} />
  <Route path="NewOrder" element={<NewOrder/>} />
  <Route path="analytics" element={<Analytics />} />
  <Route path="farmers" element={<Farmers />} />
  <Route path="Buyers" element={<Buyers />} />
  <Route path="NewSale" element={<NewSale />} />
  
</Route>
        <Route path="/newlayout" element={<NewLayout />} >
        <Route index element={<Home />} />
  <Route path="trips" element={<Trips/>} />
  <Route path="sales" element={<Sales />} />
  <Route path="purchases" element={<Purchases />} />
  <Route path="labour" element={<Labour />} />
  <Route path="analytics" element={<NewAnalytics />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;