import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import SearchBar from "../components/SearchBar";
import Spinner from "../components/Spinner";
import { coursesAPI } from "../services/api";

const Home = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");

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

    const timer = setTimeout(fetchCourses, 300);
    return () => clearTimeout(timer);
  }, [search, category, level]);

  const handleSeed = async () => {
    setLoading(true);
    try {
      await coursesAPI.seed();
      const { data } = await coursesAPI.getAll({});
      setCourses(data);
      setError("");
    } catch {
      setError("Seeding failed. Please check if the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const filtersActive = search || category !== "All" || level !== "All";

  return (
    <div className="page-shell">
      <div className="container d-flex flex-column gap-5">
        <section className="hero-panel p-4 p-lg-5">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-7">
              <span className="eyebrow mb-4">Build production skills</span>
              <h1 className="hero-title mb-4">
                Learn software engineering with a
                <span className="hero-gradient-text"> cleaner path to mastery</span>
              </h1>
              <p className="hero-subtitle mb-4">
                Explore focused tracks in frontend, backend, Python, and data. Every course is structured to move from core concepts to practical work you can ship.
              </p>
              <div className="d-flex flex-wrap gap-3 mb-4">
                <button className="btn btn-primary-custom px-4 py-3" onClick={() => document.getElementById("catalog")?.scrollIntoView()}>
                  Explore Courses
                </button>
                <button className="btn btn-outline-custom px-4 py-3" onClick={handleSeed}>
                  Load Sample Data
                </button>
              </div>
              <div className="stats-grid">
                {[
                  { value: "10+", label: "Course tracks" },
                  { value: "20k+", label: "Learners reached" },
                  { value: "4.8", label: "Average rating" },
                ].map((item) => (
                  <div key={item.label} className="stat-card">
                    <div className="stat-value">{item.value}</div>
                    <div className="stat-label">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="col-12 col-lg-5">
              <div className="code-window">
                <div className="code-window-header">
                  <span className="code-window-dot" />
                  <span className="code-window-dot" />
                  <span className="code-window-dot" />
                  <span className="code-window-label">learning-path.js</span>
                </div>
                <pre>{[
                  "const learningPath = [",
                  '  "Core JavaScript",',
                  '  "Modern React",',
                  '  "Node APIs",',
                  '  "Testing",',
                  '  "Deployment"',
                  "];",
                  "",
                  "learningPath.forEach((module, index) => {",
                  '  console.log((index + 1) + ". " + module);',
                  "});",
                ].join("\n")}</pre>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SearchBar
            search={search}
            setSearch={setSearch}
            category={category}
            setCategory={setCategory}
            level={level}
            setLevel={setLevel}
          />
        </section>

        <section id="catalog">
          <div className="d-flex align-items-end justify-content-between gap-3 flex-wrap mb-4">
            <div>
              <h2 className="section-heading mb-2">{filtersActive ? `Filtered results (${courses.length})` : "Course catalog"}</h2>
              <p className="section-copy mb-0">
                Browse a sharper catalog experience with cleaner cards, clearer metadata, and focused paths by level and category.
              </p>
            </div>
            {courses.length > 0 && (
              <div className="surface-card px-3 py-2" style={{ color: "var(--text-secondary)", fontWeight: 700 }}>
                {courses.length} course{courses.length !== 1 ? "s" : ""}
              </div>
            )}
          </div>

          {loading ? (
            <Spinner message="Loading courses..." />
          ) : error ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <i className="bi bi-exclamation-triangle" />
              </div>
              <h4 className="fw-bold mb-2">Unable to load courses</h4>
              <p style={{ color: "var(--text-secondary)" }}>{error}</p>
              <button className="btn btn-primary-custom px-4 py-3 mt-2" onClick={handleSeed}>
                Seed Sample Courses
              </button>
            </div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">
                <i className="bi bi-collection-play" />
              </div>
              <h4 className="fw-bold mb-2">No courses matched your filters</h4>
              <p style={{ color: "var(--text-secondary)" }}>Adjust your filters or load sample courses to populate the catalog.</p>
              {!search && category === "All" && (
                <button className="btn btn-primary-custom px-4 py-3 mt-2" onClick={handleSeed}>
                  Load Sample Courses
                </button>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {courses.map((course) => (
                <div key={course._id} className="col-12 col-md-6 col-xl-4">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Home;
