import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, 'orders'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>جميع الطلبات</h2>
      {orders.map(order => (
        <div key={order.id} style={{ border: '1px solid #ddd', marginBottom: '10px', padding: '10px', borderRadius: '5px' }}>
          <p><strong>الاسم:</strong> {order.customer.name}</p>
          <p><strong>الهاتف:</strong> {order.customer.phone}</p>
          <p><strong>المحافظة:</strong> {order.customer.province}</p>
          <p><strong>العنوان:</strong> {order.customer.address}</p>
          <p><strong>عدد المنتجات:</strong> {order.cart.length}</p>
          <p><strong>سعر الشحن:</strong> {order.shippingPrice}</p>
          <p><strong>الإجمالي:</strong> {order.total}</p>
        </div>
      ))}
    </div>
  );
};

export default Orders;
