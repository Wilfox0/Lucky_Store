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
      <img src={product.images[0]} alt={product.name} style={{ width: '100%', borderRadius: '10px' }} />
      <h3>{product.name}</h3>
      <p>السعر: {product.price} جنيه</p>
      <p>الكميه المتبقيه: {product.quantities[`${product.colors[0]}-${product.sizes[0]}`] || 0}</p>
      <p>التقييم: {'⭐'.repeat(product.rating)}</p>

      <div>
        <label>اللون:</label>
        <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
          {product.colors.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label>المقاس:</label>
        <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
          {product.sizes.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <button onClick={handleAdd} style={{ marginTop: '10px', padding: '5px 10px', borderRadius: '5px', backgroundColor: '#c71585', color: '#fff' }}>
        أضف إلى السلة
      </button>
    </div>
  );
};

export default ProductCard;
