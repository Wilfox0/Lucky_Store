// src/pages/Home.jsx
import React from "react";
import ProductCard from "../components/ProductCard";

const Home = ({ products, searchTerm }) => {
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home">
      {filteredProducts.length > 0 ? (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="no-results">لا توجد منتجات مطابقة للبحث</p>
      )}
    </div>
  );
};

export default Home;
