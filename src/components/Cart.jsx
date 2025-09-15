import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, setCartItems, shippingOptions }) => {
  const [selectedProvince, setSelectedProvince] = useState('');
  
  const handleQuantityChange = (index, newQty) => {
    const newCart = [...cartItems];
    newCart[index].quantity = newQty;
    setCartItems(newCart);
  };

  const handleRemove = index => {
    const newCart = [...cartItems];
    newCart.splice(index, 1);
    setCartItems(newCart);
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = shippingOptions.find(s => s.province === selectedProvince)?.cost || 0;
  const grandTotal = totalPrice + shippingPrice;

  return (
    <div style={{ padding: '20px' }}>
      <h2>السلة</h2>
      {cartItems.length === 0 ? (
        <p>السلة فارغة</p>
      ) : (
        <>
          {cartItems.map((item, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
              <div>
                <h4>{item.name}</h4>
                <p>مقاس: {item.selectedSize}, لون: {item.selectedColor}</p>
                <p>سعر: {item.price} × {item.quantity} = {item.price * item.quantity}</p>
              </div>
              <div>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => handleQuantityChange(idx, Number(e.target.value))}
                  style={{ width: '50px' }}
                />
                <button onClick={() => handleRemove(idx)} style={{ marginLeft: '5px', background: '#ff69b4', color: '#fff', border: 'none', padding: '5px' }}>حذف</button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: '20px' }}>
            <label>اختر المحافظة للشحن: </label>
            <select value={selectedProvince} onChange={e => setSelectedProvince(e.target.value)}>
              <option value="">اختر</option>
              {shippingOptions.map(opt => <option key={opt.province} value={opt.province}>{opt.province} - {opt.cost} ج.م</option>)}
            </select>
          </div>

          <h3>السعر الإجمالي: {grandTotal} ج.م</h3>
          {selectedProvince && <Link to="/checkout"><button style={{ padding: '10px 20px', background: '#ff69b4', color: '#fff', border: 'none', borderRadius: '5px' }}>تأكيد الطلب</button></Link>}
        </>
      )}
    </div>
  );
};

export default Cart;
