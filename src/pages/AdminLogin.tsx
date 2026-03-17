import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const defaultCreds = {
    username: "admin@leyarss.com",
    password: "dev123",
  };

  useEffect(() => {
    const alreadyAuthed = localStorage.getItem("leyarss-admin-authed") === "true";
    if (alreadyAuthed) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const isValid =
      username.trim().toLowerCase() === defaultCreds.username &&
      password === defaultCreds.password;

    if (isValid) {
      localStorage.setItem("leyarss-admin-authed", "true");
      navigate("/admin");
    } else {
      setError("Invalid credentials. Use the dev login provided.");
    }
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
              placeholder={defaultCreds.username}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <div className="password-label">
              <label>PASSWORD</label>
              <span className="forgot">Dev default</span>
            </div>

            <input
              type="password"
              placeholder="********"
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

      {error && <p className="admin-error">{error}</p>}

      <p className="admin-footer-text">
        (c) 2026 LEYARSS CREATIVES. SECURED ENVIRONMENT.
      </p>
    </div>
  );
}
