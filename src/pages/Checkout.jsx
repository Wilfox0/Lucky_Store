import React, { useState } from "react";
import { useCart } from "../CartContext";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

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

  const [orderPlaced, setOrderPlaced] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (id, color, size, delta) => {
    const item = cart.find((i) =>
      i.id === id && i.selectedColor === color && i.selectedSize === size
    );
    if (!item) return;
    const newQty = Math.max((item.quantity || 1) + delta, 1);
    updateQuantity(id, color, size, newQty);
  };

  const shippingCost = shippingRates[customer.governorate] || 0;
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const totalWithShipping = cartTotal + shippingCost;

  const handlePlaceOrder = async () => {
    if (!customer.name || !customer.phone || !customer.address) {
      alert("يرجى ملء جميع بيانات العميل");
      return;
    }

    try {
      await addDoc(collection(db, "orders"), {
        customer,
        cart,
        shippingPrice: shippingCost,
        total: totalWithShipping,
        createdAt: new Date()
      });
      alert("تم إرسال الطلب بنجاح");
      clearCart();
      setOrderPlaced(true);
    } catch (err) {
      console.error("خطأ في إرسال الطلب:", err);
      alert("حدث خطأ أثناء إرسال الطلب");
    }
  };

  if (cart.length === 0 && !orderPlaced) return <p style={{ textAlign: "center" }}>السلة فارغة</p>;
  if (orderPlaced) return <p style={{ textAlign: "center" }}>تم إرسال الطلب بنجاح</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>سلة المشتريات</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", marginBottom: "20px", textAlign: "center" }}>
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
          {cart.map(item => (
            <tr key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}>
              <td>{item.name}</td>
              <td>{item.price} جنيه</td>
              <td>
                <button onClick={() => handleQuantityChange(item.id, item.selectedColor, item.selectedSize, -1)}>-</button>
                <span style={{ margin: "0 8px" }}>{item.quantity || 1}</span>
                <button onClick={() => handleQuantityChange(item.id, item.selectedColor, item.selectedSize, 1)}>+</button>
              </td>
              <td>{item.selectedColor}</td>
              <td>{item.selectedSize}</td>
              <td>{(item.price * (item.quantity || 1)).toFixed(2)} جنيه</td>
              <td>
                <button onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}>حذف</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>بيانات العميل</h3>
        <input type="text" name="name" placeholder="الاسم" value={customer.name} onChange={handleInputChange} />
        <input type="text" name="phone" placeholder="رقم الهاتف" value={customer.phone} onChange={handleInputChange} />
        <input type="text" name="address" placeholder="العنوان" value={customer.address} onChange={handleInputChange} />
        <select name="governorate" value={customer.governorate} onChange={handleInputChange}>
          {Object.keys(shippingRates).map(gov => <option key={gov} value={gov}>{gov}</option>)}
        </select>
      </div>

      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>ملخص الطلب</h3>
        <p>إجمالي المنتجات: {cartTotal} جنيه</p>
        <p>سعر الشحن: {shippingCost} جنيه</p>
        <p><strong>الإجمالي الكلي: {totalWithShipping} جنيه</strong></p>
      </div>

      <button onClick={handlePlaceOrder} style={{ padding: "10px 20px", backgroundColor: "#c71585", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
        تأكيد الطلب
      </button>
    </div>
  );
}

export default Checkout;
