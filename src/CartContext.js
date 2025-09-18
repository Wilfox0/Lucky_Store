// src/CartContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

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

  const addToCart = (product, color, size) => {
    const existing = cart.find(
      item => item.id === product.id && item.selectedColor === color && item.selectedSize === size
    );
    if (existing) {
      setCart(prev => prev.map(item => 
        item.id === product.id && item.selectedColor === color && item.selectedSize === size
          ? { ...item, quantity: (item.quantity || 1) + 1 }
          : item
      ));
    } else {
      setCart(prev => [...prev, { ...product, selectedColor: color, selectedSize: size, quantity: 1 }]);
    }
  };

  const removeFromCart = (id, color, size) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedColor === color && item.selectedSize === size)));
    showToast("تم حذف المنتج من السلة", "info");
  };

  const clearCart = () => setCart([]);

  const updateQuantity = (id, color, size, quantity) => {
    setCart(prev => prev.map(item =>
      item.id === id && item.selectedColor === color && item.selectedSize === size
        ? { ...item, quantity }
        : item
    ));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} />
      ))}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
