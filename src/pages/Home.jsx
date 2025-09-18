import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../CartContext";
import { supabase } from "../supabaseClient";

const Home = ({ searchTerm }) => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  // جلب المنتجات من Supabase عند تحميل الصفحة
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*");

      if (error) {
        console.error("خطأ عند جلب المنتجات:", error);
      } else {
        setProducts(data);
      }
    };

    fetchProducts();
  }, []);

  // تصفية المنتجات بناءً على البحث
  const filteredProducts = products.filter((p) => {
    return p.name.includes(searchTerm) || p.section?.includes(searchTerm);
  });

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center", padding: "20px" }}>
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} addToCart={addToCart} />
      ))}
      {filteredProducts.length === 0 && <p>لا توجد منتجات مطابقة للبحث</p>}
    </div>
  );
};

export default Home;
