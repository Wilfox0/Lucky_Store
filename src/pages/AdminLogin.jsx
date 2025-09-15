import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ admins, setCurrentUserEmail }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const adminPassword = "123456"; // كلمة مرور عامة للأدمن

  const handleLogin = (e) => {
    e.preventDefault();
    if (admins.includes(email) && password === adminPassword) {
      setCurrentUserEmail(email);
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="admin-login">
      <h2>تسجيل دخول الأدمن</h2>
      <form onSubmit={handleLogin}>
        <input type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="كلمة المرور" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">دخول</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;
