// src/pages/Orders.jsx
import React from "react";

const Orders = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return <h2 className="no-orders">لا توجد طلبات بعد</h2>;
  }

  return (
    <div className="orders">
      <h2>الطلبات السابقة</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>العميل</th>
            <th>الهاتف</th>
            <th>العنوان</th>
            <th>الإجمالي</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={idx}>
              <td>{order.name}</td>
              <td>{order.phone}</td>
              <td>{order.address}</td>
              <td>{order.total} ج.م</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Orders;
