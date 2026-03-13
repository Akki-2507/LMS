import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import Spinner from "../components/Spinner";
import { coursesAPI } from "../services/api";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const { data } = await coursesAPI.getMyCourses();
        setCourses(data);
      } catch {
        setError("Failed to load your courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) return <Spinner message="Loading your courses..." />;

  const stats = [
    { icon: "bi-collection-play", val: courses.length, label: "Enrolled", color: "var(--primary)" },
    { icon: "bi-check-circle", val: courses.filter((c) => c.progress === 100).length, label: "Completed", color: "var(--accent)" },
    { icon: "bi-lightning-charge", val: courses.filter((c) => c.progress > 0 && c.progress < 100).length, label: "Active", color: "var(--warning)" },
    {
      icon: "bi-graph-up",
      val: courses.length > 0 ? `${Math.round(courses.reduce((acc, course) => acc + (course.progress || 0), 0) / courses.length)}%` : "0%",
      label: "Avg progress",
      color: "var(--danger)",
    },
  ];

  return (
    <div className="page-shell">
      <div className="container d-flex flex-column gap-4">
        <section className="hero-panel p-4 p-lg-5">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
            <div>
              <span className="eyebrow mb-4">Learning dashboard</span>
              <h1 className="section-heading mb-2" style={{ fontSize: "clamp(2rem, 4vw, 3.4rem)" }}>
                My Learning
              </h1>
              <p className="section-copy mb-0">
                Track your active coursework, completion status, and next steps from a single view.
              </p>
            </div>
            <Link to="/" className="btn btn-primary-custom px-4 py-3">
              Browse Courses
            </Link>
          </div>
        </section>

        {error && (
          <div className="alert" style={{ background: "rgba(251,113,133,0.1)", border: "1px solid rgba(251,113,133,0.35)", color: "var(--danger)", borderRadius: 18 }}>
            {error}
          </div>
        )}

        {courses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <i className="bi bi-journal-code" />
            </div>
            <h4 className="fw-bold mb-2">Your learning queue is empty</h4>
            <p style={{ color: "var(--text-secondary)" }}>Enroll in a course to start building your roadmap.</p>
            <Link to="/" className="btn btn-primary-custom px-4 py-3 mt-2">
              Explore Courses
            </Link>
          </div>
        ) : (
          <>
            <section>
              <div className="row g-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="col-12 col-sm-6 col-xl-3">
                    <div className="dashboard-card h-100 d-flex align-items-center gap-3">
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 16,
                          background: "rgba(148,163,184,0.12)",
                          color: stat.color,
                          display: "grid",
                          placeItems: "center",
                          flexShrink: 0,
                        }}
                      >
                        <i className={`bi ${stat.icon}`} />
                      </div>
                      <div>
                        <div className="fw-bold fs-4">{stat.val}</div>
                        <div style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.74rem", fontWeight: 700 }}>
                          {stat.label}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <div className="row g-4">
                {courses.map((course) => (
                  <div key={course._id} className="col-12 col-md-6 col-xl-4">
                    <div className="card h-100 border-0" style={{ borderRadius: 22, overflow: "hidden" }}>
                      <div style={{ position: "relative", height: 180 }}>
                        <img
                          src={course.thumbnail || "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800"}
                          alt={course.title}
                          className="w-100 h-100"
                          style={{ objectFit: "cover" }}
                          onError={(e) => {
                            e.target.src = "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800";
                          }}
                        />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 32%, rgba(8,16,31,0.88) 100%)" }} />
                        {course.progress === 100 && (
                          <div className="position-absolute top-0 end-0 m-3 surface-card px-3 py-2" style={{ boxShadow: "none", color: "var(--accent)", fontWeight: 700 }}>
                            Completed
                          </div>
                        )}
                      </div>
                      <div className="card-body p-4 d-flex flex-column gap-3">
                        <div className="d-flex align-items-center justify-content-between gap-3">
                          <span style={{ color: "var(--primary)", fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.74rem" }}>
                            {course.category}
                          </span>
                          <span className="surface-card px-3 py-2" style={{ boxShadow: "none", color: "var(--text-secondary)", fontSize: "0.82rem" }}>
                            {course.lessons?.length || 0} lessons
                          </span>
                        </div>
                        <div>
                          <h5 className="fw-bold mb-2">{course.title}</h5>
                          <p className="mb-0" style={{ color: "var(--text-secondary)" }}>
                            {course.instructor}
                          </p>
                        </div>
                        <ProgressBar progress={course.progress || 0} />
                        <div className="d-flex justify-content-between" style={{ color: "var(--text-muted)", fontSize: "0.86rem" }}>
                          <span>{course.duration}</span>
                          <span>{course.progress || 0}% complete</span>
                        </div>
                        <div className="d-flex gap-2 mt-auto">
                          <Link to={`/player/${course._id}`} className="btn btn-primary-custom flex-grow-1 py-2">
                            {course.progress === 100 ? "Review Course" : course.progress > 0 ? "Continue" : "Start Course"}
                          </Link>
                          <Link to={`/course/${course._id}`} className="btn btn-outline-custom py-2">
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default MyCourses;
