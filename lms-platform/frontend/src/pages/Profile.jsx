import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../services/api";

const Profile = () => {
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    bio: user?.bio || "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [apiError, setApiError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setSuccess("");
    setApiError("");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (form.password && form.password.length < 6) e.password = "Min 6 characters";
    if (form.password && form.password !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    try {
      const payload = { name: form.name, bio: form.bio };
      if (form.password) payload.password = form.password;
      const { data } = await authAPI.updateProfile(payload);
      updateUser(data);
      setSuccess("Profile updated successfully!");
      setForm(prev => ({ ...prev, password: "", confirmPassword: "" }));
    } catch (err) {
      setApiError(err.response?.data?.message || "Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (field) => ({
    background: "#13132a",
    border: `1px solid ${errors[field] ? "#ff6b9d" : "#2a2a4e"}`,
    color: "#f0f0ff", borderRadius: 10,
    padding: "11px 16px", width: "100%",
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontSize: "0.95rem", outline: "none",
  });

  const tabStyle = (tab) => ({
    padding: "10px 20px",
    background: activeTab === tab ? "rgba(124,111,255,0.12)" : "transparent",
    border: "none",
    borderBottom: activeTab === tab ? "2px solid #7c6fff" : "2px solid transparent",
    color: activeTab === tab ? "#7c6fff" : "#9090b8",
    fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
    fontFamily: "Plus Jakarta Sans, sans-serif",
  });

  return (
    <div style={{ background: "#07070f", minHeight: "100vh", padding: "48px 0 80px" }}>
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="mb-5">
          <h1 style={{ fontWeight: 800, color: "#f0f0ff", fontSize: "2rem", marginBottom: 6 }}>My Profile</h1>
          <p style={{ color: "#9090b8" }}>Manage your account settings and personal information</p>
        </div>

        <div className="row g-4">
          {/* Left Avatar Card */}
          <div className="col-12 col-md-4">
            <div style={{ background: "#111124", border: "1px solid #1e1e3a", borderRadius: 16, padding: 28, textAlign: "center" }}>
              <div style={{
                width: 90, height: 90, borderRadius: "50%",
                background: "linear-gradient(135deg, #7c6fff, #ff6b9d)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px", fontSize: "2.2rem", fontWeight: 800, color: "white",
                boxShadow: "0 0 30px rgba(124,111,255,0.3)"
              }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <h5 style={{ fontWeight: 700, color: "#f0f0ff", marginBottom: 4 }}>{user?.name}</h5>
              <p style={{ color: "#9090b8", fontSize: "0.85rem", marginBottom: 12 }}>{user?.email}</p>
              <span style={{
                display: "inline-block", padding: "4px 14px", borderRadius: 50,
                fontSize: "0.75rem", fontWeight: 700,
                background: user?.role === "admin" ? "rgba(255,209,102,0.15)" : "rgba(124,111,255,0.15)",
                color: user?.role === "admin" ? "#ffd166" : "#7c6fff",
                border: `1px solid ${user?.role === "admin" ? "rgba(255,209,102,0.3)" : "rgba(124,111,255,0.3)"}`,
              }}>
                {user?.role === "admin" ? "👑 Admin" : "🎓 Student"}
              </span>
              {user?.bio && (
                <p style={{ color: "#9090b8", fontSize: "0.85rem", marginTop: 16, lineHeight: 1.6 }}>{user.bio}</p>
              )}
              <div style={{ marginTop: 20, paddingTop: 20, borderTop: "1px solid #1e1e3a", display: "flex", justifyContent: "center", gap: 24 }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontWeight: 800, color: "#f0f0ff", fontSize: "1.2rem" }}>{user?.enrolledCourses?.length || 0}</div>
                  <div style={{ fontSize: "0.72rem", color: "#55557a", textTransform: "uppercase", letterSpacing: "0.05em" }}>Courses</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Edit Form */}
          <div className="col-12 col-md-8">
            <div style={{ background: "#111124", border: "1px solid #1e1e3a", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ display: "flex", borderBottom: "1px solid #1e1e3a" }}>
                <button style={tabStyle("profile")} onClick={() => setActiveTab("profile")}>
                  <i className="bi bi-person me-2"></i>Edit Profile
                </button>
                <button style={tabStyle("security")} onClick={() => setActiveTab("security")}>
                  <i className="bi bi-shield-lock me-2"></i>Security
                </button>
              </div>

              <div style={{ padding: 28 }}>
                {success && (
                  <div style={{ padding: "12px 16px", marginBottom: 20, borderRadius: 10, background: "rgba(0,229,176,0.1)", border: "1px solid rgba(0,229,176,0.3)", color: "#00e5b0", fontSize: "0.9rem" }}>
                    <i className="bi bi-check-circle me-2"></i>{success}
                  </div>
                )}
                {apiError && (
                  <div style={{ padding: "12px 16px", marginBottom: 20, borderRadius: 10, background: "rgba(255,107,157,0.1)", border: "1px solid rgba(255,107,157,0.3)", color: "#ff6b9d", fontSize: "0.9rem" }}>
                    <i className="bi bi-exclamation-circle me-2"></i>{apiError}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  {activeTab === "profile" && (
                    <>
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", fontWeight: 600, color: "#9090b8" }}>Full Name</label>
                        <input name="name" type="text" value={form.name} onChange={onChange} style={inputStyle("name")} placeholder="Your full name" />
                        {errors.name && <p style={{ color: "#ff6b9d", fontSize: "0.78rem", marginTop: 4 }}>{errors.name}</p>}
                      </div>
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", fontWeight: 600, color: "#9090b8" }}>
                          Email Address <span style={{ color: "#55557a", fontWeight: 400 }}>(cannot be changed)</span>
                        </label>
                        <input type="email" value={user?.email || ""} disabled style={{ ...inputStyle("email"), opacity: 0.5, cursor: "not-allowed" }} />
                      </div>
                      <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", fontWeight: 600, color: "#9090b8" }}>
                          Bio <span style={{ color: "#55557a", fontWeight: 400 }}>(optional)</span>
                        </label>
                        <textarea name="bio" value={form.bio} onChange={onChange} rows={3}
                          placeholder="Tell us about yourself..."
                          style={{ ...inputStyle("bio"), resize: "vertical", minHeight: 90 }} />
                      </div>
                    </>
                  )}

                  {activeTab === "security" && (
                    <>
                      <p style={{ color: "#9090b8", fontSize: "0.88rem", marginBottom: 20, lineHeight: 1.6 }}>
                        Leave password fields empty if you don't want to change your password.
                      </p>
                      <div style={{ marginBottom: 20 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", fontWeight: 600, color: "#9090b8" }}>New Password</label>
                        <input name="password" type="password" value={form.password} onChange={onChange} style={inputStyle("password")} placeholder="Min. 6 characters" />
                        {errors.password && <p style={{ color: "#ff6b9d", fontSize: "0.78rem", marginTop: 4 }}>{errors.password}</p>}
                      </div>
                      <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", fontWeight: 600, color: "#9090b8" }}>Confirm New Password</label>
                        <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={onChange} style={inputStyle("confirmPassword")} placeholder="Repeat new password" />
                        {errors.confirmPassword && <p style={{ color: "#ff6b9d", fontSize: "0.78rem", marginTop: 4 }}>{errors.confirmPassword}</p>}
                      </div>
                    </>
                  )}

                  <button type="submit" disabled={loading} style={{
                    padding: "12px 28px",
                    background: loading ? "#2a2a4e" : "linear-gradient(135deg, #7c6fff, #6357e8)",
                    color: "white", border: "none", borderRadius: 10,
                    fontWeight: 700, fontSize: "0.95rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    fontFamily: "Plus Jakarta Sans, sans-serif",
                    boxShadow: loading ? "none" : "0 4px 20px rgba(124,111,255,0.4)",
                  }}>
                    {loading ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : <><i className="bi bi-check2 me-2"></i>Save Changes</>}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;