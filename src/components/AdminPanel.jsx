import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const AdminPanel = ({ ownerEmail, currentUserEmail }) => {
  // فقط المالك يمكنه رؤية لوحة التحكم
  if (ownerEmail !== currentUserEmail) {
    return null;
  }

  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [shipping, setShipping] = useState([]);
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
    quantities: {}, // { "red-M": 5, "blue-L": 3 }
    section: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      // جلب المنتجات
      const prodSnap = await getDocs(collection(db, 'products'));
      setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // جلب الأقسام
      const secSnap = await getDocs(collection(db, 'sections'));
      setSections(secSnap.docs.map(doc => doc.data().name));

      // جلب الشحن
      const shipSnap = await getDocs(collection(db, 'shipping'));
      setShipping(shipSnap.docs.map(doc => doc.data()));

      // جلب إعدادات المتجر
      const settingsSnap = await getDocs(collection(db, 'settings'));
      if (!settingsSnap.empty) {
        const settingsData = settingsSnap.docs[0].data();
        setStoreName(settingsData.storeName || '');
        setLogo(settingsData.logo || null);
        setSocialLinks(settingsData.socialLinks || { whatsapp: '', instagram: '', facebook: '' });
      }
    };
    fetchData();
  }, []);

  // رفع الصور الجديدة للمنتج
  const handleFileUpload = e => {
    setNewProduct({ ...newProduct, images: e.target.files });
  };

  // إضافة منتج جديد
  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) return alert('يرجى إدخال اسم المنتج والسعر');

    // رفع الصور إلى Firebase Storage
    const imageUrls = [];
    for (let i = 0; i < newProduct.images.length; i++) {
      const file = newProduct.images[i];
      const storageRef = ref(storage, `products/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      imageUrls.push(url);
    }

    const prodToAdd = { ...newProduct, images: imageUrls };
    await addDoc(collection(db, 'products'), prodToAdd);
    alert('تم إضافة المنتج');
    setNewProduct({
      name: '',
      description: '',
      price: 0,
      images: [],
      colors: [],
      sizes: [],
      quantities: {},
      section: ''
    });
  };

  // حذف منتج
  const handleDeleteProduct = async (productId) => {
    await deleteDoc(doc(db, 'products', productId));
    setProducts(products.filter(p => p.id !== productId));
  };

  // إضافة قسم جديد
  const handleAddSection = async sectionName => {
    if (!sectionName) return;
    await addDoc(collection(db, 'sections'), { name: sectionName });
    setSections(prev => [...prev, sectionName]);
    alert('تم إضافة القسم');
  };

  // إضافة شحن لمحافظة
  const handleAddShipping = async (province, cost) => {
    if (!province || !cost) return;
    await addDoc(collection(db, 'shipping'), { province, cost });
    setShipping(prev => [...prev, { province, cost }]);
    alert('تم إضافة الشحن');
  };

  // حفظ إعدادات المتجر
  const handleSaveSettings = async () => {
    const settingsRef = collection(db, 'settings');
    const snapshot = await getDocs(settingsRef);

    let logoUrl = logo;
    if (logo instanceof File) {
      const storageRef = ref(storage, `logo/${logo.name}`);
      await uploadBytes(storageRef, logo);
      logoUrl = await getDownloadURL(storageRef);
    }

    if (!snapshot.empty) {
      const docRef = doc(db, 'settings', snapshot.docs[0].id);
      await updateDoc(docRef, { storeName, logo: logoUrl, socialLinks });
    } else {
      await addDoc(settingsRef, { storeName, logo: logoUrl, socialLinks });
    }
    alert('تم حفظ الإعدادات');
  };

  return (
    <div style={{ padding: '20px', background: '#fff0f5', minHeight: '100vh' }}>
      <h2 style={{ color: '#ff69b4' }}>لوحة التحكم</h2>

      {/* إعدادات المتجر */}
      <section style={{ marginBottom: '30px', border: '1px solid #e0d3e0', padding: '15px', borderRadius: '10px' }}>
        <h3 style={{ color: '#c71585' }}>إعدادات المتجر</h3>
        <input
          placeholder="اسم المتجر"
          value={storeName}
          onChange={e => setStoreName(e.target.value)}
          style={{ display: 'block', marginBottom: '10px', width: '300px', padding: '5px' }}
        />
        <input
          type="file"
          onChange={e => setLogo(e.target.files[0])}
          style={{ display: 'block', marginBottom: '10px' }}
        />
        <input
          placeholder="رابط واتساب"
          value={socialLinks.whatsapp}
          onChange={e => setSocialLinks({ ...socialLinks, whatsapp: e.target.value })}
          style={{ display: 'block', marginBottom: '5px', width: '300px', padding: '5px' }}
        />
        <input
          placeholder="رابط انستجرام"
          value={socialLinks.instagram}
          onChange={e => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
          style={{ display: 'block', marginBottom: '5px', width: '300px', padding: '5px' }}
        />
        <input
          placeholder="رابط فيسبوك"
          value={socialLinks.facebook}
          onChange={e => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
          style={{ display: 'block', marginBottom: '5px', width: '300px', padding: '5px' }}
        />
        <button onClick={handleSaveSettings} style={{ padding: '10px 20px', marginTop: '10px', background: '#ff69b4', color: '#fff', border: 'none', borderRadius: '5px' }}>
          حفظ الإعدادات
        </button>
      </section>

      {/* إضافة منتج */}
      <section style={{ marginBottom: '30px', border: '1px solid #e0d3e0', padding: '15px', borderRadius: '10px' }}>
        <h3 style={{ color: '#c71585' }}>إضافة منتج</h3>
        <input placeholder="اسم المنتج" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} style={{ display: 'block', marginBottom: '5px', width: '300px', padding: '5px' }} />
        <input placeholder="وصف المنتج" value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} style={{ display: 'block', marginBottom: '5px', width: '300px', padding: '5px' }} />
        <input placeholder="السعر" type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: Number(e.target.value) })} style={{ display: 'block', marginBottom: '5px', width: '300px', padding: '5px' }} />
        <input type="file" multiple onChange={handleFileUpload} style={{ display: 'block', marginBottom: '5px' }} />
        <input placeholder="الألوان (افصل بفاصلة)" value={newProduct.colors.join(',')} onChange={e => setNewProduct({ ...newProduct, colors: e.target.value.split(',') })} style={{ display: 'block', marginBottom: '5px', width: '300px', padding: '5px' }} />
        <input placeholder="المقاسات (افصل بفاصلة)" value={newProduct.sizes.join(',')} onChange={e => setNewProduct({ ...newProduct, sizes: e.target.value.split(',') })} style={{ display: 'block', marginBottom: '5px', width: '300px', padding: '5px' }} />
        <input placeholder="الكمية المتوفرة" type="number" value={Object.values(newProduct.quantities)[0] || 0} onChange={e => setNewProduct({ ...newProduct, quantities: { [`${newProduct.colors[0] || 'default'}-${newProduct.sizes[0] || 'M'}`]: Number(e.target.value) } })} style={{ display: 'block', marginBottom: '5px', width: '300px', padding: '5px' }} />
        <input placeholder="القسم" value={newProduct.section} onChange={e => setNewProduct({ ...newProduct, section: e.target.value })} style={{ display: 'block', marginBottom: '5px', width: '300px', padding: '5px' }} />
        <button onClick={handleAddProduct} style={{ padding: '10px 20px', marginTop: '10px', background: '#ff69b4', color: '#fff', border: 'none', borderRadius: '5px' }}>إضافة المنتج</button>

        <h4 style={{ marginTop: '15px' }}>المنتجات الحالية:</h4>
        {products.map(p => (
          <div key={p.id} style={{ borderBottom: '1px solid #ccc', padding: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{p.name} - {p.price} ج.م</span>
            <button onClick={() => handleDeleteProduct(p.id)} style={{ background: '#ff69b4', color: '#fff', border: 'none', borderRadius: '5px', padding: '3px 10px' }}>حذف</button>
          </div>
        ))}
      </section>

      {/* إضافة قسم */}
      <section style={{ marginBottom: '30px', border: '1px solid #e0d3e0', padding: '15px', borderRadius: '10px' }}>
        <h3 style={{ color: '#c71585' }}>إضافة قسم جديد</h3>
        <input id="newSection" placeholder="اسم القسم" style={{ display: 'block', marginBottom: '5px', width: '300px', padding: '5px' }} />
        <button onClick={() => handleAddSection(document.getElementById('newSection').value)} style={{ padding: '10px 20px', marginTop: '10px', background: '#ff69b4', color: '#fff', border: 'none', borderRadius: '5px' }}>إضافة القسم</button>
      </section>

      {/* إضافة شحن */}
      <section style={{ marginBottom: '30px', border: '1px solid #e0d3e0', padding: '15px', borderRadius: '10px' }}>
        <h3 style={{ color: '#c71585' }}>إضافة شحن لمحافظة</h3>
        <input id="province" placeholder="اسم المحافظة" style={{ display: 'block', marginBottom: '5px', width: '300px', padding: '5px' }} />
        <input id="cost" placeholder="سعر الشحن" type="number" style={{ display: 'block', marginBottom: '5px', width: '300px', padding: '5px' }} />
        <button onClick={() => handleAddShipping(document.getElementById('province').value, Number(document.getElementById('cost').value))} style={{ padding: '10px 20px', marginTop: '10px', background: '#ff69b4', color: '#fff', border: 'none', borderRadius: '5px' }}>إضافة الشحن</button>
      </section>
    </div>
  );
};

export default AdminPanel;
