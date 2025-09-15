import React from "react";
import ProductCard from "../components/ProductCard";
import { useCart } from "../CartContext";

const Home = ({ products, searchTerm }) => {
  const { addToCart } = useCart();

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.section.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{
      padding: '20px',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '20px',
      justifyItems: 'center'
    }}>
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} addToCart={addToCart} />
      ))}
      {filteredProducts.length === 0 && <p>لا يوجد منتجات مطابقة للبحث</p>}
    </div>
  );
};

export default Home;
