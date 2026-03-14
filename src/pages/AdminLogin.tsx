import { useState } from "react";
import "../styles/AdminLogin.css";
import Footer from "../components/Footer";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just open a blank page or console.log
    console.log("Admin login attempted:", username, password);
    alert("This is a placeholder login page.");
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <h2>Admin Login</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>

      {/* Keep your existing footer */}

    </div>
  );
}