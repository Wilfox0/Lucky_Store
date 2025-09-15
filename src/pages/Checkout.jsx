// src/pages/Checkout.jsx
import React, { useState } from "react";
import { useCart } from "../CartContext";

const shippingRates = {
  "القاهرة": 30,
  "الجيزة": 35,
  "الأسكندرية": 40,
  "الدقهلية": 45,
  "المنوفية": 50,
  "الشرقية": 55
};

function Checkout() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
    governorate: "القاهرة"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (id, delta) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max((item.quantity || 1) + delta, 1); // لا تقل عن 1
    updateQuantity(id, newQty);
  };

  const shippingCost = shippingRates[customer.governorate] || 0;
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const totalWithShipping = cartTotal + shippingCost;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>سلة المشتريات</h2>
      {cart.length === 0 ? (
        <p style={{ textAlign: "center" }}>السلة فارغة</p>
      ) : (
        <>
          <table
            border="1"
            cellPadding="8"
            style={{
              borderCollapse: "collapse",
              width: "100%",
              marginBottom: "20px",
              textAlign: "center"
            }}
          >
            <thead style={{ backgroundColor: "#f2f2f2" }}>
              <tr>
                <th>المنتج</th>
                <th>السعر</th>
                <th>الكمية</th>
                <th>اللون</th>
                <th>المقاس</th>
                <th>الإجمالي</th>
                <th>إجراءات</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price} جنيه</td>
                  <td>
                    <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    <span style={{ margin: "0 8px" }}>{item.quantity || 1}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </td>
                  <td>{item.selectedColor || "-"}</td>
                  <td>{item.selectedSize || "-"}</td>
                  <td>{(item.price * (item.quantity || 1)).toFixed(2)} جنيه</td>
                  <td>
                    <button onClick={() => removeFromCart(item.id)}>حذف</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h3 style={{ marginBottom: "15px" }}>بيانات العميل</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
              <input
                type="text"
                name="name"
                placeholder="الاسم"
                value={customer.name}
                onChange={handleInputChange}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
              <input
                type="text"
                name="phone"
                placeholder="رقم الهاتف"
                value={customer.phone}
                onChange={handleInputChange}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
              <input
                type="text"
                name="address"
                placeholder="العنوان"
                value={customer.address}
                onChange={handleInputChange}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              />
              <select
                name="governorate"
                value={customer.governorate}
                onChange={handleInputChange}
                style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
              >
                {Object.keys(shippingRates).map((gov) => (
                  <option key={gov} value={gov}>{gov}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h3>ملخص الطلب</h3>
            <p>إجمالي المنتجات: {cartTotal} جنيه</p>
            <p>سعر الشحن: {shippingCost} جنيه</p>
            <p><strong>الإجمالي الكلي: {totalWithShipping} جنيه</strong></p>
          </div>

          <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h3>فاتورة تفصيلية لكل منتج</h3>
            <table
              border="1"
              cellPadding="8"
              style={{ borderCollapse: "collapse", width: "100%", textAlign: "center" }}
            >
              <thead style={{ backgroundColor: "#f9f9f9" }}>
                <tr>
                  <th>المنتج</th>
                  <th>السعر</th>
                  <th>الكمية</th>
                  <th>اللون</th>
                  <th>المقاس</th>
                  <th>الإجمالي</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.price} جنيه</td>
                    <td>{item.quantity || 1}</td>
                    <td>{item.selectedColor || "-"}</td>
                    <td>{item.selectedSize || "-"}</td>
                    <td>{(item.price * (item.quantity || 1)).toFixed(2)} جنيه</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={clearCart}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            تفريغ السلة
          </button>
        </>
      )}
    </div>
  );
}

export default Checkout;
