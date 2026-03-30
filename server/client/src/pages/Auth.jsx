import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/auth.css";

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const marketingLines = [
    "Connect with anyone.",
    "On any device."
  ];

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await api.post("/auth/login", {
          email: form.email,
          password: form.password,
        });

        console.log("✅ LOGIN SUCCESS:", res.data);

        // Save token
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("username", res.data.user.name);

        // Redirect to dashboard
        navigate("/dashboard");

      } else {
        await api.post("/auth/register", form);

        alert("✅ Registered successfully! Please login.");
        setIsLogin(true);
      }

    } catch (err) {
      console.error("❌ ERROR:", err.response || err.message);

      alert(
        err?.response?.data?.msg ||
        "Server not responding. Please check backend."
      );

    } finally {
      setLoading(false); // 🔥 always stops loading
    }
  };

  // Animated text
  const renderMarketingText = marketingLines.map((line, lIdx) => (
    <div key={lIdx} className="line">
      {line.split(" ").map((word, wIdx) => (
        <span
          key={wIdx}
          className="word"
          style={{
            animationDelay: `${lIdx * 0.6 + wIdx * 0.15}s`,
          }}
        >
          {word}&nbsp;
        </span>
      ))}
    </div>
  ));

  return (
    <div className={`auth-page ${!isLogin ? "register-mode" : ""}`}>

      {/* LEFT SIDE TEXT */}
      <div className="side-text">{renderMarketingText}</div>

      {/* AUTH CARD */}
      <div className="auth-card">
        <h2>{isLogin ? "Welcome Back 👋" : "Create Account 🚀"}</h2>

        <p className="auth-desc">
          Access your dashboard and manage meetings.
        </p>

        <form onSubmit={submit}>

          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isLogin
              ? "Sign In"
              : "Register"}
          </button>
        </form>

        <div className="switch-area">
          <span>
            {isLogin ? "New here?" : "Already have an account?"}
          </span>

          <span
            className="switch-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Create Account" : "Login"}
          </span>
        </div>
      </div>

      {/* BRAND */}
      <div className="brand">ZoomX Platform © 2026</div>
    </div>
  );
}

export default Auth;