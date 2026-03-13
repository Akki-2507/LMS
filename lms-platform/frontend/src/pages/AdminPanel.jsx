import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { coursesAPI, authAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Spinner from "../components/Spinner";

const CATEGORIES = ["Programming Language", "Web Development", "Backend Development", "Data Science"];
const LEVELS = ["Beginner", "Intermediate", "Advanced"];
const emptyForm = { title: "", description: "", instructor: "", duration: "", category: "Programming Language", level: "Beginner", thumbnail: "", lessonsText: "" };

const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("courses");
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (!isAdmin) { navigate("/"); return; }
    fetchAll();
  }, [isAdmin]);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [cRes, uRes, sRes] = await Promise.all([
        coursesAPI.getAll({}),
        authAPI.getAllUsers(),
        coursesAPI.getAdminStats(),
      ]);
      setCourses(cRes.data);
      setUsers(uRes.data);
      setStats(sRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => { setSuccessMsg(msg); setTimeout(() => setSuccessMsg(""), 3000); };

  const openAdd = () => { setEditingCourse(null); setForm(emptyForm); setFormError(""); setShowModal(true); };

  const openEdit = (course) => {
    setEditingCourse(course);
    setForm({
      title: course.title, description: course.description,
      instructor: course.instructor, duration: course.duration,
      category: course.category, level: course.level,
      thumbnail: course.thumbnail || "",
      lessonsText: course.lessons?.map(l => l.title).join("\n") || "",
    });
    setFormError("");
    setShowModal(true);
  };

  const parseLessons = (text) =>
    text.split("\n").map((line, i) => ({ title: line.trim(), duration: "15 min", order: i + 1 })).filter(l => l.title);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.instructor || !form.duration) {
      setFormError("Please fill all required fields."); return;
    }
    setFormLoading(true);
    try {
      const payload = { ...form, lessons: parseLessons(form.lessonsText) };
      delete payload.lessonsText;
      if (editingCourse) {
        await coursesAPI.update(editingCourse._id, payload);
        showSuccess("✅ Course updated successfully!");
      } else {
        await coursesAPI.create(payload);
        showSuccess("✅ Course created successfully!");
      }
      setShowModal(false);
      fetchAll();
    } catch (err) {
      setFormError(err.response?.data?.message || "Operation failed.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await coursesAPI.delete(id);
      setDeleteConfirm(null);
      showSuccess("🗑️ Course deleted.");
      fetchAll();
    } catch { alert("Delete failed."); }
  };

  const handleToggleAdmin = async (userId) => {
    try {
      await authAPI.makeAdmin(userId);
      showSuccess("✅ User role updated!");
      fetchAll();
    } catch { alert("Failed to update role."); }
  };

  const inputStyle = {
    background: "#0e0e1c", border: "1px solid #2a2a4e",
    color: "#f0f0ff", borderRadius: 10, padding: "10px 14px",
    width: "100%", fontFamily: "Plus Jakarta Sans, sans-serif", fontSize: "0.9rem", outline: "none",
  };

  const tabStyle = (tab) => ({
    padding: "10px 22px",
    background: activeTab === tab ? "rgba(124,111,255,0.12)" : "transparent",
    border: "none",
    borderBottom: activeTab === tab ? "2px solid #7c6fff" : "2px solid transparent",
    color: activeTab === tab ? "#7c6fff" : "#9090b8",
    fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
    fontFamily: "Plus Jakarta Sans, sans-serif",
  });

  if (loading) return <Spinner message="Loading admin panel..." />;

  return (
    <div style={{ background: "#07070f", minHeight: "100vh", padding: "40px 0 80px" }}>
      <div className="container" style={{ maxWidth: 1200 }}>

        {/* Header */}
        <div className="d-flex align-items-center justify-content-between mb-5 flex-wrap gap-3">
          <div>
            <h1 style={{ fontWeight: 800, color: "#f0f0ff", fontSize: "2rem", margin: 0 }}>👑 Admin Panel</h1>
            <p style={{ color: "#9090b8", margin: 0 }}>Manage courses, users, and platform content</p>
          </div>
          <button onClick={openAdd} className="btn btn-glow px-4 py-2" style={{ borderRadius: 10 }}>
            <i className="bi bi-plus-lg me-2"></i>Add New Course
          </button>
        </div>

        {successMsg && (
          <div style={{ padding: "12px 20px", marginBottom: 24, borderRadius: 10, background: "rgba(0,229,176,0.1)", border: "1px solid rgba(0,229,176,0.3)", color: "#00e5b0", fontWeight: 600 }}>
            {successMsg}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="row g-3 mb-5">
            {[
              { label: "Total Courses", val: stats.totalCourses, icon: "bi-collection-play", color: "#7c6fff" },
              { label: "Total Users", val: stats.totalUsers, icon: "bi-people-fill", color: "#00e5b0" },
              { label: "Total Enrollments", val: stats.totalEnrollments, icon: "bi-bookmark-check-fill", color: "#ffd166" },
              { label: "Avg per Course", val: stats.totalCourses ? Math.round(stats.totalEnrollments / stats.totalCourses) : 0, icon: "bi-graph-up-arrow", color: "#ff6b9d" },
            ].map((s, i) => (
              <div key={i} className="col-6 col-lg-3">
                <div style={{ background: "#111124", border: "1px solid #1e1e3a", borderRadius: 14, padding: "20px 24px" }}>
                  <div className="d-flex align-items-center gap-3">
                    <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}15`, border: `1px solid ${s.color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: "1.2rem" }}></i>
                    </div>
                    <div>
                      <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#f0f0ff", lineHeight: 1 }}>{s.val}</div>
                      <div style={{ fontSize: "0.78rem", color: "#55557a", marginTop: 2 }}>{s.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ borderBottom: "1px solid #1e1e3a", marginBottom: 28 }}>
          <button style={tabStyle("courses")} onClick={() => setActiveTab("courses")}>
            <i className="bi bi-collection-play me-2"></i>Courses ({courses.length})
          </button>
          <button style={tabStyle("users")} onClick={() => setActiveTab("users")}>
            <i className="bi bi-people me-2"></i>Users ({users.length})
          </button>
        </div>

        {/* Courses Table */}
        {activeTab === "courses" && (
          <div style={{ background: "#111124", border: "1px solid #1e1e3a", borderRadius: 14, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e1e3a" }}>
                  {["Course", "Category", "Level", "Enrolled", "Actions"].map(h => (
                    <th key={h} style={{ padding: "14px 20px", color: "#55557a", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {courses.map((course, i) => (
                  <tr key={course._id}
                    style={{ borderBottom: i < courses.length - 1 ? "1px solid #1e1e3a" : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#13132a"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "16px 20px" }}>
                      <div className="d-flex align-items-center gap-3">
                        <img src={course.thumbnail || "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=60"} alt=""
                          style={{ width: 44, height: 44, borderRadius: 8, objectFit: "cover" }}
                          onError={e => { e.target.src = "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=60"; }} />
                        <div>
                          <div style={{ fontWeight: 700, color: "#f0f0ff", fontSize: "0.9rem" }}>{course.title}</div>
                          <div style={{ fontSize: "0.78rem", color: "#55557a" }}>{course.instructor}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 700, background: "rgba(124,111,255,0.12)", color: "#7c6fff", border: "1px solid rgba(124,111,255,0.25)" }}>{course.category}</span>
                    </td>
                    <td style={{ padding: "16px 20px", color: "#9090b8", fontSize: "0.85rem" }}>{course.level}</td>
                    <td style={{ padding: "16px 20px", color: "#9090b8", fontSize: "0.85rem" }}>
                      <i className="bi bi-people me-1" style={{ color: "#00e5b0" }}></i>{course.enrolledCount || 0}
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <div className="d-flex gap-2">
                        <button onClick={() => openEdit(course)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #2a2a4e", background: "transparent", color: "#9090b8", fontSize: "0.82rem", cursor: "pointer", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}>
                          <i className="bi bi-pencil me-1"></i>Edit
                        </button>
                        <button onClick={() => setDeleteConfirm(course)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid rgba(255,107,157,0.3)", background: "rgba(255,107,157,0.08)", color: "#ff6b9d", fontSize: "0.82rem", cursor: "pointer", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}>
                          <i className="bi bi-trash me-1"></i>Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {courses.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 24px", color: "#55557a" }}>
                No courses yet.
              </div>
            )}
          </div>
        )}

        {/* Users Table */}
        {activeTab === "users" && (
          <div style={{ background: "#111124", border: "1px solid #1e1e3a", borderRadius: 14, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e1e3a" }}>
                  {["User", "Role", "Enrolled Courses", "Joined", "Actions"].map(h => (
                    <th key={h} style={{ padding: "14px 20px", color: "#55557a", fontSize: "0.78rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u._id}
                    style={{ borderBottom: i < users.length - 1 ? "1px solid #1e1e3a" : "none" }}
                    onMouseEnter={e => e.currentTarget.style.background = "#13132a"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "16px 20px" }}>
                      <div className="d-flex align-items-center gap-3">
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #7c6fff, #ff6b9d)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "white", fontSize: "0.9rem" }}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: "#f0f0ff", fontSize: "0.9rem" }}>{u.name}</div>
                          <div style={{ fontSize: "0.78rem", color: "#55557a" }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}>
                      <span style={{ padding: "3px 10px", borderRadius: 50, fontSize: "0.72rem", fontWeight: 700, background: u.role === "admin" ? "rgba(255,209,102,0.15)" : "rgba(124,111,255,0.12)", color: u.role === "admin" ? "#ffd166" : "#7c6fff", border: `1px solid ${u.role === "admin" ? "rgba(255,209,102,0.3)" : "rgba(124,111,255,0.25)"}` }}>
                        {u.role === "admin" ? "👑 Admin" : "🎓 Student"}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", color: "#9090b8", fontSize: "0.85rem" }}>{u.enrolledCourses?.length || 0} courses</td>
                    <td style={{ padding: "16px 20px", color: "#9090b8", fontSize: "0.85rem" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={{ padding: "16px 20px" }}>
                      <button onClick={() => handleToggleAdmin(u._id)} style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid #2a2a4e", background: "transparent", color: "#9090b8", fontSize: "0.82rem", cursor: "pointer", fontFamily: "Plus Jakarta Sans, sans-serif", fontWeight: 600 }}>
                        {u.role === "admin" ? "Remove Admin" : "Make Admin"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: "#111124", border: "1px solid #2a2a4e", borderRadius: 18, padding: 32, width: "100%", maxWidth: 620, maxHeight: "90vh", overflowY: "auto" }}>
            <div className="d-flex align-items-center justify-content-between mb-4">
              <h4 style={{ fontWeight: 800, color: "#f0f0ff", margin: 0 }}>{editingCourse ? "✏️ Edit Course" : "➕ Add New Course"}</h4>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", color: "#9090b8", fontSize: "1.3rem", cursor: "pointer" }}>✕</button>
            </div>

            {formError && (
              <div style={{ padding: "10px 14px", marginBottom: 20, borderRadius: 8, background: "rgba(255,107,157,0.1)", border: "1px solid rgba(255,107,157,0.3)", color: "#ff6b9d", fontSize: "0.85rem" }}>{formError}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12">
                  <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#9090b8" }}>Title *</label>
                  <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. JavaScript for Beginners" />
                </div>
                <div className="col-12">
                  <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#9090b8" }}>Description *</label>
                  <textarea style={{ ...inputStyle, resize: "vertical", minHeight: 80 }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Course description..." />
                </div>
                <div className="col-6">
                  <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#9090b8" }}>Instructor *</label>
                  <input style={inputStyle} value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} placeholder="e.g. John Smith" />
                </div>
                <div className="col-6">
                  <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#9090b8" }}>Duration *</label>
                  <input style={inputStyle} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="e.g. 10 hours" />
                </div>
                <div className="col-6">
                  <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#9090b8" }}>Category *</label>
                  <select style={inputStyle} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#9090b8" }}>Level *</label>
                  <select style={inputStyle} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}>
                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#9090b8" }}>Thumbnail URL <span style={{ color: "#55557a", fontWeight: 400 }}>(optional)</span></label>
                  <input style={inputStyle} value={form.thumbnail} onChange={e => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://..." />
                </div>
                <div className="col-12">
                  <label style={{ display: "block", marginBottom: 6, fontSize: "0.82rem", fontWeight: 600, color: "#9090b8" }}>Lessons <span style={{ color: "#55557a", fontWeight: 400 }}>(one per line)</span></label>
                  <textarea
                    style={{ ...inputStyle, resize: "vertical", minHeight: 120, fontFamily: "monospace", fontSize: "0.82rem" }}
                    value={form.lessonsText}
                    onChange={e => setForm({ ...form, lessonsText: e.target.value })}
                    placeholder={"Introduction\nSetting up\nCore concepts\nFinal project"}
                    rows={5}
                  />
                  <p style={{ color: "#55557a", fontSize: "0.75rem", marginTop: 4 }}>
                    {form.lessonsText.split("\n").filter(l => l.trim()).length} lessons added
                  </p>
                </div>
              </div>
              <div className="d-flex gap-3 mt-4">
                <button type="submit" disabled={formLoading} style={{ flex: 1, padding: "12px", borderRadius: 10, background: formLoading ? "#2a2a4e" : "linear-gradient(135deg, #7c6fff, #6357e8)", color: "white", border: "none", fontWeight: 700, fontSize: "0.95rem", cursor: formLoading ? "not-allowed" : "pointer", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  {formLoading ? <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</> : editingCourse ? "✅ Save Changes" : "➕ Create Course"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} style={{ padding: "12px 20px", borderRadius: 10, border: "1px solid #2a2a4e", background: "transparent", color: "#9090b8", fontWeight: 600, cursor: "pointer", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: "#111124", border: "1px solid rgba(255,107,157,0.3)", borderRadius: 16, padding: 32, maxWidth: 400, width: "100%", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>🗑️</div>
            <h4 style={{ fontWeight: 800, color: "#f0f0ff", marginBottom: 8 }}>Delete Course?</h4>
            <p style={{ color: "#9090b8", marginBottom: 24, fontSize: "0.9rem" }}>
              Are you sure you want to delete <strong style={{ color: "#f0f0ff" }}>"{deleteConfirm.title}"</strong>? This cannot be undone.
            </p>
            <div className="d-flex gap-3 justify-content-center">
              <button onClick={() => handleDelete(deleteConfirm._id)} style={{ padding: "10px 24px", borderRadius: 10, background: "rgba(255,107,157,0.15)", border: "1px solid rgba(255,107,157,0.4)", color: "#ff6b9d", fontWeight: 700, cursor: "pointer", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Yes, Delete
              </button>
              <button onClick={() => setDeleteConfirm(null)} style={{ padding: "10px 24px", borderRadius: 10, border: "1px solid #2a2a4e", background: "transparent", color: "#9090b8", fontWeight: 600, cursor: "pointer", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;