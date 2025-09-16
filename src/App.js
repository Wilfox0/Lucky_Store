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
import AdminLogin from "./pages/AdminLogin"; // صفحة تسجيل دخول الأدمن
import ProductDetail from "./pages/ProductDetail"; // ✅ صفحة تفاصيل المنتج الجديدة

// Cart Context
import { CartProvider, useCart } from "./CartContext";

// Styles
import "./styles/main.css";

// Wrapper لتوصيل cartCount والأقسام والروابط للـ Navbar و Footer
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

  // قائمة البريد الإلكتروني للأدمنات
  const admins = ["owner@email.com", "admin2@email.com"];
  const [currentAdmin, setCurrentAdmin] = useState(localStorage.getItem("adminEmail") || "");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // إعدادات المتجر
        const settingsSnap = await getDocs(collection(db, "settings"));
        settingsSnap.forEach((doc) => setStoreSettings(doc.data()));

        // المنتجات والأقسام
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
        ownerEmail={admins[0]}         
        currentUserEmail={currentAdmin}
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
              currentAdmin && admins.includes(currentAdmin) ? (
                <AdminPanel ownerEmails={admins} currentUserEmail={currentAdmin} />
              ) : (
                <AdminLogin admins={admins} setCurrentAdmin={setCurrentAdmin} />
              )
            }
          />

          {/* ✅ إضافة صفحة ProductDetail مع تمرير بيانات المنتجات */}
          <Route
            path="/product/:id"
            element={<ProductDetail />}
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

// ملف App الرئيسي يلف CartProvider
function App() {
  return (
    <CartProvider>
      <AppWithCart />
    </CartProvider>
  );
}

export default App;
