// src/pages/AdminPanel.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const ADMINS = [
  { email: 'admin1@example.com', password: '123456' },
  { email: 'admin2@example.com', password: 'pass2' },
];

const AdminPanel = ({ currentUserEmail, currentUserPassword }) => {
  const [isAdmin, setIsAdmin] = useState(false);

  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [shipping, setShipping] = useState([]);
  const [orders, setOrders] = useState([]);
  const [storeName, setStoreName] = useState('');
  const [logo, setLogo] = useState(null);
  const [socialLinks, setSocialLinks] = useState({ whatsapp: '', instagram: '', facebook: '' });

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    images: [],
    colors: [],
    sizes: [],
    quantities: {},
    totalQuantity: 0,
    section: ''
  });

  const [newSectionName, setNewSectionName] = useState('');
  const [newProvince, setNewProvince] = useState('');
  const [newCost, setNewCost] = useState(0);

  useEffect(() => {
    const match = ADMINS.find(
      a => a.email === currentUserEmail && a.password === currentUserPassword
    );
    if (match) setIsAdmin(true);

    const fetchData = async () => {
      try {
        // جلب المنتجات
        let { data: prodData, error: prodError } = await supabase.from('products').select('*');
        if (prodError) console.error(prodError);
        else setProducts(prodData || []);

        // جلب الأقسام
        let { data: secData, error: secError } = await supabase.from('sections').select('*');
        if (secError) console.error(secError);
        else setSections(secData || []);

        // جلب الشحن
        let { data: shipData, error: shipError } = await supabase.from('shipping').select('*');
        if (shipError) console.error(shipError);
        else setShipping(shipData || []);

        // جلب الطلبات
        let { data: ordersData, error: ordersError } = await supabase.from('orders').select('*');
        if (ordersError) console.error(ordersError);
        else setOrders(ordersData || []);

        // جلب إعدادات المتجر
        let { data: settingsData, error: settingsError } = await supabase.from('settings').select('*').limit(1);
        if (settingsError) console.error(settingsError);
        else if (settingsData && settingsData.length > 0) {
          const settings = settingsData[0];
          setStoreName(settings.storeName || '');
          setLogo(settings.logo || null);
          setSocialLinks(settings.socialLinks || { whatsapp: '', instagram: '', facebook: '' });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [currentUserEmail, currentUserPassword]);

  if (!isAdmin) return <p style={{ color: '#ff0000', fontWeight: 'bold' }}>🚫 ليس لديك صلاحية الدخول للوحة التحكم</p>;

  // -------- وظائف الشعار + اسم المتجر + روابط الاجتماعية --------
  const handleLogoUpload = e => {
    if (e.target.files[0]) setLogo(e.target.files[0]);
  };

  const handleSaveStoreSettingsOnly = async () => {
    try {
      let logoUrl = logo;
      if (logo instanceof File) {
        const { data, error } = await supabase.storage.from('logo').upload(`logo/${logo.name}`, logo, { upsert: true });
        if (error) throw error;
        const { publicUrl } = supabase.storage.from('logo').getPublicUrl(`logo/${logo.name}`);
        logoUrl = publicUrl;
      }

      const { data: existingSettings, error } = await supabase.from('settings').select('*').limit(1);
      if (error) throw error;

      if (existingSettings && existingSettings.length > 0) {
        await supabase.from('settings').update({ storeName, logo: logoUrl }).eq('id', existingSettings[0].id);
      } else {
        await supabase.from('settings').insert([{ storeName, logo: logoUrl }]);
      }

      alert('تم حفظ اسم المتجر والشعار فقط');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    }
  };

  const handleSaveAllSettings = async () => {
    try {
      let logoUrl = logo;
      if (logo instanceof File) {
        const { data, error } = await supabase.storage.from('logo').upload(`logo/${logo.name}`, logo, { upsert: true });
        if (error) throw error;
        const { publicUrl } = supabase.storage.from('logo').getPublicUrl(`logo/${logo.name}`);
        logoUrl = publicUrl;
      }

      const { data: existingSettings, error } = await supabase.from('settings').select('*').limit(1);
      if (error) throw error;

      if (existingSettings && existingSettings.length > 0) {
        await supabase.from('settings').update({ storeName, logo: logoUrl, socialLinks }).eq('id', existingSettings[0].id);
      } else {
        await supabase.from('settings').insert([{ storeName, logo: logoUrl, socialLinks }]);
      }

      alert('تم حفظ جميع إعدادات المتجر');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    }
  };

  // -------- الأقسام --------
  const handleAddSection = async () => {
    if (!newSectionName) return;
    try {
      const { data, error } = await supabase.from('sections').insert([{ name: newSectionName }]);
      if (error) throw error;
      setSections(prev => [...prev, { id: data[0].id, name: newSectionName }]);
      setNewSectionName('');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة القسم');
    }
  };

  const handleDeleteSection = async id => {
    try {
      const { error } = await supabase.from('sections').delete().eq('id', id);
      if (error) throw error;
      setSections(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حذف القسم');
    }
  };

  // -------- المنتجات --------
  const handleProductImagesUpload = e => {
    setNewProduct(prev => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.section) return alert('يرجى إدخال الاسم والسعر والقسم');

    try {
      const imageUrls = [];
      for (let file of newProduct.images) {
        const { data, error } = await supabase.storage.from('products').upload(`products/${file.name}`, file, { upsert: true });
        if (error) throw error;
        const { publicUrl } = supabase.storage.from('products').getPublicUrl(`products/${file.name}`);
        imageUrls.push(publicUrl);
      }

      await supabase.from('products').insert([{ ...newProduct, images: imageUrls }]);
      alert('تم إضافة المنتج');

      setNewProduct({
        name: '',
        description: '',
        price: 0,
        images: [],
        colors: [],
        sizes: [],
        quantities: {},
        totalQuantity: 0,
        section: ''
      });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة المنتج');
    }
  };

  const handleDeleteProduct = async id => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حذف المنتج');
    }
  };

  // -------- الشحن --------
  const handleAddShipping = async () => {
    if (!newProvince || !newCost) return;
    try {
      const { data, error } = await supabase.from('shipping').insert([{ province: newProvince, cost: newCost }]);
      if (error) throw error;
      setShipping(prev => [...prev, { id: data[0].id, province: newProvince, cost: newCost }]);
      setNewProvince('');
      setNewCost(0);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة الشحن');
    }
  };

  // -------- الطلبات --------
  const markAsShipped = async orderId => {
    try {
      const { error } = await supabase.from('orders').update({ status: 'تم الشحن' }).eq('id', orderId);
      if (error) throw error;
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: 'تم الشحن' } : o)));
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', background: '#fff0f5', minHeight: '100vh' }}>
      <h2 style={{ color: '#ff69b4', marginBottom: '20px' }}>لوحة التحكم (أكثر من أدمن مدعوم)</h2>

      {/* إعدادات المتجر */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '2px solid #ff69b4', borderRadius: '12px', background: '#fff' }}>
        <h3 style={{ color: '#ff1493' }}>إعدادات المتجر</h3>
        <input type="text" placeholder="اسم المتجر" value={storeName} onChange={e => setStoreName(e.target.value)} style={{ margin: '5px', padding: '5px', width: '250px' }} />
        <input type="file" onChange={handleLogoUpload} style={{ margin: '5px' }} />
        <input type="text" placeholder="WhatsApp" value={socialLinks.whatsapp} onChange={e => setSocialLinks(prev => ({ ...prev, whatsapp: e.target.value }))} style={{ margin: '5px', padding: '5px', width: '250px' }} />
        <input type="text" placeholder="Instagram" value={socialLinks.instagram} onChange={e => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))} style={{ margin: '5px', padding: '5px', width: '250px' }} />
        <input type="text" placeholder="Facebook" value={socialLinks.facebook} onChange={e => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))} style={{ margin: '5px', padding: '5px', width: '250px' }} />
        <div style={{ marginTop: '10px' }}>
          <button onClick={handleSaveAllSettings} style={{ marginRight: '10px', padding: '5px 10px', background: '#ff69b4', color: '#fff', border: 'none', borderRadius: '5px' }}>حفظ جميع الإعدادات</button>
          <button onClick={handleSaveStoreSettingsOnly} style={{ padding: '5px 10px', background: '#c71585', color: '#fff', border: 'none', borderRadius: '5px' }}>حفظ الاسم والشعار فقط</button>
        </div>
      </div>

      {/* إضافة المنتج مع الوصف والكمية */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '2px solid #ff69b4', borderRadius: '12px', background: '#fff' }}>
        <h3 style={{ color: '#ff1493' }}>إضافة منتج جديد</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
          <input type="text" placeholder="اسم المنتج" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} style={{ padding: '5px', width: '200px' }} />
          <input type="number" placeholder="السعر" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} style={{ padding: '5px', width: '100px' }} />
          <input type="text" placeholder="القسم" value={newProduct.section} onChange={e => setNewProduct({...newProduct, section: e.target.value})} style={{ padding: '5px', width: '150px' }} />
          <input type="file" multiple onChange={handleProductImagesUpload} style={{ padding: '5px' }} />
        </div>

        <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <textarea placeholder="الوصف" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} style={{ padding: '5px', width: '400px', height: '60px' }} />
          <input type="text" placeholder="الألوان (افصل بين كل لون بفاصلة)" value={newProduct.colors.join(',')} onChange={e => setNewProduct({...newProduct, colors: e.target.value.split(',')})} style={{ padding: '5px', width: '400px' }} />
          <input type="text" placeholder="المقاسات (افصل بين كل مقاس بفاصلة)" value={newProduct.sizes.join(',')} onChange={e => setNewProduct({...newProduct, sizes: e.target.value.split(',')})} style={{ padding: '5px', width: '400px' }} />
          <input type="text" placeholder="الكميات لكل لون-مقاس بصيغة color-size:quantity,مثال Red-M:10,Blue-L:5" value={Object.entries(newProduct.quantities).map(([k,v]) => `${k}:${v}`).join(',')} onChange={e => {
            const obj = {};
            e.target.value.split(',').forEach(pair => {
              const [key,val] = pair.split(':');
              if(key && val) obj[key.trim()] = Number(val);
            });
            setNewProduct({...newProduct, quantities: obj, totalQuantity: Object.values(obj).reduce((a,b)=>a+b,0)});
          }} style={{ padding: '5px', width: '600px' }} />
          <p>إجمالي كمية المنتج: {newProduct.totalQuantity}</p>
        </div>

        <button onClick={handleAddProduct} style={{ marginTop: '10px', padding: '5px 10px', background: '#ff69b4', color: '#fff', border: 'none', borderRadius: '5px' }}>إضافة المنتج</button>
      </div>

      {/* باقي الأقسام والشحن والطلبات كما في الكود السابق */}
      {/* الأقسام */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '2px solid #ff69b4', borderRadius: '12px', background: '#fff' }}>
        <h3 style={{ color: '#ff1493' }}>الأقسام</h3>
        <input type="text" placeholder="اسم القسم" value={newSectionName} onChange={e => setNewSectionName(e.target.value)} style={{ marginRight: '5px', padding: '5px' }} />
        <button onClick={handleAddSection} style={{ padding: '5px 10px', background: '#ff69b4', color: '#fff', border: 'none', borderRadius: '5px' }}>إضافة قسم</button>
        <ul style={{ marginTop: '10px' }}>
          {sections.map(s => (
            <li key={s.id} style={{ marginBottom: '5px' }}>
              {s.name} <button onClick={() => handleDeleteSection(s.id)} style={{ marginLeft: '5px', padding: '2px 5px', background: '#c71585', color: '#fff', border: 'none', borderRadius: '3px' }}>حذف</button>
            </li>
          ))}
        </ul>
      </div>

      {/* الشحن */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '2px solid #ff69b4', borderRadius: '12px', background: '#fff' }}>
        <h3 style={{ color: '#ff1493' }}>الشحن</h3>
        <input type="text" placeholder="المحافظة" value={newProvince} onChange={e => setNewProvince(e.target.value)} style={{ marginRight: '5px', padding: '5px' }} />
        <input type="number" placeholder="السعر" value={newCost} onChange={e => setNewCost(Number(e.target.value))} style={{ marginRight: '5px', padding: '5px', width: '100px' }} />
        <button onClick={handleAddShipping} style={{ padding: '5px 10px', background: '#ff69b4', color: '#fff', border: 'none', borderRadius: '5px' }}>إضافة شحن</button>
        <ul style={{ marginTop: '10px' }}>
          {shipping.map(s => (
            <li key={s.id}>{s.province}: {s.cost} جنيه</li>
          ))}
        </ul>
      </div>

      {/* الطلبات */}
      <div style={{ marginBottom: '25px', padding: '15px', border: '2px solid #ff69b4', borderRadius: '12px', background: '#fff' }}>
        <h3 style={{ color: '#ff1493' }}>الطلبات</h3>
        {orders.map(o => (
          <div key={o.id} style={{ border: '1px solid #ccc', marginBottom: '5px', padding: '5px', borderRadius: '5px' }}>
            <p>العميل: {o.customer?.name}</p>
            <p>الهاتف: {o.customer?.phone}</p>
            <p>العنوان: {o.customer?.address}</p>
            <p>عدد المنتجات: {o.items?.length}</p>
            <p>الإجمالي: {o.total} جنيه</p>
            <p>الحالة: {o.status || 'قيد الانتظار'}</p>
            {o.status !== 'تم الشحن' && <button onClick={() => markAsShipped(o.id)} style={{ padding: '2px 5px', background: '#c71585', color: '#fff', border: 'none', borderRadius: '3px' }}>تحديد كتم الشحن</button>}
          </div>
        ))}
      </div>

    </div>
  );
};

export default AdminPanel;
