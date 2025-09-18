// src/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import Toast from './components/Toast';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const addToCart = (product, color, size) => {
    const key = `${color}-${size}`;
    const remainingQuantity = product.quantities[key] || 0;

    const existing = cart.find(
      item => item.id === product.id && item.selectedColor === color && item.selectedSize === size
    );

    if (existing) {
      const newQty = (existing.quantity || 1) + 1;
      if (newQty > remainingQuantity) {
        showToast(`الحد الأقصى للكمية هو ${remainingQuantity}`, "warning");
        return;
      }
      setCart(prev => prev.map(item => 
        item.id === product.id && item.selectedColor === color && item.selectedSize === size
          ? { ...item, quantity: newQty }
          : item
      ));
      showToast("تم زيادة كمية المنتج في السلة", "success");
    } else {
      if (remainingQuantity <= 0) {
        showToast('هذا المنتج غير متوفر حاليًا', "error");
        return;
      }
      setCart(prev => [...prev, { ...product, selectedColor: color, selectedSize: size, quantity: 1 }]);
      showToast("تم إضافة المنتج إلى السلة", "success");
    }
  };

  const removeFromCart = (id, color, size) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedColor === color && item.selectedSize === size)));
    showToast("تم حذف المنتج من السلة", "info");
  };

  const clearCart = () => {
    setCart([]);
    showToast("تم تفريغ السلة", "info");
  };

  const updateQuantity = (id, color, size, quantity, maxQuantity) => {
    if (quantity > maxQuantity) {
      showToast(`الحد الأقصى للكمية هو ${maxQuantity}`, "warning");
      quantity = maxQuantity;
    }
    setCart(prev => prev.map(item =>
      item.id === id && item.selectedColor === color && item.selectedSize === size
        ? { ...item, quantity }
        : item
    ));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} />
      ))}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
