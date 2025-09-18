import React, { useState } from "react";
import { useCart } from "../CartContext";
import { supabase } from "../supabaseClient";

// مكتبة الرسائل التحذيرية (Toast)
import Toast from "../components/Toast";

// دالة إرسال إشعار Telegram من ملف API الجديد
import { sendTelegramNotification } from "../api/sendTelegramNotification";

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

  const [toasts, setToasts] = useState([]);

  // دالة لعرض الرسائل التحذيرية
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (id, color, size, delta) => {
    const item = cart.find((i) => i.id === id && i.selectedColor === color && i.selectedSize === size);
    if (!item) return;

    const currentQty = item.quantity ?? 1;
    const newQty = currentQty + delta;

    const key = `${color}-${size}`;
    const maxQty = item.quantities?.[key] ?? 99;

    if (newQty > maxQty) {
      showToast(`الحد الأقصى للكمية لهذا المنتج هو ${maxQty}`, "warning");
      return; // رفض زيادة الكمية
    }

    const finalQty = Math.max(newQty, 1);
    updateQuantity(id, color, size, finalQty);
  };

  const shippingCost = shippingRates[customer.governorate] || 0;
  const cartTotal = cart.reduce((sum, item) => sum + item.price * (item.quantity ?? 1), 0);
  const totalWithShipping = cartTotal + shippingCost;

  const handleConfirmOrder = async () => {
    if (!customer.name || !customer.phone || !customer.address) {
      return alert("يرجى إدخال بيانات العميل كاملة قبل تأكيد الطلب");
    }

    try {
      // تحديث المخزون لكل منتج
      for (let item of cart) {
        const { data: productData, error } = await supabase
          .from("products")
          .select("quantities")
          .eq("id", item.id)
          .single();

        if (error) {
          console.error("خطأ عند جلب المنتج:", error);
          continue;
        }

        const key = `${item.selectedColor}-${item.selectedSize}`;
        const currentStock = productData.quantities?.[key] || 0;
        const newStock = Math.max(currentStock - (item.quantity ?? 1), 0);

        const updatedQuantities = { ...productData.quantities, [key]: newStock };

        await supabase
          .from("products")
          .update({ quantities: updatedQuantities })
          .eq("id", item.id);
      }

      // إضافة الطلب الجديد
      await supabase.from("orders").insert([
        {
          customer,
          items: cart,
          shipping_cost: shippingCost,
          total: totalWithShipping,
          status: "جديد",
          created_at: new Date().toISOString()
        }
      ]);

      // ==== إرسال إشعار Telegram باستخدام API الجديد ====
      const telegramMessage = `طلب جديد من: ${customer.name}\nالهاتف: ${customer.phone}\nالعنوان: ${customer.address}\nعدد المنتجات: ${cart.length}\nالإجمالي: ${totalWithShipping} جنيه`;
      sendTelegramNotification(telegramMessage);
      // ======================================================

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
                <tr key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}>
                  <td>{item.name}</td>
                  <td>{item.price} جنيه</td>
                  <td>
                    <button onClick={() => handleQuantityChange(item.id, item.selectedColor, item.selectedSize, -1)}>-</button>
                    <span style={{ margin: "0 8px" }}>{item.quantity ?? 1}</span>
                    <button onClick={() => handleQuantityChange(item.id, item.selectedColor, item.selectedSize, 1)}>+</button>
                  </td>
                  <td>{item.selectedColor || "-"}</td>
                  <td>{item.selectedSize || "-"}</td>
                  <td>{(item.price * (item.quantity ?? 1)).toFixed(2)} جنيه</td>
                  <td><button onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedSize)}>حذف</button></td>
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

          {/* فاتورة تفصيلية لكل منتج */}
          <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
            <h3>فاتورة تفصيلية لكل منتج قبل تأكيد الطلب</h3>
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
                  <tr key={`${item.id}-${item.selectedColor}-${item.selectedSize}`}>
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

      {/* عرض الرسائل التحذيرية */}
      {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} />)}
    </div>
  );
}

export default Checkout;
