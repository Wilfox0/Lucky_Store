import React, { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (product, selectedColor, selectedSize) => {
    setCart(prev => {
      const existing = prev.find(
        item => item.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
      );
      if (existing) {
        return prev.map(item =>
          item.id === product.id && item.selectedColor === selectedColor && item.selectedSize === selectedSize
            ? { ...item, quantity: (item.quantity ?? 1) + 1 }
            : item
        );
      } else {
        return [...prev, { ...product, selectedColor, selectedSize, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id, color, size) => {
    setCart(prev => prev.filter(item => !(item.id === id && item.selectedColor === color && item.selectedSize === size)));
  };

  const updateQuantity = (id, color, size, quantity) => {
    setCart(prev =>
      prev.map(item =>
        item.id === id && item.selectedColor === color && item.selectedSize === size
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
