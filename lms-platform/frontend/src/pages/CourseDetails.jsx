import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { useAuth } from "../context/AuthContext";
import { coursesAPI } from "../services/api";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const { data } = await coursesAPI.getById(id);
        setCourse(data);
      } catch {
        setError("Course not found.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setEnrolling(true);
    try {
      await coursesAPI.enroll(id);
      setEnrolled(true);
    } catch (err) {
      const msg = err.response?.data?.message || "";
      if (msg.includes("Already enrolled")) setEnrolled(true);
      else setError(msg || "Enrollment failed.");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) return <Spinner message="Loading course..." />;
  if (error && !course) return <div className="page-error">{error}</div>;
  if (!course) return null;

  const lessons = course.lessons || [];

  return (
    <div className="page-shell">
      <div className="container d-flex flex-column gap-4">
        <section className="hero-panel p-4 p-lg-5">
          <div className="row g-4 align-items-start">
            <div className="col-12 col-xl-8">
              <nav aria-label="breadcrumb" className="mb-4">
                <ol className="breadcrumb mb-0" style={{ background: "transparent", padding: 0 }}>
                  <li className="breadcrumb-item">
                    <Link to="/" style={{ color: "var(--primary)", fontWeight: 700 }}>
                      Catalog
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" style={{ color: "var(--text-muted)" }}>
                    {course.category}
                  </li>
                </ol>
              </nav>

              <span className="eyebrow mb-4">{course.category}</span>
              <h1 className="section-heading mb-3" style={{ fontSize: "clamp(2rem, 4.2vw, 3.6rem)" }}>
                {course.title}
              </h1>
              <p className="section-copy mb-4" style={{ fontSize: "1rem", lineHeight: 1.8 }}>
                {course.description}
              </p>

              <div className="d-flex flex-wrap gap-3 mb-4">
                {[
                  { icon: "bi-person", value: course.instructor },
                  { icon: "bi-clock-history", value: course.duration },
                  { icon: "bi-collection-play", value: `${lessons.length} lessons` },
                  { icon: "bi-bar-chart-line", value: course.level },
                  { icon: "bi-people", value: `${course.enrolledCount?.toLocaleString() || 0} learners` },
                ].map((item) => (
                  <div key={item.value} className="surface-card px-3 py-2 d-inline-flex align-items-center gap-2" style={{ boxShadow: "none" }}>
                    <i className={`bi ${item.icon}`} style={{ color: "var(--primary)" }} />
                    <span style={{ color: "var(--text-secondary)" }}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex align-items-center gap-3">
                <div className="d-inline-flex align-items-center gap-2 surface-card px-3 py-2" style={{ boxShadow: "none" }}>
                  <i className="bi bi-star-fill" style={{ color: "var(--warning)" }} />
                  <span className="fw-bold">{(course.rating || 4.5).toFixed(1)}</span>
                </div>
                <div style={{ color: "var(--text-secondary)" }}>
                  Built for practical progress, with structured lessons and tracked completion.
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="card border-0" style={{ borderRadius: 24, overflow: "hidden" }}>
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800"}
                  alt={course.title}
                  className="w-100"
                  style={{ height: 220, objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800";
                  }}
                />
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }}>
                        Pricing
                      </div>
                      <div className="fw-bold" style={{ color: "var(--accent)", fontSize: "2rem" }}>
                        Free
                      </div>
                    </div>
                    <div className="surface-card px-3 py-2" style={{ boxShadow: "none", color: "var(--text-secondary)" }}>
                      {course.level}
                    </div>
                  </div>

                  {enrolled ? (
                    <button className="btn btn-primary-custom w-100 py-3 mb-3" onClick={() => navigate(`/player/${id}`)}>
                      Start Learning
                    </button>
                  ) : (
                    <button className="btn btn-primary-custom w-100 py-3 mb-3" onClick={handleEnroll} disabled={enrolling}>
                      {enrolling ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Enrolling...
                        </>
                      ) : (
                        "Enroll Free"
                      )}
                    </button>
                  )}

                  {error && <div className="alert alert-danger py-2 small">{error}</div>}

                  <div className="d-grid gap-2">
                    {[
                      "Structured lessons with clear milestones",
                      "Progress tracking across every module",
                      "Lifetime access to course content",
                      "Completion certificate for finished courses",
                    ].map((feature) => (
                      <div key={feature} className="feature-item py-3">
                        <div className="feature-icon">
                          <i className="bi bi-check2" />
                        </div>
                        <div style={{ color: "var(--text-secondary)" }}>{feature}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="glass-panel p-4 p-lg-5">
          <div className="d-flex flex-wrap gap-2 mb-4">
            {["overview", "lessons", "instructor"].map((tab) => (
              <button key={tab} className={`filter-chip ${activeTab === tab ? "is-active" : ""}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {activeTab === "overview" && (
            <div>
              <h3 className="section-heading mb-3" style={{ fontSize: "1.6rem" }}>
                What you will build
              </h3>
              <div className="row g-3">
                {lessons.slice(0, 6).map((lesson) => (
                  <div key={lesson.title} className="col-12 col-md-6">
                    <div className="feature-item h-100">
                      <div className="feature-icon">
                        <i className="bi bi-check2-circle" />
                      </div>
                      <div style={{ color: "var(--text-secondary)" }}>{lesson.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "lessons" && (
            <div>
              <h3 className="section-heading mb-3" style={{ fontSize: "1.6rem" }}>
                Course content
              </h3>
              <div className="d-flex flex-column gap-3">
                {lessons.map((lesson, index) => (
                  <div key={lesson.title} className="dashboard-card d-flex align-items-center gap-3">
                    <div
                      className="d-inline-flex align-items-center justify-content-center"
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 14,
                        background: "rgba(96,165,250,0.12)",
                        color: "var(--primary)",
                        fontWeight: 800,
                        flexShrink: 0,
                      }}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-grow-1">
                      <div className="fw-bold" style={{ color: "var(--text)" }}>
                        {lesson.title}
                      </div>
                      <div style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>{lesson.duration}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "instructor" && (
            <div className="dashboard-card">
              <div className="d-flex flex-column flex-md-row gap-4 align-items-start">
                <div
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 28,
                    background: "linear-gradient(135deg, var(--primary), var(--accent))",
                    display: "grid",
                    placeItems: "center",
                    color: "#08101f",
                    fontWeight: 800,
                    fontSize: "1.75rem",
                    flexShrink: 0,
                  }}
                >
                  {course.instructor?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="fw-bold mb-1">{course.instructor}</h3>
                  <div style={{ color: "var(--primary)", fontWeight: 700 }} className="mb-3">
                    Senior educator and working engineer
                  </div>
                  <p className="section-copy mb-3">
                    This instructor focuses on practical explanations, project-based teaching, and real implementation detail across {course.category.toLowerCase()}.
                  </p>
                  <div className="d-flex flex-wrap gap-3" style={{ color: "var(--text-secondary)" }}>
                    <span className="surface-card px-3 py-2" style={{ boxShadow: "none" }}>
                      <i className="bi bi-star-fill me-2" style={{ color: "var(--warning)" }} />
                      {(course.rating || 4.5).toFixed(1)} rating
                    </span>
                    <span className="surface-card px-3 py-2" style={{ boxShadow: "none" }}>
                      <i className="bi bi-people me-2" style={{ color: "var(--primary)" }} />
                      {course.enrolledCount?.toLocaleString() || 0} learners
                    </span>
                    <span className="surface-card px-3 py-2" style={{ boxShadow: "none" }}>
                      <i className="bi bi-collection-play me-2" style={{ color: "var(--accent)" }} />
                      1 published course
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CourseDetails;
