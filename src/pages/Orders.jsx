// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("خطأ عند جلب الطلبات:", error);
      } else {
        setOrders(data);
      }
    };

    fetchOrders();
  }, []);

  const markAsShipped = async (orderId) => {
    const { error } = await supabase
      .from("orders")
      .update({ status: "تم الشحن" })
      .eq("id", orderId);

    if (error) {
      console.error("خطأ عند تحديث حالة الطلب:", error);
      return;
    }

    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status: "تم الشحن" } : o))
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>الطلبات</h2>
      {orders.length === 0 && <p>لا توجد طلبات حالياً</p>}
      {orders.map(order => (
        <div key={order.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "8px" }}>
          <p><strong>العميل:</strong> {order.customer.name}</p>
          <p><strong>الهاتف:</strong> {order.customer.phone}</p>
          <p><strong>العنوان:</strong> {order.customer.address}</p>
          <p><strong>عدد المنتجات:</strong> {order.cart?.length}</p>
          <p><strong>الإجمالي:</strong> {order.total} جنيه</p>
          <p><strong>حالة الطلب:</strong> {order.status || "قيد الانتظار"}</p>
          {order.status !== "تم الشحن" && (
            <button onClick={() => markAsShipped(order.id)}>تحديد كتم الشحن</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default Orders;
