// src/pages/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [orders, setOrders] = useState([]);
  const [socialLinks, setSocialLinks] = useState({});
  const [storeSettings, setStoreSettings] = useState({ storeName: "", logo: "" });

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    colors: [],
    sizes: [],
    quantities: {},
    images: [],
    section: ""
  });

  const [newSection, setNewSection] = useState("");

  // --------------------- Fetch initial data ---------------------
  useEffect(() => {
    const fetchData = async () => {
      // Products
      const productsSnap = await getDocs(collection(db, "products"));
      setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Sections
      const sectionsSnap = await getDocs(collection(db, "sections"));
      setSections(sectionsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Orders
      const ordersSnap = await getDocs(collection(db, "orders"));
      setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Store Settings
      const settingsSnap = await getDocs(collection(db, "settings"));
      settingsSnap.forEach(doc => {
        setStoreSettings({
          storeName: doc.data().storeName || "",
          logo: doc.data().logo || ""
        });
        setSocialLinks(doc.data().socialLinks || {});
      });
    };

    fetchData();
  }, []);

  // --------------------- Store Settings ---------------------
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const storageRef = ref(storage, `store/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setStoreSettings(prev => ({ ...prev, logo: url }));
  };

  const saveStoreSettings = async () => {
    try {
      const settingsSnap = await getDocs(collection(db, "settings"));
      const settingsDoc = settingsSnap.docs[0];
      const settingsRef = doc(db, "settings", settingsDoc.id);
      await updateDoc(settingsRef, {
        storeName: storeSettings.storeName,
        logo: storeSettings.logo,
        socialLinks: socialLinks
      });
      alert("تم حفظ إعدادات المتجر بنجاح");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حفظ الإعدادات");
    }
  };

  // --------------------- Sections ---------------------
  const addSection = async () => {
    if (!newSection) return;
    try {
      await addDoc(collection(db, "sections"), { name: newSection });
      setSections(prev => [...prev, { name: newSection }]);
      setNewSection("");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إضافة القسم");
    }
  };

  const deleteSection = async (id) => {
    try {
      await deleteDoc(doc(db, "sections", id));
      setSections(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء حذف القسم");
    }
  };

  // --------------------- Products ---------------------
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleColorsChange = (e) => {
    setNewProduct(prev => ({ ...prev, colors: e.target.value.split(",") }));
  };

  const handleSizesChange = (e) => {
    setNewProduct(prev => ({ ...prev, sizes: e.target.value.split(",") }));
  };

  const handleProductImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    const urls = [];
    for (let file of files) {
      const storageRef = ref(storage, `products/${file.name}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      urls.push(url);
    }
    setNewProduct(prev => ({ ...prev, images: urls }));
  };

  const addProduct = async () => {
    if (!newProduct.name || !newProduct.section) {
      alert("يرجى إدخال اسم المنتج والقسم");
      return;
    }
    try {
      await addDoc(collection(db, "products"), newProduct);
      alert("تم إضافة المنتج بنجاح");
      setNewProduct({
        name: "",
        description: "",
        colors: [],
        sizes: [],
        quantities: {},
        images: [],
        section: ""
      });
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إضافة المنتج");
    }
  };

  // --------------------- Orders ---------------------
  const markAsShipped = async (orderId) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: "تم الشحن" });
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: "تم الشحن" } : o));
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء تحديث حالة الطلب");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>لوحة التحكم</h2>

      {/* Store Settings */}
      <section style={{ marginBottom: "20px" }}>
        <h3>إعدادات المتجر</h3>
        <input type="text" placeholder="اسم المتجر" value={storeSettings.storeName} onChange={e => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))} />
        <input type="file" onChange={handleImageUpload} />
        <input type="text" placeholder="رابط WhatsApp" value={socialLinks.whatsapp || ""} onChange={e => setSocialLinks(prev => ({ ...prev, whatsapp: e.target.value }))} />
        <input type="text" placeholder="رابط Instagram" value={socialLinks.instagram || ""} onChange={e => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))} />
        <input type="text" placeholder="رابط Facebook" value={socialLinks.facebook || ""} onChange={e => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))} />
        <button onClick={saveStoreSettings}>حفظ الإعدادات</button>
      </section>

      {/* Sections */}
      <section style={{ marginBottom: "20px" }}>
        <h3>الأقسام</h3>
        <ul>
          {sections.map(section => (
            <li key={section.id}>
              {section.name}
              <button onClick={() => deleteSection(section.id)} style={{ marginLeft: "10px" }}>حذف</button>
            </li>
          ))}
        </ul>
        <input type="text" placeholder="أضف قسم جديد" value={newSection} onChange={e => setNewSection(e.target.value)} />
        <button onClick={addSection}>إضافة قسم</button>
      </section>

      {/* Add Product */}
      <section style={{ marginBottom: "20px" }}>
        <h3>إضافة منتج جديد</h3>
        <input type="text" name="name" placeholder="اسم المنتج" value={newProduct.name} onChange={handleProductChange} />
        <textarea name="description" placeholder="الوصف" value={newProduct.description} onChange={handleProductChange}></textarea>
        <input type="text" placeholder="الألوان (مفصولة بفاصلة)" value={newProduct.colors.join(",")} onChange={handleColorsChange} />
        <input type="text" placeholder="المقاسات (مفصولة بفاصلة)" value={newProduct.sizes.join(",")} onChange={handleSizesChange} />
        <input type="text" name="section" placeholder="القسم" value={newProduct.section} onChange={handleProductChange} />
        <input type="file" multiple onChange={handleProductImagesUpload} />
        <button onClick={addProduct}>إضافة المنتج</button>
      </section>

      {/* Orders */}
      <section style={{ marginBottom: "20px" }}>
        <h3>الطلبات</h3>
        {orders.length === 0 && <p>لا توجد طلبات حالياً</p>}
        {orders.map(order => (
          <div key={order.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px", borderRadius: "8px" }}>
            <p><strong>العميل:</strong> {order.customer.name}</p>
            <p><strong>الهاتف:</strong> {order.customer.phone}</p>
            <p><strong>العنوان:</strong> {order.customer.address}</p>
            <p><strong>عدد المنتجات:</strong> {order.cart.length}</p>
            <p><strong>الإجمالي:</strong> {order.total} جنيه</p>
            <p><strong>حالة الطلب:</strong> {order.status || "قيد الانتظار"}</p>
            {order.status !== "تم الشحن" && (
              <button onClick={() => markAsShipped(order.id)}>تحديد كتم الشحن</button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminPanel;
