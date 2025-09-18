// src/components/Toast.js
import React, { useState, useEffect } from "react";

const Toast = ({ message, type = "info", duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const colors = {
    info: "#2196f3",
    success: "#4caf50",
    warning: "#ff9800",
    error: "#f44336"
  };

  return (
    <div style={{
      position: "fixed",
      top: "20px",
      right: "20px",
      backgroundColor: colors[type] || colors.info,
      color: "#fff",
      padding: "12px 20px",
      borderRadius: "5px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
      zIndex: 9999,
      fontFamily: "Arial, sans-serif"
    }}>
      {message}
    </div>
  );
};

export default Toast;
