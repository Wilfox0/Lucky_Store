import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../CartContext';

const Home = () => {
  const { addToCart } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [sections] = useState(['ملابس داخلية', 'أكسسوارات', 'أطقم']);
  const [products] = useState([
    {
      id: '1',
      name: 'سروال داخلي وردي',
      price: 120,
      rating: 4,
      images: ['https://i.ibb.co/2dK5xgX/pink-underwear.jpg'],
      colors: ['وردي', 'أحمر', 'أسود'],
      sizes: ['S', 'M', 'L'],
      section: 'ملابس داخلية',
      quantities: { 'وردي-S': 5, 'أحمر-M': 3 }
    },
    {
      id: '2',
      name: 'صدرية جميلة',
      price: 200,
      rating: 5,
      images: ['https://i.ibb.co/3FfQZjB/bra.jpg'],
      colors: ['أبيض', 'أسود'],
      sizes: ['S', 'M', 'L', 'XL'],
      section: 'ملابس داخلية',
      quantities: { 'أبيض-M': 4, 'أسود-L': 2 }
    },
    {
      id: '3',
      name: 'طقم داخلي فانتازي',
      price: 300,
      rating: 5,
      images: ['https://i.ibb.co/2W9GxKq/fantasy-set.jpg'],
      colors: ['أحمر', 'أسود'],
      sizes: ['M', 'L'],
      section: 'ملابس داخلية',
      quantities: { 'أحمر-M': 2, 'أسود-L': 1 }
    }
  ]);

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
