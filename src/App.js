// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import AdminLogin from "./pages/AdminLogin";
import AdminPanel from "./pages/AdminPanel";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { CartProvider } from "./CartContext";

// 👇 يمكنك تمرير المنتجات من Firebase أو ثابتة مؤقتًا
const sampleProducts = [
  {
    id: "1",
    name: "منتج تجريبي",
    price: 100,
    images: ["https://via.placeholder.com/250"],
    colors: ["أحمر", "أزرق"],
    sizes: ["S", "M", "L"],
    quantities: { "أحمر-S": 5, "أزرق-M": 3 },
    rating: 4,
    section: "ملابس"
  }
];

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentAdmin, setCurrentAdmin] = useState(localStorage.getItem("adminEmail") || "");
  
  // إعدادات المتجر المؤقتة
  const storeSettings = {
    storeName: "متجري",
    logo: "", // ضع رابط شعارك هنا إذا أردت
    socialLinks: { whatsapp: "", instagram: "", facebook: "" }
  };

  return (
    <CartProvider>
      <Router>
        <Navbar
          cartCount={0}
          ownerEmail="admin1@example.com"
          currentUserEmail={currentAdmin}
          storeSettings={storeSettings}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          sections={["ملابس", "إكسسوارات"]}
        />

        <Routes>
          <Route path="/" element={<Home products={sampleProducts} searchTerm={searchTerm} />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* صفحة تسجيل دخول الأدمن */}
          <Route
            path="/admin-login"
            element={<AdminLogin admins={["admin1@example.com","admin2@example.com"]} setCurrentAdmin={setCurrentAdmin} />}
          />

          {/* صفحة لوحة التحكم */}
          <Route
            path="/admin"
            element={<AdminPanel currentUserEmail={currentAdmin} currentUserPassword="123456" />}
          />
        </Routes>

        <Footer storeName={storeSettings.storeName} socialLinks={storeSettings.socialLinks} />
      </Router>
    </CartProvider>
  );
}

export default App;
