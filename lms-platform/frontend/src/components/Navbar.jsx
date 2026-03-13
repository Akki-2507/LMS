import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = () => setDropdownOpen(false);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const handleLogout = () => { logout(); navigate("/"); setMenuOpen(false); setDropdownOpen(false); };
  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    color: isActive(path) ? "#7c6fff" : "#9090b8",
    fontWeight: 600, fontSize: "0.9rem",
    padding: "6px 14px", borderRadius: 8,
    background: isActive(path) ? "rgba(124,111,255,0.1)" : "transparent",
    transition: "all 0.2s", display: "inline-block", textDecoration: "none",
  });

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 999,
      background: scrolled ? "rgba(7,7,15,0.97)" : "rgba(7,7,15,0.75)",
      backdropFilter: "blur(20px)",
      borderBottom: `1px solid ${scrolled ? "#1e1e3a" : "transparent"}`,
      transition: "all 0.3s ease",
    }}>
      <div className="container" style={{ maxWidth: 1200 }}>
        <div className="d-flex align-items-center justify-content-between" style={{ height: 68 }}>

          <Link to="/" className="d-flex align-items-center gap-2" style={{ textDecoration: "none" }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #7c6fff, #00e5b0)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace", fontWeight: 700, fontSize: "0.85rem", color: "white" }}>{"<>"}</div>
            <span style={{ fontWeight: 800, fontSize: "1.1rem", color: "#f0f0ff" }}>Code<span style={{ color: "#7c6fff" }}>Learn</span></span>
          </Link>

          <div className="d-none d-lg-flex align-items-center gap-1">
            <Link to="/" style={linkStyle("/")}>Home</Link>
            <Link to="/courses" style={linkStyle("/courses")}>Courses</Link>
            {isAuthenticated && <Link to="/my-courses" style={linkStyle("/my-courses")}>My Learning</Link>}
            {isAdmin && (
              <Link to="/admin" style={{ ...linkStyle("/admin"), color: isActive("/admin") ? "#ffd166" : "#ffd166aa", background: isActive("/admin") ? "rgba(255,209,102,0.1)" : "transparent" }}>
                👑 Admin
              </Link>
            )}
          </div>

          <div className="d-none d-lg-flex align-items-center gap-2">
            {isAuthenticated ? (
              <div style={{ position: "relative" }}>
                <button onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
                  style={{ display: "flex", alignItems: "center", gap: 10, background: "#13132a", border: "1px solid #1e1e3a", borderRadius: 10, padding: "7px 14px 7px 8px", cursor: "pointer" }}>
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg, #7c6fff, #ff6b9d)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "0.8rem", color: "white" }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ color: "#9090b8", fontSize: "0.88rem", fontWeight: 600 }}>{user?.name?.split(" ")[0]}</span>
                  <i className={`bi bi-chevron-${dropdownOpen ? "up" : "down"}`} style={{ color: "#55557a", fontSize: "0.7rem" }}></i>
                </button>

                {dropdownOpen && (
                  <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, background: "#111124", border: "1px solid #1e1e3a", borderRadius: 12, padding: 6, minWidth: 180, boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 100 }}>
                    <div style={{ padding: "10px 14px", borderBottom: "1px solid #1e1e3a", marginBottom: 4 }}>
                      <div style={{ fontWeight: 700, color: "#f0f0ff", fontSize: "0.88rem" }}>{user?.name}</div>
                      <div style={{ color: "#55557a", fontSize: "0.76rem" }}>{user?.email}</div>
                      {isAdmin && <span style={{ display: "inline-block", marginTop: 4, padding: "2px 8px", borderRadius: 50, fontSize: "0.68rem", fontWeight: 700, background: "rgba(255,209,102,0.15)", color: "#ffd166", border: "1px solid rgba(255,209,102,0.3)" }}>👑 Admin</span>}
                    </div>
                    {[
                      { to: "/profile", icon: "bi-person", label: "My Profile" },
                      { to: "/my-courses", icon: "bi-collection-play", label: "My Learning" },
                      ...(isAdmin ? [{ to: "/admin", icon: "bi-shield-check", label: "Admin Panel" }] : []),
                    ].map(item => (
                      <Link key={item.to} to={item.to} onClick={() => setDropdownOpen(false)}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 8, color: "#9090b8", fontWeight: 600, fontSize: "0.88rem", textDecoration: "none" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(124,111,255,0.08)"; e.currentTarget.style.color = "#f0f0ff"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9090b8"; }}
                      >
                        <i className={`bi ${item.icon}`}></i>{item.label}
                      </Link>
                    ))}
                    <div style={{ borderTop: "1px solid #1e1e3a", marginTop: 4, paddingTop: 4 }}>
                      <button onClick={handleLogout}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", borderRadius: 8, width: "100%", background: "none", border: "none", color: "#ff6b9d", fontWeight: 600, fontSize: "0.88rem", cursor: "pointer", fontFamily: "Plus Jakarta Sans, sans-serif" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,157,0.08)"}
                        onMouseLeave={e => e.currentTarget.style.background = "none"}
                      >
                        <i className="bi bi-box-arrow-right"></i> Log Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm px-4">Log In</Link>
                <Link to="/signup" className="btn btn-glow btn-sm px-4">Sign Up</Link>
              </>
            )}
          </div>

          <button className="d-lg-none btn" onClick={() => setMenuOpen(!menuOpen)}
            style={{ color: "#9090b8", border: "1px solid #1e1e3a", borderRadius: 8, padding: "6px 10px" }}>
            <i className={`bi ${menuOpen ? "bi-x-lg" : "bi-list"} fs-5`}></i>
          </button>
        </div>

        {menuOpen && (
          <div className="d-lg-none pb-4 d-flex flex-column gap-1" style={{ borderTop: "1px solid #1e1e3a", paddingTop: 12 }}>
            {[
              { to: "/", label: "Home", icon: "bi-house" },
              { to: "/courses", label: "Courses", icon: "bi-collection-play" },
              ...(isAuthenticated ? [
                { to: "/my-courses", label: "My Learning", icon: "bi-bookmark" },
                { to: "/profile", label: "My Profile", icon: "bi-person" },
                ...(isAdmin ? [{ to: "/admin", label: "Admin Panel", icon: "bi-shield-check" }] : []),
              ] : []),
            ].map(l => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                style={{ display: "flex", alignItems: "center", gap: 10, color: isActive(l.to) ? "#7c6fff" : "#9090b8", fontWeight: 600, padding: "10px 12px", borderRadius: 8, background: isActive(l.to) ? "rgba(124,111,255,0.1)" : "transparent", textDecoration: "none" }}>
                <i className={`bi ${l.icon}`}></i>{l.label}
              </Link>
            ))}
            <div className="d-flex gap-2 mt-2 pt-2" style={{ borderTop: "1px solid #1e1e3a" }}>
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn btn-ghost btn-sm flex-grow-1">
                  <i className="bi bi-box-arrow-right me-2"></i>Log Out
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-ghost btn-sm flex-grow-1">Log In</Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="btn btn-glow btn-sm flex-grow-1">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;