import React, { useState } from 'react';

const ProductCard = ({ product, addToCart }) => {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');

  const handleAdd = () => {
    if (!selectedSize || !selectedColor) {
      alert('يرجى اختيار اللون والمقاس');
      return;
    }
    addToCart(product, selectedColor, selectedSize);
    alert('تم إضافة المنتج إلى السلة');
  };

  return (
    <div style={{
      width: '250px',
      border: '1px solid #ffc0cb',
      borderRadius: '10px',
      padding: '10px',
      background: '#fff0f5',
      textAlign: 'center',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s'
    }}>
      {product.images[0] && <img src={product.images[0]} alt={product.name} style={{ width: '100%', borderRadius: '10px', height: '200px', objectFit: 'cover' }} />}
      <h3 style={{ color: '#c71585', margin: '10px 0' }}>{product.name}</h3>
      <p style={{ color: '#ff1493', fontWeight: 'bold' }}>{product.price} ج.م</p>
      <p style={{ fontWeight: 'bold', color: '#ff69b4' }}>الكمية المتبقية: {Object.values(product.quantities).reduce((a,b) => a+b,0)}</p>

      <div style={{ color: '#ff69b4', marginBottom: '10px' }}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i}>{i < product.rating ? '★' : '☆'}</span>
        ))}
      </div>

      {product.colors.length > 0 && (
        <div style={{ marginBottom: '5px' }}>
          <label>اللون: </label>
          <select value={selectedColor} onChange={e => setSelectedColor(e.target.value)}
                  style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ffc0cb' }}>
            {product.colors.map(color => <option key={color} value={color}>{color}</option>)}
          </select>
        </div>
      )}

      {product.sizes.length > 0 && (
        <div style={{ marginBottom: '10px' }}>
          <label>المقاس: </label>
          <select value={selectedSize} onChange={e => setSelectedSize(e.target.value)}
                  style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ffc0cb' }}>
            {product.sizes.map(size => <option key={size} value={size}>{size}</option>)}
          </select>
        </div>
      )}

      <button onClick={handleAdd} style={{
        background: '#ff69b4',
        color: '#fff',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer'
      }}>
        إضافة للسلة
      </button>
    </div>
  );
};

export default ProductCard;
