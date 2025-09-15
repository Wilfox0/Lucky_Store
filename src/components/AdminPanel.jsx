import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [storeSettings, setStoreSettings] = useState({ storeName: "", logo: "", socialLinks: {} });
  const [newProduct, setNewProduct] = useState({ name: "", price: "", colors: [], sizes: [], section: "", images: [] });
  const [logoFile, setLogoFile] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const loadedProducts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(loadedProducts);
    };

    const fetchSettings = async () => {
      const snapshot = await getDocs(collection(db, "settings"));
      snapshot.forEach(doc => setStoreSettings(doc.data()));
    };

    fetchProducts();
    fetchSettings();
  }, []);

  const handleAddProduct = async () => {
    try {
      let imageUrls = [];
      for (let file of newProduct.images) {
        const storageRef = ref(storage, `products/${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
      await addDoc(collection(db, "products"), { ...newProduct, images: imageUrls });
      alert("تم إضافة المنتج بنجاح");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStore = async () => {
    try {
      let logoUrl = storeSettings.logo;
      if (logoFile) {
        const storageRef = ref(storage, `logo/${logoFile.name}`);
        await uploadBytes(storageRef, logoFile);
        logoUrl = await getDownloadURL(storageRef);
      }
      const settingsDoc = doc(db, "settings", "main");
      await updateDoc(settingsDoc, { ...storeSettings, logo: logoUrl });
      alert("تم تحديث بيانات المتجر");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>لوحة التحكم</h2>
      
      <section style={{ marginBottom: "30px" }}>
        <h3>إضافة منتج جديد</h3>
        <input type="text" placeholder="اسم المنتج" onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))} />
        <input type="number" placeholder="السعر" onChange={e => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))} />
        <input type="text" placeholder="الألوان مفصولة بفاصلة" onChange={e => setNewProduct(prev => ({ ...prev, colors: e.target.value.split(",") }))} />
        <input type="text" placeholder="المقاسات مفصولة بفاصلة" onChange={e => setNewProduct(prev => ({ ...prev, sizes: e.target.value.split(",") }))} />
        <input type="text" placeholder="القسم" onChange={e => setNewProduct(prev => ({ ...prev, section: e.target.value }))} />
        <input type="file" multiple onChange={e => setNewProduct(prev => ({ ...prev, images: Array.from(e.target.files) }))} />
        <button onClick={handleAddProduct}>إضافة المنتج</button>
      </section>

      <section>
        <h3>تحديث بيانات المتجر</h3>
        <input type="text" placeholder="اسم المتجر" value={storeSettings.storeName} onChange={e => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))} />
        <input type="file" onChange={e => setLogoFile(e.target.files[0])} />
        <input type="text" placeholder="رابط انستجرام" onChange={e => setStoreSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, instagram: e.target.value } }))} />
        <input type="text" placeholder="رابط فيسبوك" onChange={e => setStoreSettings(prev => ({ ...prev, socialLinks: { ...prev.socialLinks, facebook: e.target.value } }))} />
        <button onClick={handleUpdateStore}>تحديث المتجر</button>
      </section>
    </div>
  );
};

export default AdminPanel;
