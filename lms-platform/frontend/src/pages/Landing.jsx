import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/courses?search=${encodeURIComponent(searchInput)}`);
  };

  const stats = [
    { val: "10+", label: "Expert Courses", icon: "bi-play-circle-fill", color: "#7c6fff" },
    { val: "20k+", label: "Students", icon: "bi-people-fill", color: "#00e5b0" },
    { val: "4.8★", label: "Avg Rating", icon: "bi-star-fill", color: "#ffd166" },
    { val: "100%", label: "Free Access", icon: "bi-unlock-fill", color: "#ff6b9d" },
  ];

  const features = [
    { icon: "bi-code-slash", title: "Learn by Doing", desc: "Hands-on projects and real-world code examples in every course.", color: "#7c6fff" },
    { icon: "bi-bar-chart-steps", title: "Track Progress", desc: "Visual progress bars and lesson completion tracking.", color: "#00e5b0" },
    { icon: "bi-award", title: "Get Certified", desc: "Earn completion certificates to showcase your skills.", color: "#ffd166" },
    { icon: "bi-shield-check", title: "Expert Instructors", desc: "Courses built by senior engineers with years of experience.", color: "#ff6b9d" },
  ];

  const popularTopics = [
    { label: "JavaScript"},
    { label: "React"},
    { label: "Python"},
    { label: "Node.js"},
    { label: "MongoDB"},
    { label: "Data Science"},
    { label: "Java"},
    { label: "C++"},
  ];

  const categories = [
    { label: "Programming Language", icon: "bi-code-square", color: "#7c6fff", desc: "JavaScript, Python, Java, C++" },
    { label: "Web Development", icon: "bi-globe2", color: "#38bdf8", desc: "React, HTML, CSS, Full Stack" },
    { label: "Backend Development", icon: "bi-server", color: "#00e5b0", desc: "Node.js, Express, MongoDB" },
    { label: "Data Science", icon: "bi-graph-up-arrow", color: "#ffd166", desc: "ML, Python, Pandas, NumPy" },
  ];

  return (
    <div style={{ background: "#07070f", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", padding: "100px 0 80px", overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)",
          width: 700, height: 700, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,111,255,0.12) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", top: 200, right: -200,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,229,176,0.08) 0%, transparent 70%)",
          pointerEvents: "none"
        }} />

        <div className="container" style={{ maxWidth: 1100, position: "relative" }}>
          <div className="text-center">
            {/* Badge */}
            <div className="d-inline-flex align-items-center gap-2 mb-4 px-4 py-2" style={{
              background: "rgba(124,111,255,0.1)",
              border: "1px solid rgba(124,111,255,0.25)",
              borderRadius: 50, color: "#7c6fff",
              fontSize: "0.82rem", fontWeight: 700, letterSpacing: "0.04em"
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: "50%",
                background: "#00e5b0", display: "inline-block",
                animation: "pulse 2s infinite"
              }}></span>
              NOW LIVE — 10 PROGRAMMING COURSES
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: "clamp(2.4rem, 6vw, 4rem)", fontWeight: 800,
              lineHeight: 1.15, color: "#f0f0ff", marginBottom: 24
            }}>
              The Fastest Way to{" "}
              <span style={{
                background: "linear-gradient(135deg, #7c6fff 0%, #00e5b0 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>
                Master Coding
              </span>
            </h1>

            <p style={{
              fontSize: "1.1rem", color: "#9090b8",
              maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.8
            }}>
              Expert-led courses in JavaScript, Python, React, Node.js and more.
              Build real projects. Get hired faster.
            </p>

            {/* ── SEARCH BAR ── */}
            <form onSubmit={handleSearch} className="d-flex justify-content-center mb-4">
              <div style={{
                display: "flex", alignItems: "center",
                background: "#13132a", border: "1px solid #2a2a4e",
                borderRadius: 14, padding: "6px 6px 6px 20px",
                width: "100%", maxWidth: 580,
                boxShadow: "0 4px 24px rgba(0,0,0,0.4)"
              }}>
                <i className="bi bi-search me-2" style={{ color: "#55557a", fontSize: "1rem" }}></i>
                <input
                  type="text"
                  placeholder="Search courses e.g. React, Python, Node.js..."
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    color: "#f0f0ff", fontSize: "0.95rem",
                    fontFamily: "Plus Jakarta Sans, sans-serif"
                  }}
                />
                <button type="submit" className="btn btn-glow px-4 py-2"
                  style={{ borderRadius: 10, fontSize: "0.9rem", whiteSpace: "nowrap" }}>
                  Search
                </button>
              </div>
            </form>

            {/* Popular topics */}
            <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
              <span style={{ color: "#55557a", fontSize: "0.82rem", fontWeight: 600 }}>Popular:</span>
              {popularTopics.map((t, i) => (
                <button key={i}
                  onClick={() => navigate(`/courses?search=${encodeURIComponent(t.label)}`)}
                  style={{
                    background: "#13132a", border: "1px solid #1e1e3a",
                    borderRadius: 50, padding: "4px 14px",
                    color: "#9090b8", fontSize: "0.82rem", fontWeight: 600,
                    cursor: "pointer", transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#7c6fff"; e.currentTarget.style.color = "#7c6fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e3a"; e.currentTarget.style.color = "#9090b8"; }}
                >
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: "40px 0", borderTop: "1px solid #1e1e3a", borderBottom: "1px solid #1e1e3a" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="row g-4 justify-content-center">
            {stats.map((s, i) => (
              <div key={i} className="col-6 col-md-3 text-center">
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: `${s.color}18`, border: `1px solid ${s.color}30`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  margin: "0 auto 10px"
                }}>
                  <i className={`bi ${s.icon}`} style={{ color: s.color, fontSize: "1.3rem" }}></i>
                </div>
                <div style={{ fontSize: "1.8rem", fontWeight: 800, color: "#f0f0ff" }}>{s.val}</div>
                <div style={{ fontSize: "0.78rem", color: "#55557a", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section style={{ padding: "80px 0" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="text-center mb-5">
            <h2 style={{ fontWeight: 800, color: "#f0f0ff", fontSize: "clamp(1.6rem,4vw,2.2rem)" }}>
              Browse by{" "}
              <span style={{
                background: "linear-gradient(135deg, #7c6fff, #00e5b0)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>Category</span>
            </h2>
            <p style={{ color: "#9090b8", marginTop: 8 }}>Pick a track and start building real skills today</p>
          </div>
          <div className="row g-3">
            {categories.map((cat, i) => (
              <div key={i} className="col-6 col-lg-3">
                <div
                  className="glow-card p-4 text-center h-100"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/courses?category=${encodeURIComponent(cat.label)}`)}
                >
                  <div style={{
                    width: 56, height: 56, borderRadius: 16,
                    background: `${cat.color}15`, border: `1px solid ${cat.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 14px"
                  }}>
                    <i className={`bi ${cat.icon}`} style={{ color: cat.color, fontSize: "1.5rem" }}></i>
                  </div>
                  <h6 style={{ fontWeight: 700, color: "#f0f0ff", marginBottom: 6 }}>{cat.label}</h6>
                  <p style={{ fontSize: "0.8rem", color: "#55557a", margin: 0 }}>{cat.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: "80px 0", background: "#0e0e1c", borderTop: "1px solid #1e1e3a", borderBottom: "1px solid #1e1e3a" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="text-center mb-5">
            <h2 style={{ fontWeight: 800, color: "#f0f0ff", fontSize: "clamp(1.6rem,4vw,2.2rem)" }}>
              Why{" "}
              <span style={{
                background: "linear-gradient(135deg, #7c6fff, #00e5b0)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>CodeLearn?</span>
            </h2>
          </div>
          <div className="row g-4">
            {features.map((f, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-3">
                <div className="glow-card p-4 h-100">
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: `${f.color}15`, border: `1px solid ${f.color}25`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: 16
                  }}>
                    <i className={`bi ${f.icon}`} style={{ color: f.color, fontSize: "1.4rem" }}></i>
                  </div>
                  <h6 style={{ fontWeight: 700, color: "#f0f0ff", marginBottom: 8 }}>{f.title}</h6>
                  <p style={{ fontSize: "0.85rem", color: "#9090b8", margin: 0, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "100px 0" }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="text-center p-5 rounded-4" style={{
            background: "linear-gradient(135deg, rgba(124,111,255,0.15) 0%, rgba(0,229,176,0.08) 100%)",
            border: "1px solid rgba(124,111,255,0.25)"
          }}>
            <h2 style={{ fontWeight: 800, color: "#f0f0ff", fontSize: "clamp(1.6rem,4vw,2.5rem)", marginBottom: 16 }}>
              Ready to Start Coding?
            </h2>
            <p style={{ color: "#9090b8", fontSize: "1rem", marginBottom: 32, maxWidth: 440, margin: "0 auto 32px" }}>
              Join thousands of developers learning in-demand programming skills.
            </p>
            <div className="d-flex gap-3 justify-content-center flex-wrap">
              <button onClick={() => navigate("/courses")} className="btn btn-glow px-5 py-3"
                style={{ fontSize: "1rem", borderRadius: 12 }}>
                <i className="bi bi-rocket-takeoff me-2"></i>Explore Courses
              </button>
              <button onClick={() => navigate("/signup")} className="btn btn-ghost px-5 py-3"
                style={{ fontSize: "1rem", borderRadius: 12 }}>
                Create Free Account
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: "1px solid #1e1e3a", padding: "32px 0", textAlign: "center" }}>
        <p style={{ color: "#55557a", fontSize: "0.85rem", margin: 0 }}>
          © 2024 CodeLearn LMS · Built with React & Node.js
        </p>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
};

export default Landing;