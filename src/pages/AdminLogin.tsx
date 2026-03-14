import { useState } from "react";
import "../styles/AdminLogin.css";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Admin login attempted:", username, password);
    alert("This is a placeholder login page.");
  };

  return (
    <div className="admin-login-page">

      <div className="admin-header">
        <h1>
          LEYARSS <span>CREATIVES</span>
        </h1>
        <p>ADMIN PORTAL</p>
      </div>

      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">

          <div className="input-group">
            <label>USERNAME OR EMAIL</label>
            <input
              type="text"
              placeholder="admin@leyarss.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="password-label">
              <label>PASSWORD</label>
              <span className="forgot">Forgot?</span>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="remember">
            <input type="checkbox" id="remember" />
            <label htmlFor="remember">Keep me logged in</label>
          </div>

          <button type="submit" className="login-btn">
            AUTHORIZE ACCESS
          </button>

        </form>
      </div>

      <p className="admin-footer-text">
        © 2026 LEYARSS CREATIVES. SECURED ENVIRONMENT.
      </p>

    </div>
  );
}