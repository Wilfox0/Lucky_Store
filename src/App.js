// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CartProvider } from "./CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentAdmin, setCurrentAdmin] = useState(localStorage.getItem("adminEmail") || "");
  const [products, setProducts] = useState([]);
  const [storeSettings, setStoreSettings] = useState({ storeName: "متجري", socialLinks: {} });

  return (
    <CartProvider>
      <Router>
        <Navbar
          cartCount={0}
          ownerEmail="owner@example.com"
          currentUserEmail={currentAdmin}
          storeSettings={storeSettings}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sections={[]}
        />
        <Routes>
          <Route path="/" element={<Home products={products} searchTerm={searchTerm} />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={currentAdmin ? <AdminPanel /> : <AdminLogin admins={["owner@example.com"]} setCurrentAdmin={setCurrentAdmin} />} />
        </Routes>
        <Footer storeName={storeSettings.storeName} socialLinks={storeSettings.socialLinks} />
      </Router>
    </CartProvider>
  );
}

export default App;
