import React, { useState } from "react";
import { useCart } from "../CartContext";
import { db } from "../firebase";
import { doc, updateDoc, getDoc, collection, addDoc } from "firebase/firestore";

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
    const currentQty = item.quantity ?? 1;
    const newQty = Math.max(currentQty + delta, 1);
    updateQuantity(id, newQty);
  };

  const shippingCost = shippingRates[customer.governorate] || 0;
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0
  );
  const totalWithShipping = cartTotal + shippingCost;

  const handleConfirmOrder = async () => {
    if (!customer.name || !customer.phone || !customer.address) {
      return alert("يرجى إدخال بيانات العميل كاملة قبل تأكيد الطلب");
    }

    try {
      // 1️⃣ تحديث المخزون في Firebase
      for (let item of cart) {
        const prodRef = doc(db, "products", item.id);
        const prodSnap = await getDoc(prodRef);
        if (prodSnap.exists()) {
          const currentStock = prodSnap.data().quantities?.[item.selectedSize] || 0;
          const newStock = Math.max(currentStock - (item.quantity ?? 1), 0);
          await updateDoc(prodRef, {
            [`quantities.${item.selectedSize}`]: newStock
          });
        }
      }

      // 2️⃣ إضافة الطلب في collection "orders"
      await addDoc(collection(db, "orders"), {
        customer,
        items: cart,
        shippingCost,
        total: totalWithShipping,
        status: "جديد",
        createdAt: new Date()
      });

      // 3️⃣ إرسال إشعار عبر Email (مثال باستخدام Firebase Function أو API)
      fetch("/api/sendOrderNotification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: "تم طلب جديد",
          message: `هناك طلب جديد من ${customer.name}, الهاتف: ${customer.phone}, إجمالي: ${totalWithShipping} جنيه`
        })
      });

      alert("تم تأكيد الطلب! سيتم تحديث المخزون والإشعارات.");
      clearCart();
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تأكيد الطلب");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>سلة المشتريات</h2>
      {cart.length === 0 ? (
        <p style={{ textAlign: "center" }}>السلة فارغة</p>
      ) : (
        <>
          {/* جدول المنتجات */}
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
              {cart.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.price} جنيه</td>
                  <td>
                    <button onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    <span style={{ margin: "0 8px" }}>{item.quantity ?? 1}</span>
                    <button onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </td>
                  <td>{item.selectedColor || "-"}</td>
                  <td>{item.selectedSize || "-"}</td>
                  <td>{(item.price * (item.quantity ?? 1)).toFixed(2)} جنيه</td>
                  <td><button onClick={() => removeFromCart(item.id)}>حذف</button></td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* بيانات العميل */}
          <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h3 style={{ marginBottom: "15px" }}>بيانات العميل</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
              <input type="text" name="name" placeholder="الاسم" value={customer.name} onChange={handleInputChange} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}/>
              <input type="text" name="phone" placeholder="رقم الهاتف" value={customer.phone} onChange={handleInputChange} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}/>
              <input type="text" name="address" placeholder="العنوان" value={customer.address} onChange={handleInputChange} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}/>
              <select name="governorate" value={customer.governorate} onChange={handleInputChange} style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
                {Object.keys(shippingRates).map((gov) => (<option key={gov} value={gov}>{gov}</option>))}
              </select>
            </div>
          </div>

          {/* ملخص الطلب */}
          <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h3>ملخص الطلب</h3>
            <p>إجمالي المنتجات: {cartTotal} جنيه</p>
            <p>سعر الشحن: {shippingCost} جنيه</p>
            <p><strong>الإجمالي الكلي: {totalWithShipping} جنيه</strong></p>
          </div>

          {/* فاتورة تفصيلية */}
          <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h3>فاتورة تفصيلية لكل منتج</h3>
            <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%", textAlign: "center" }}>
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
                    <td>{item.quantity ?? 1}</td>
                    <td>{item.selectedColor || "-"}</td>
                    <td>{item.selectedSize || "-"}</td>
                    <td>{(item.price * (item.quantity ?? 1)).toFixed(2)} جنيه</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* أزرار */}
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <button onClick={clearCart} style={{ padding: "10px 20px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>تفريغ السلة</button>
            <button onClick={handleConfirmOrder} style={{ padding: "10px 20px", backgroundColor: "#4caf50", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>تأكيد الطلب</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Checkout;
