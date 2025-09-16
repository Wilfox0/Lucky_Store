import React from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../CartContext";

const Home = ({ products, searchTerm }) => {
  const { addToCart } = useCart();

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
