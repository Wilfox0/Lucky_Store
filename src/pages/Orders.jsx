// src/pages/Orders.jsx
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // الاستماع لأي تغييرات في مجموعة الأوردرات مباشرة (Realtime)
    const unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    });

    return () => unsubscribe();
  }, []);

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    try {
      await deleteDoc(doc(db, 'orders', id));
      alert("تم حذف الطلب بنجاح");
    } catch (err) {
      console.error("خطأ في حذف الطلب:", err);
      alert("حدث خطأ أثناء حذف الطلب");
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>جميع الطلبات</h2>
      {orders.length === 0 && <p>لا توجد طلبات بعد</p>}
      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #ddd', marginBottom: '10px', padding: '10px', borderRadius: '5px' }}>
          <p><strong>الاسم:</strong> {order.customer.name}</p>
          <p><strong>الهاتف:</strong> {order.customer.phone}</p>
          <p><strong>المحافظة:</strong> {order.customer.governorate}</p>
          <p><strong>العنوان:</strong> {order.customer.address}</p>
          <p><strong>عدد المنتجات:</strong> {order.cart.length}</p>
          <p><strong>سعر الشحن:</strong> {order.shippingPrice}</p>
          <p><strong>الإجمالي:</strong> {order.total}</p>
          <p><strong>المنتجات:</strong></p>
          <ul>
            {order.cart.map(item => (
              <li key={item.id}>
                {item.name} - {item.quantity || 1} قطعة - {item.selectedColor || '-'} - {item.selectedSize || '-'}
              </li>
            ))}
          </ul>
          <button
            onClick={() => handleDeleteOrder(order.id)}
            style={{
              padding: "8px 15px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            حذف الطلب
          </button>
        </div>
      ))}
    </div>
  );
};

export default Orders;
