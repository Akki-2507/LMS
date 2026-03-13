import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Min 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      navigate("/courses");
    } catch (err) {
      setApiError(err.response?.data?.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    width: "100%",
    padding: "12px 16px",
    background: "#0e0e1c",
    border: `1px solid ${errors[field] ? "#ff6b9d" : "#2a2a4e"}`,
    borderRadius: 10,
    color: "#f0f0ff",
    fontSize: "0.95rem",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    outline: "none",
    transition: "border-color 0.2s",
  });

  return (
    <div style={{
      minHeight: "100vh", background: "#07070f",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 16px"
    }}>
      {/* Glow blob */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 500, height: 500, borderRadius: "50%", pointerEvents: "none",
        background: "radial-gradient(circle, rgba(124,111,255,0.1) 0%, transparent 70%)",
      }} />

      <div style={{ width: "100%", maxWidth: 440, position: "relative" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "linear-gradient(135deg, #7c6fff, #00e5b0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 12px",
            fontFamily: "monospace", fontWeight: 700, fontSize: "1rem", color: "white"
          }}>{"<>"}</div>
          <h1 style={{ fontWeight: 800, color: "#f0f0ff", fontSize: "1.6rem", marginBottom: 4 }}>
            Create your account
          </h1>
          <p style={{ color: "#9090b8", fontSize: "0.9rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#7c6fff", fontWeight: 600 }}>Log in</Link>
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "#111124", border: "1px solid #1e1e3a",
          borderRadius: 18, padding: "32px 28px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.4)"
        }}>

          {apiError && (
            <div style={{
              padding: "12px 16px", marginBottom: 20, borderRadius: 10,
              background: "rgba(255,107,157,0.1)", border: "1px solid rgba(255,107,157,0.3)",
              color: "#ff6b9d", fontSize: "0.88rem"
            }}>
              <i className="bi bi-exclamation-circle me-2"></i>{apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", marginBottom: 7, fontSize: "0.85rem", fontWeight: 600, color: "#9090b8" }}>
                Full Name
              </label>
              <input
                name="name" type="text"
                value={form.name} onChange={onChange}
                placeholder="John Smith"
                style={inputStyle("name")}
                onFocus={e => e.target.style.borderColor = "#7c6fff"}
                onBlur={e => e.target.style.borderColor = errors.name ? "#ff6b9d" : "#2a2a4e"}
              />
              {errors.name && <p style={{ color: "#ff6b9d", fontSize: "0.78rem", marginTop: 5 }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", marginBottom: 7, fontSize: "0.85rem", fontWeight: 600, color: "#9090b8" }}>
                Email Address
              </label>
              <input
                name="email" type="email"
                value={form.email} onChange={onChange}
                placeholder="you@example.com"
                style={inputStyle("email")}
                onFocus={e => e.target.style.borderColor = "#7c6fff"}
                onBlur={e => e.target.style.borderColor = errors.email ? "#ff6b9d" : "#2a2a4e"}
              />
              {errors.email && <p style={{ color: "#ff6b9d", fontSize: "0.78rem", marginTop: 5 }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ display: "block", marginBottom: 7, fontSize: "0.85rem", fontWeight: 600, color: "#9090b8" }}>
                Password
              </label>
              <input
                name="password" type="password"
                value={form.password} onChange={onChange}
                placeholder="Minimum 6 characters"
                style={inputStyle("password")}
                onFocus={e => e.target.style.borderColor = "#7c6fff"}
                onBlur={e => e.target.style.borderColor = errors.password ? "#ff6b9d" : "#2a2a4e"}
              />
              {errors.password && <p style={{ color: "#ff6b9d", fontSize: "0.78rem", marginTop: 5 }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 26 }}>
              <label style={{ display: "block", marginBottom: 7, fontSize: "0.85rem", fontWeight: 600, color: "#9090b8" }}>
                Confirm Password
              </label>
              <input
                name="confirmPassword" type="password"
                value={form.confirmPassword} onChange={onChange}
                placeholder="Repeat your password"
                style={inputStyle("confirmPassword")}
                onFocus={e => e.target.style.borderColor = "#7c6fff"}
                onBlur={e => e.target.style.borderColor = errors.confirmPassword ? "#ff6b9d" : "#2a2a4e"}
              />
              {errors.confirmPassword && <p style={{ color: "#ff6b9d", fontSize: "0.78rem", marginTop: 5 }}>{errors.confirmPassword}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width: "100%", padding: "13px",
              background: loading ? "#2a2a4e" : "linear-gradient(135deg, #7c6fff, #6357e8)",
              color: "white", border: "none", borderRadius: 10,
              fontWeight: 700, fontSize: "0.95rem",
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "Plus Jakarta Sans, sans-serif",
              boxShadow: loading ? "none" : "0 4px 20px rgba(124,111,255,0.4)",
              transition: "all 0.2s"
            }}>
              {loading
                ? <><span className="spinner-border spinner-border-sm me-2"></span>Creating account...</>
                : "Create Account →"
              }
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: "center", marginTop: 20, color: "#55557a", fontSize: "0.8rem" }}>
          By signing up you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
};

export default Signup;