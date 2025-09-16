// src/pages/AdminPanel.jsx
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

// 👇 أدخل هنا كل الإيميلات والباسوردات للأدمنز المسموح لهم
const ADMINS = [
  { email: 'admin1@example.com', password: 'pass1' },
  { email: 'admin2@example.com', password: 'pass2' },
  // أضف المزيد إذا أردت
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
    section: ''
  });

  const [newSectionName, setNewSectionName] = useState('');
  const [newProvince, setNewProvince] = useState('');
  const [newCost, setNewCost] = useState(0);

  useEffect(() => {
    // ✅ تحقق من البريد + الباس
    const match = ADMINS.find(
      a => a.email === currentUserEmail && a.password === currentUserPassword
    );
    if (match) setIsAdmin(true);

    const fetchData = async () => {
      try {
        const prodSnap = await getDocs(collection(db, 'products'));
        setProducts(prodSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const secSnap = await getDocs(collection(db, 'sections'));
        setSections(secSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const shipSnap = await getDocs(collection(db, 'shipping'));
        setShipping(shipSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const ordersSnap = await getDocs(collection(db, 'orders'));
        setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

        const settingsSnap = await getDocs(collection(db, 'settings'));
        if (!settingsSnap.empty) {
          const settingsData = settingsSnap.docs[0].data();
          setStoreName(settingsData.storeName || '');
          setLogo(settingsData.logo || null);
          setSocialLinks(settingsData.socialLinks || { whatsapp: '', instagram: '', facebook: '' });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [currentUserEmail, currentUserPassword]);

  if (!isAdmin) return <p>🚫 ليس لديك صلاحية الدخول للوحة التحكم</p>;

  // -------- باقي الكود كما هو بدون أي تغيير --------
  const handleLogoUpload = e => {
    if (e.target.files[0]) setLogo(e.target.files[0]);
  };

  const handleSaveStoreSettingsOnly = async () => {
    try {
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
        await updateDoc(docRef, { storeName, logo: logoUrl });
      } else {
        await addDoc(settingsRef, { storeName, logo: logoUrl });
      }

      alert('تم حفظ اسم المتجر والشعار فقط');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    }
  };

  const handleSaveAllSettings = async () => {
    try {
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

      alert('تم حفظ جميع إعدادات المتجر');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حفظ الإعدادات');
    }
  };

  const handleAddSection = async () => {
    if (!newSectionName) return;
    try {
      const docRef = await addDoc(collection(db, 'sections'), { name: newSectionName });
      setSections(prev => [...prev, { id: docRef.id, name: newSectionName }]);
      setNewSectionName('');
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة القسم');
    }
  };

  const handleDeleteSection = async id => {
    try {
      await deleteDoc(doc(db, 'sections', id));
      setSections(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حذف القسم');
    }
  };

  const handleProductImagesUpload = e => {
    setNewProduct(prev => ({ ...prev, images: Array.from(e.target.files) }));
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.section) return alert('يرجى إدخال الاسم والسعر والقسم');

    try {
      const imageUrls = [];
      for (let file of newProduct.images) {
        const storageRef = ref(storage, `products/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }

      await addDoc(collection(db, 'products'), { ...newProduct, images: imageUrls });
      alert('تم إضافة المنتج');

      setNewProduct({ name: '', description: '', price: 0, images: [], colors: [], sizes: [], quantities: {}, section: '' });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة المنتج');
    }
  };

  const handleDeleteProduct = async id => {
    try {
      await deleteDoc(doc(db, 'products', id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء حذف المنتج');
    }
  };

  const handleAddShipping = async () => {
    if (!newProvince || !newCost) return;
    try {
      const docRef = await addDoc(collection(db, 'shipping'), { province: newProvince, cost: newCost });
      setShipping(prev => [...prev, { id: docRef.id, province: newProvince, cost: newCost }]);
      setNewProvince('');
      setNewCost(0);
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إضافة الشحن');
    }
  };

  const markAsShipped = async orderId => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: 'تم الشحن' });
      setOrders(prev => prev.map(o => (o.id === orderId ? { ...o, status: 'تم الشحن' } : o)));
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء تحديث حالة الطلب');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', background: '#fff0f5', minHeight: '100vh' }}>
      <h2 style={{ color: '#ff69b4' }}>لوحة التحكم (أكثر من أدمن مدعوم)</h2>
      {/* بقية الكود كما هو */}
    </div>
  );
};

export default AdminPanel;
