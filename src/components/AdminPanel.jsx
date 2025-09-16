// src/components/AdminPanel.jsx
import React, { useEffect, useState } from 'react';
import { db, storage } from '../firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [orders, setOrders] = useState([]);
  const [sections, setSections] = useState([]);
  const [governorates, setGovernorates] = useState([]);
  const [storeSettings, setStoreSettings] = useState({
    storeName: '',
    logo: '',
    socialLinks: { whatsapp: '', instagram: '', facebook: '' }
  });

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: 0,
    colors: [],
    sizes: [],
    quantities: {},
    images: []
  });

  const [newSection, setNewSection] = useState('');
  const [newGovernorate, setNewGovernorate] = useState({ name: '', shipping: 0 });

  // Load all data on mount
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    // Products
    const productsSnap = await getDocs(collection(db, 'products'));
    setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // Sections
    const sectionsSnap = await getDocs(collection(db, 'sections'));
    setSections(sectionsSnap.docs.map(doc => ({ id: doc.id, name: doc.data().name })));

    // Governorates
    const govSnap = await getDocs(collection(db, 'governorates'));
    setGovernorates(govSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // Admins
    const adminsSnap = await getDocs(collection(db, 'admins'));
    setAdmins(adminsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // Orders
    const ordersSnap = await getDocs(collection(db, 'orders'));
    setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    // Store Settings
    const settingsSnap = await getDocs(collection(db, 'settings'));
    settingsSnap.forEach(doc => setStoreSettings(doc.data()));
  };

  // -------------------------
  // Products
  // -------------------------
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleColorChange = (e) => setNewProduct(prev => ({ ...prev, colors: e.target.value.split(',') }));
  const handleSizeChange = (e) => setNewProduct(prev => ({ ...prev, sizes: e.target.value.split(',') }));

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    const urls = [];
    for (let i = 0; i < files.length; i++) {
      const fileRef = ref(storage, `products/${files[i].name}`);
      await uploadBytes(fileRef, files[i]);
      const url = await getDownloadURL(fileRef);
      urls.push(url);
    }
    setNewProduct(prev => ({ ...prev, images: urls }));
  };

  const addProduct = async () => {
    const docRef = await addDoc(collection(db, 'products'), newProduct);
    setProducts(prev => [...prev, { id: docRef.id, ...newProduct }]);
    setNewProduct({ name: '', description: '', price: 0, colors: [], sizes: [], quantities: {}, images: [] });
    alert('تم إضافة المنتج بنجاح');
  };

  // -------------------------
  // Sections
  // -------------------------
  const addSection = async () => {
    if (!newSection) return;
    const docRef = await addDoc(collection(db, 'sections'), { name: newSection });
    setSections(prev => [...prev, { id: docRef.id, name: newSection }]);
    setNewSection('');
  };

  const deleteSection = async (id) => {
    await deleteDoc(doc(db, 'sections', id));
    setSections(prev => prev.filter(s => s.id !== id));
  };

  // -------------------------
  // Governorates
  // -------------------------
  const addGovernorate = async () => {
    if (!newGovernorate.name) return;
    const docRef = await addDoc(collection(db, 'governorates'), newGovernorate);
    setGovernorates(prev => [...prev, { id: docRef.id, ...newGovernorate }]);
    setNewGovernorate({ name: '', shipping: 0 });
  };

  const deleteGovernorate = async (id) => {
    await deleteDoc(doc(db, 'governorates', id));
    setGovernorates(prev => prev.filter(g => g.id !== id));
  };

  // -------------------------
  // Orders
  // -------------------------
  const deleteOrder = async (id) => {
    await deleteDoc(doc(db, 'orders', id));
    setOrders(prev => prev.filter(o => o.id !== id));
    alert('تم حذف الطلب');
  };

  // -------------------------
  // Store Settings
  // -------------------------
  const handleStoreChange = (e) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    const fileRef = ref(storage, `logo/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    setStoreSettings(prev => ({ ...prev, logo: url }));
  };

  const saveStoreSettings = async () => {
    const settingsSnap = await getDocs(collection(db, 'settings'));
    if (!settingsSnap.empty) {
      const docId = settingsSnap.docs[0].id;
      const docRef = doc(db, 'settings', docId);
      await updateDoc(docRef, storeSettings);
      alert('تم حفظ إعدادات المتجر');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h2>لوحة التحكم</h2>

      <section style={{ marginBottom: '20px' }}>
        <h3>إعدادات المتجر</h3>
        <input type="text" placeholder="اسم المتجر" name="storeName" value={storeSettings.storeName} onChange={handleStoreChange} />
        <input type="text" placeholder="رابط واتساب" name="whatsapp" value={storeSettings.socialLinks.whatsapp} onChange={(e) => setStoreSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, whatsapp: e.target.value } }))} />
        <input type="text" placeholder="رابط إنستاجرام" name="instagram" value={storeSettings.socialLinks.instagram} onChange={(e) => setStoreSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, instagram: e.target.value } }))} />
        <input type="text" placeholder="رابط فيسبوك" name="facebook" value={storeSettings.socialLinks.facebook} onChange={(e) => setStoreSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, facebook: e.target.value } }))} />
        <input type="file" onChange={handleLogoUpload} />
        <button onClick={saveStoreSettings}>حفظ الإعدادات</button>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3>المنتجات</h3>
        <input type="text" placeholder="اسم المنتج" name="name" value={newProduct.name} onChange={handleProductChange} />
        <input type="text" placeholder="الوصف" name="description" value={newProduct.description} onChange={handleProductChange} />
        <input type="number" placeholder="السعر" name="price" value={newProduct.price} onChange={handleProductChange} />
        <input type="text" placeholder="الألوان (فصل بينهما ,)" value={newProduct.colors.join(',')} onChange={handleColorChange} />
        <input type="text" placeholder="المقاسات (فصل بينهما ,)" value={newProduct.sizes.join(',')} onChange={handleSizeChange} />
        <input type="file" multiple onChange={handleImageUpload} />
        <button onClick={addProduct}>إضافة منتج</button>

        <ul>
          {products.map(p => (
            <li key={p.id}>{p.name} - {p.price} جنيه</li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3>الأقسام</h3>
        <input type="text" placeholder="اسم القسم" value={newSection} onChange={(e) => setNewSection(e.target.value)} />
        <button onClick={addSection}>إضافة قسم</button>
        <ul>
          {sections.map(s => (
            <li key={s.id}>{s.name} <button onClick={() => deleteSection(s.id)}>حذف</button></li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3>المحافظات والشحن</h3>
        <input type="text" placeholder="اسم المحافظة" value={newGovernorate.name} onChange={(e) => setNewGovernorate(prev => ({ ...prev, name: e.target.value }))} />
        <input type="number" placeholder="سعر الشحن" value={newGovernorate.shipping} onChange={(e) => setNewGovernorate(prev => ({ ...prev, shipping: parseFloat(e.target.value) }))} />
        <button onClick={addGovernorate}>إضافة محافظة</button>
        <ul>
          {governorates.map(g => (
            <li key={g.id}>{g.name} - {g.shipping} جنيه <button onClick={() => deleteGovernorate(g.id)}>حذف</button></li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3>الطلبات</h3>
        <ul>
          {orders.map(o => (
            <li key={o.id}>
              {o.customer?.name} - {o.total} جنيه
              <button onClick={() => deleteOrder(o.id)}>حذف الطلب</button>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ marginBottom: '20px' }}>
        <h3>الأدمنز</h3>
        <ul>
          {admins.map(a => (
            <li key={a.id}>{a.email}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminPanel;
