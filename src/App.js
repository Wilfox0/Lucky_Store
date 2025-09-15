import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import AdminPanel from "./components/AdminPanel";

// Cart Context
import { CartProvider, useCart } from "./CartContext";

// Styles
import "./styles/main.css";

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

  // قائمة الأدمنز
  const admins = [
    "owner@email.com",
    "admin2@email.com",
    "admin3@email.com"
  ];

  // البريد الحالي للمستخدم
  const currentUserEmail = "owner@email.com";

  // تحقق إذا كان المستخدم أدمن
  const isAdmin = admins.includes(currentUserEmail);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const settingsSnap = await getDocs(collection(db, "settings"));
        settingsSnap.forEach((doc) => setStoreSettings(doc.data()));

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
        ownerEmail={currentUserEmail}
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
              isAdmin ? <AdminPanel /> : <p>🚫 غير مصرح بالدخول</p>
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

function App() {
  return (
    <CartProvider>
      <AppWithCart />
    </CartProvider>
  );
}

export default App;
