import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import Spinner from "../components/Spinner";
import { coursesAPI } from "../services/api";

const CATEGORIES = ["All", "Programming Language", "Web Development", "Backend Development", "Data Science"];
const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"];

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const level = searchParams.get("level") || "All";

  const updateParam = (key, val) => {
    const next = new URLSearchParams(searchParams);
    if (val && val !== "All" && val !== "") next.set(key, val);
    else next.delete(key);
    setSearchParams(next);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      setError("");
      try {
        const params = {};
        if (search) params.search = search;
        if (category !== "All") params.category = category;
        if (level !== "All") params.level = level;
        const { data } = await coursesAPI.getAll(params);
        setCourses(data);
      } catch {
        setError("Failed to load courses. Make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    const t = setTimeout(fetchCourses, 250);
    return () => clearTimeout(t);
  }, [search, category, level]);

  const handleSeed = async () => {
    setLoading(true);
    try {
      await coursesAPI.seed();
      const { data } = await coursesAPI.getAll({});
      setCourses(data);
      setError("");
    } catch {
      setError("Seeding failed.");
    } finally {
      setLoading(false);
    }
  };

  const filterBtn = (active, color = "#7c6fff") => ({
    padding: "6px 18px", borderRadius: 50,
    fontSize: "0.82rem", fontWeight: 600,
    border: active ? `1px solid ${color}` : "1px solid #2a2a4e",
    background: active ? `${color}18` : "transparent",
    color: active ? color : "#9090b8",
    cursor: "pointer", transition: "all 0.18s", whiteSpace: "nowrap"
  });

  return (
    <div style={{ background: "#07070f", minHeight: "100vh" }}>

      {/* Header + Search */}
      <div style={{
        background: "linear-gradient(180deg, #0e0e1c 0%, #07070f 100%)",
        borderBottom: "1px solid #1e1e3a",
        padding: "52px 0 36px"
      }}>
        <div className="container" style={{ maxWidth: 1100 }}>
          <div className="text-center mb-5">
            <h1 style={{ fontWeight: 800, fontSize: "clamp(1.8rem,4vw,2.6rem)", color: "#f0f0ff", marginBottom: 10 }}>
              All{" "}
              <span style={{
                background: "linear-gradient(135deg, #7c6fff, #00e5b0)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
              }}>Courses</span>
            </h1>
            <p style={{ color: "#9090b8", fontSize: "1rem" }}>
              {courses.length > 0
                ? `${courses.length} programming courses available`
                : "Explore expert-led programming courses"}
            </p>
          </div>

          {/* Search */}
          <div className="d-flex justify-content-center mb-4">
            <div style={{
              display: "flex", alignItems: "center",
              background: "#13132a", border: "1px solid #2a2a4e",
              borderRadius: 14, padding: "6px 6px 6px 20px",
              width: "100%", maxWidth: 580,
              boxShadow: "0 4px 24px rgba(0,0,0,0.3)"
            }}>
              <i className="bi bi-search me-2" style={{ color: "#55557a" }}></i>
              <input
                type="text"
                placeholder="Search by course name or instructor..."
                value={search}
                onChange={e => updateParam("search", e.target.value)}
                style={{
                  flex: 1, background: "none", border: "none", outline: "none",
                  color: "#f0f0ff", fontSize: "0.95rem",
                  fontFamily: "Plus Jakarta Sans, sans-serif"
                }}
              />
              {search && (
                <button onClick={() => updateParam("search", "")}
                  style={{
                    background: "#2a2a4e", border: "none", borderRadius: 8,
                    color: "#9090b8", padding: "4px 10px", cursor: "pointer", marginRight: 4
                  }}>
                  <i className="bi bi-x"></i>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter */}
          <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap mb-3">
            {CATEGORIES.map(cat => (
              <button key={cat} style={filterBtn(category === cat)}
                onClick={() => updateParam("category", cat)}>
                {cat}
              </button>
            ))}
          </div>

          {/* Level Filter */}
          <div className="d-flex align-items-center justify-content-center gap-2 flex-wrap">
            {LEVELS.map(lv => (
              <button key={lv} style={filterBtn(level === lv, "#00e5b0")}
                onClick={() => updateParam("level", lv)}>
                {lv}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      <div style={{ padding: "48px 0 80px" }}>
        <div className="container" style={{ maxWidth: 1100 }}>

          {/* Active filter tags */}
          {(search || category !== "All" || level !== "All") && (
            <div className="d-flex align-items-center gap-2 mb-4 flex-wrap">
              <span style={{ color: "#55557a", fontSize: "0.85rem" }}>Filtered:</span>
              {search && (
                <span className="tag-pill" style={{ background: "rgba(124,111,255,0.12)", color: "#7c6fff", border: "1px solid rgba(124,111,255,0.25)" }}>
                  🔍 "{search}"
                  <button onClick={() => updateParam("search", "")}
                    style={{ background: "none", border: "none", color: "#7c6fff", marginLeft: 6, cursor: "pointer", padding: 0 }}>✕</button>
                </span>
              )}
              {category !== "All" && (
                <span className="tag-pill" style={{ background: "rgba(124,111,255,0.12)", color: "#7c6fff", border: "1px solid rgba(124,111,255,0.25)" }}>
                  {category}
                  <button onClick={() => updateParam("category", "All")}
                    style={{ background: "none", border: "none", color: "#7c6fff", marginLeft: 6, cursor: "pointer", padding: 0 }}>✕</button>
                </span>
              )}
              {level !== "All" && (
                <span className="tag-pill" style={{ background: "rgba(0,229,176,0.12)", color: "#00e5b0", border: "1px solid rgba(0,229,176,0.25)" }}>
                  {level}
                  <button onClick={() => updateParam("level", "All")}
                    style={{ background: "none", border: "none", color: "#00e5b0", marginLeft: 6, cursor: "pointer", padding: 0 }}>✕</button>
                </span>
              )}
              <span style={{ color: "#55557a", fontSize: "0.82rem", marginLeft: "auto" }}>
                {courses.length} result{courses.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {loading ? (
            <Spinner message="Loading courses..." />
          ) : error ? (
            <div className="text-center py-5">
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>⚠️</div>
              <p style={{ color: "#9090b8" }}>{error}</p>
              <button onClick={handleSeed} className="btn btn-glow mt-3 px-4 py-2">
                🌱 Load Sample Courses
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: "3.5rem", marginBottom: 16 }}>📭</div>
              <h4 style={{ color: "#f0f0ff", marginBottom: 8 }}>No courses found</h4>
              <p style={{ color: "#9090b8" }}>Try different search terms or clear the filters.</p>
              {!search && category === "All" && level === "All" && (
                <button onClick={handleSeed} className="btn btn-glow mt-3 px-4 py-2">
                  🌱 Load Sample Courses
                </button>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {courses.map(course => (
                <div key={course._id} className="col-12 col-sm-6 col-lg-4">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Courses;