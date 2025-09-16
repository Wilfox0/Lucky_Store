// src/pages/AdminLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ admins, setCurrentAdmin }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const adminPassword = "123456"; // يمكن تغييره لكل أدمن لاحقاً

  const handleLogin = (e) => {
    e.preventDefault();
    if (admins.includes(email) && password === adminPassword) {
      setCurrentAdmin(email);
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("adminEmail", email);
      navigate("/admin");
    } else {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
    }
  };

  return (
    <div className="admin-login" style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>تسجيل دخول الأدمن</h2>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px" }}>
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">دخول</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
};

export default AdminLogin;
