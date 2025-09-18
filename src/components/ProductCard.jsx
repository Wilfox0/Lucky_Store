import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import Toast from './Toast'; // مكون toast صغير لعرض الرسائل

const ProductCard = ({ product }) => {
  const { addToCart, cart } = useCart();
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || '');
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [toasts, setToasts] = useState([]);

  const key = `${selectedColor}-${selectedSize}`;
  const remainingQuantity = product.quantities[key] || 0;

  const showToast = (message, type = 'warning') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleAdd = () => {
    if (!selectedSize || !selectedColor) {
      showToast('يرجى اختيار اللون والمقاس', 'error');
      return;
    }

    const existingItem = cart.find(
      item => item.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
    );
    const currentInCart = existingItem ? existingItem.quantity : 0;

    if (currentInCart + 1 > remainingQuantity) {
      showToast(`الحد الأقصى للكمية لهذا المنتج هو ${remainingQuantity}`, 'warning');
      return;
    }

    addToCart(product, selectedColor, selectedSize);
    showToast('تم إضافة المنتج إلى السلة', 'success');
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
      {/* صور وروابط المنتج */}
      <Link to={`/product/${product.id}`}>
        <img
          src={product.images[0]}
          alt={product.name}
          style={{ width: '100%', borderRadius: '10px' }}
          loading="lazy"
        />
      </Link>
      <h3>
        <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {product.name}
        </Link>
      </h3>

      <p>السعر: {product.price} جنيه</p>
      <p>الكمية المتبقية: {remainingQuantity}</p>
      <p>التقييم: {'⭐'.repeat(product.rating || 0)}</p>

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

      <button
        onClick={handleAdd}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          borderRadius: '5px',
          backgroundColor: remainingQuantity === 0 ? '#ccc' : '#c71585',
          color: '#fff',
          cursor: remainingQuantity === 0 ? 'not-allowed' : 'pointer'
        }}
        disabled={remainingQuantity === 0}
      >
        {remainingQuantity === 0 ? 'انتهى' : 'أضف إلى السلة'}
      </button>

      {/* رسائل التحذير والنجاح */}
      <div style={{ position: 'relative' }}>
        {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} />)}
      </div>
    </div>
  );
};

export default ProductCard;
