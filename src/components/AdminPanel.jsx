import React, { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { collection, getDocs, addDoc, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [sections, setSections] = useState([]);
  const [orders, setOrders] = useState([]);
  const [admins, setAdmins] = useState([]);
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

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      // Products
      const productsSnap = await getDocs(collection(db, "products"));
      setProducts(productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Sections
      const sectionsSnap = await getDocs(collection(db, "sections"));
      setSections(sectionsSnap.docs.map(doc => doc.data().name));

      // Orders
      const ordersSnap = await getDocs(collection(db, "orders"));
      setOrders(ordersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      // Admins
      const adminsSnap = await getDocs(collection(db, "admins"));
      setAdmins(adminsSnap.docs.map(doc => doc.data().email));

      // Social Links
      const socialSnap = await getDocs(collection(db, "settings"));
      socialSnap.forEach(doc => {
        setSocialLinks(doc.data().socialLinks || {});
        setStoreSettings({
          storeName: doc.data().storeName || "",
          logo: doc.data().logo || ""
        });
      });
    };

    fetchData();
  }, []);

  // Handle product input changes
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

  const handleImageUpload = async (e) => {
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

  // Add Product
  const addProduct = async () => {
    try {
      await addDoc(collection(db, "products"), newProduct);
      alert("تم إضافة المنتج بنجاح");
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء إضافة المنتج");
    }
  };

  // Update product quantity when order placed
  const updateProductQuantity = async (productId, color, size, quantitySold) => {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDocs(collection(db, "products"));
    const productData = products.find(p => p.id === productId);
    const key = `${color}-${size}`;
    const newQty = (productData.quantities[key] || 0) - quantitySold;
    await updateDoc(productRef, {
      [`quantities.${key}`]: newQty
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>لوحة التحكم</h2>

      <section style={{ marginBottom: "20px" }}>
        <h3>إعدادات المتجر</h3>
        <input
          type="text"
          placeholder="اسم المتجر"
          value={storeSettings.storeName}
          onChange={e => setStoreSettings(prev => ({ ...prev, storeName: e.target.value }))}
        />
        <input type="file" onChange={handleImageUpload} />
        <input
          type="text"
          placeholder="رابط WhatsApp"
          value={socialLinks.whatsapp || ""}
          onChange={e => setSocialLinks(prev => ({ ...prev, whatsapp: e.target.value }))}
        />
        <input
          type="text"
          placeholder="رابط Instagram"
          value={socialLinks.instagram || ""}
          onChange={e => setSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
        />
        <input
          type="text"
          placeholder="رابط Facebook"
          value={socialLinks.facebook || ""}
          onChange={e => setSocialLinks(prev => ({ ...prev, facebook: e.target.value }))}
        />
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3>إضافة منتج جديد</h3>
        <input type="text" name="name" placeholder="اسم المنتج" value={newProduct.name} onChange={handleProductChange} />
        <textarea name="description" placeholder="الوصف" value={newProduct.description} onChange={handleProductChange}></textarea>
        <input type="text" placeholder="الألوان (مفصولة بفاصلة)" value={newProduct.colors.join(",")} onChange={handleColorsChange} />
        <input type="text" placeholder="المقاسات (مفصولة بفاصلة)" value={newProduct.sizes.join(",")} onChange={handleSizesChange} />
        <input type="text" name="section" placeholder="القسم" value={newProduct.section} onChange={handleProductChange} />
        <input type="file" multiple onChange={handleImageUpload} />
        <button onClick={addProduct}>إضافة المنتج</button>
      </section>

      <section style={{ marginBottom: "20px" }}>
        <h3>الطلبات</h3>
        {orders.map(order => (
          <div key={order.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <p><strong>العميل:</strong> {order.customer.name}</p>
            <p><strong>الهاتف:</strong> {order.customer.phone}</p>
            <p><strong>العنوان:</strong> {order.customer.address}</p>
            <p><strong>عدد المنتجات:</strong> {order.cart.length}</p>
            <p><strong>الإجمالي:</strong> {order.total}</p>
          </div>
        ))}
      </section>
    </div>
  );
};

export default AdminPanel;
