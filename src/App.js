// src/App.js
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminPanel from "./components/AdminPanel";

// Pages
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

// Cart Context
import { CartProvider, useCart } from "./CartContext";

// Styles
import "./styles/main.css";

// Wrapper لتوصيل cartCount + بيانات المتجر
function AppWithCart() {
  const { cart } = useCart();
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const [storeSettings, setStoreSettings] = useState({
    storeName: "متجري",
    logo: "",
    socialLinks: {},
  });

  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // السماح بأكثر من أدمن
  const ownerEmails = ["owner@email.com", "admin2@email.com"];
  const currentUserEmail = "owner@email.com"; // مؤقتًا

  useEffect(() => {
    const fetchData = async () => {
      try {
        // تحميل إعدادات المتجر
        const settingsSnap = await getDocs(collection(db, "settings"));
        settingsSnap.forEach((doc) => setStoreSettings(doc.data()));

        // تحميل المنتجات + الأقسام
        const productsSnap = await getDocs(collection(db, "products"));
        const loadedProducts = [];
        const loadedSections = new Set();

        productsSnap.forEach((doc) => {
          const product = { id: doc.id, ...doc.data() };
          loadedProducts.push(product);
          if (product.section) loadedSections.add(product.section);
        });

        setProducts(loadedProducts);
        setSections([...loadedSections]);
      } catch (err) {
        console.error("❌ خطأ في تحميل البيانات:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Navbar
        ownerEmails={ownerEmails}
        currentUserEmail={currentUserEmail}
        storeSettings={storeSettings}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        sections={sections}
        cartCount={cartCount}
      />

      <main>
        <Routes>
          <Route
            path="/"
            element={<Home products={products} searchTerm={searchTerm} />}
          />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />
          <Route
            path="/admin"
            element={
              ownerEmails.includes(currentUserEmail) ? (
                <AdminPanel />
              ) : (
                <p>🚫 غير مصرح بالدخول</p>
              )
            }
          />
        </Routes>
      </main>

      <Footer
        socialLinks={storeSettings.socialLinks}
        storeName={storeSettings.storeName}
      />
    </>
  );
}

// ملف App الرئيسي
function App() {
  return (
    <CartProvider>
      <AppWithCart />
    </CartProvider>
  );
}

export default App;
