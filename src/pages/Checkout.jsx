// src/pages/Checkout.jsx
import React, { useState } from "react";

const Checkout = ({ cart, setCart }) => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    governorate: "",
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 50; // شحن افتراضي
  const finalTotal = total + shipping;

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("تم ارسال الطلب بنجاح ✅");
    setCart([]);
  };

  if (cart.length === 0) {
    return <h2 className="empty-cart">السلة فارغة</h2>;
  }

  return (
    <div className="checkout">
      <h2>اتمام الطلب</h2>
      <div className="checkout-content">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="الاسم"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="رقم الهاتف"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="العنوان"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="المحافظة"
            value={form.governorate}
            onChange={(e) => setForm({ ...form, governorate: e.target.value })}
            required
          />
          <button type="submit">ارسال الطلب</button>
        </form>

        <div className="checkout-summary">
          <h3>ملخص الطلب</h3>
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.name} × {item.quantity} = {item.price * item.quantity} ج.م
              </li>
            ))}
          </ul>
          <p>الشحن: {shipping} ج.م</p>
          <h4>الإجمالي: {finalTotal} ج.م</h4>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
