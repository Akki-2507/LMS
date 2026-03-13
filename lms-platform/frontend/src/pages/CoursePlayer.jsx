import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import Spinner from "../components/Spinner";
import { coursesAPI } from "../services/api";

const CoursePlayer = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeLesson, setActiveLesson] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progress, setProgress] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const { data } = await coursesAPI.getById(id);
        setCourse(data);
      } catch {
        console.error("Failed to load course.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id]);

  const handleCompleteLesson = async () => {
    if (completedLessons.includes(activeLesson)) return;
    try {
      const { data } = await coursesAPI.updateProgress(id, activeLesson);
      setCompletedLessons(data.completedLessons);
      setProgress(data.progress);
    } catch {
      const updated = [...completedLessons, activeLesson];
      setCompletedLessons(updated);
      setProgress(Math.round((updated.length / (course?.lessons?.length || 1)) * 100));
    }
  };

  if (loading) return <Spinner message="Loading player..." />;
  if (!course) return <div className="page-error">Course not found.</div>;

  const total = course.lessons?.length || 0;
  const current = course.lessons?.[activeLesson];
  const isCompleted = completedLessons.includes(activeLesson);

  return (
    <div className="player-shell">
      <div className="d-flex align-items-center gap-3 px-3 px-lg-4 py-3" style={{ borderBottom: "1px solid var(--border)", background: "rgba(8,16,31,0.82)", backdropFilter: "blur(16px)" }}>
        <Link to="/my-courses" className="btn btn-outline-custom btn-sm px-3 py-2">
          Back to Learning
        </Link>
        <div className="flex-grow-1" style={{ minWidth: 0 }}>
          <div className="fw-bold text-truncate">{course.title}</div>
          <div style={{ color: "var(--text-muted)", fontSize: "0.84rem" }}>
            Lesson {activeLesson + 1} of {total}
          </div>
        </div>
        <div style={{ width: 180 }} className="d-none d-md-block">
          <ProgressBar progress={progress} showLabel={false} />
        </div>
        <div className="surface-card px-3 py-2 d-none d-md-block" style={{ boxShadow: "none", color: "var(--text-secondary)" }}>
          {progress}% complete
        </div>
      </div>

      <div className="d-flex flex-column flex-lg-row flex-grow-1 position-relative">
        <div className="flex-grow-1 d-flex flex-column" style={{ minWidth: 0 }}>
          <div className="glass-panel m-3 m-lg-4 p-0 overflow-hidden">
            <div
              style={{
                aspectRatio: "16 / 9",
                background: "radial-gradient(circle at top right, rgba(45,212,191,0.14), transparent 24%), linear-gradient(135deg, #08101f 0%, #0f172a 55%, #18223d 100%)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <div className="text-center px-4">
                <button
                  className="btn"
                  onClick={handleCompleteLesson}
                  style={{
                    width: 84,
                    height: 84,
                    borderRadius: 28,
                    background: "linear-gradient(135deg, rgba(96,165,250,0.22), rgba(45,212,191,0.22))",
                    border: "1px solid rgba(96,165,250,0.26)",
                    color: "var(--text)",
                    fontSize: "1.65rem",
                    marginBottom: 20,
                  }}
                >
                  <i className="bi bi-play-fill" />
                </button>
                <h2 className="fw-bold mb-2">{current?.title}</h2>
                <p className="mb-0" style={{ color: "var(--text-secondary)" }}>
                  {current?.duration} lesson runtime
                </p>
              </div>
            </div>
          </div>

          <div className="px-3 px-lg-4 pb-4">
            <div className="glass-panel p-4">
              <div className="d-flex flex-column flex-md-row align-items-md-start justify-content-between gap-3 mb-4">
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.12em", fontWeight: 700 }} className="mb-2">
                    Current lesson
                  </div>
                  <h3 className="fw-bold mb-1">{current?.title}</h3>
                  <div style={{ color: "var(--text-secondary)" }}>
                    {course.instructor} · {current?.duration}
                  </div>
                </div>
                <button className={`btn ${isCompleted ? "btn-outline-custom" : "btn-primary-custom"} px-4 py-2`} onClick={handleCompleteLesson} disabled={isCompleted}>
                  {isCompleted ? "Completed" : "Mark Complete"}
                </button>
              </div>

              <div className="d-flex flex-wrap align-items-center gap-2 gap-md-3">
                <button className="btn btn-outline-custom btn-sm px-3 py-2" onClick={() => setActiveLesson((prev) => prev - 1)} disabled={activeLesson === 0}>
                  Previous
                </button>
                <button className="btn btn-outline-custom btn-sm px-3 py-2" onClick={() => setActiveLesson((prev) => prev + 1)} disabled={activeLesson === total - 1}>
                  Next
                </button>
                <div style={{ color: "var(--text-muted)" }}>
                  Step {activeLesson + 1} / {total}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setSidebarOpen((prev) => !prev)}
          className="btn btn-outline-custom position-absolute d-none d-lg-inline-flex"
          style={{ right: sidebarOpen ? 332 : 12, top: "50%", transform: "translateY(-50%)", zIndex: 2, borderRadius: 999 }}
        >
          <i className={`bi bi-chevron-${sidebarOpen ? "right" : "left"}`} />
        </button>

        {sidebarOpen && (
          <aside
            style={{
              width: 320,
              maxWidth: "100%",
              borderLeft: "1px solid var(--border)",
              background: "rgba(8,16,31,0.78)",
              backdropFilter: "blur(16px)",
            }}
            className="p-3"
          >
            <div className="glass-panel p-3 h-100">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div>
                  <div className="fw-bold">Course content</div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                    {completedLessons.length} of {total} complete
                  </div>
                </div>
                <div className="surface-card px-2 py-1" style={{ boxShadow: "none", color: "var(--text-secondary)" }}>
                  {progress}%
                </div>
              </div>
              <div className="d-flex flex-column gap-2" style={{ maxHeight: "calc(100vh - 220px)", overflowY: "auto" }}>
                {course.lessons?.map((lesson, index) => {
                  const lessonDone = completedLessons.includes(index);
                  const lessonActive = activeLesson === index;

                  return (
                    <button
                      key={lesson.title}
                      onClick={() => setActiveLesson(index)}
                      className="text-start"
                      style={{
                        border: lessonActive ? "1px solid rgba(96,165,250,0.35)" : "1px solid var(--border)",
                        background: lessonActive ? "rgba(96,165,250,0.1)" : "rgba(12,20,36,0.58)",
                        borderRadius: 18,
                        padding: 14,
                        color: "inherit",
                      }}
                    >
                      <div className="d-flex align-items-start gap-3">
                        <div
                          style={{
                            width: 34,
                            height: 34,
                            borderRadius: 12,
                            display: "grid",
                            placeItems: "center",
                            background: lessonDone ? "rgba(45,212,191,0.14)" : "rgba(148,163,184,0.12)",
                            color: lessonDone ? "var(--accent)" : "var(--text-secondary)",
                            flexShrink: 0,
                            fontWeight: 800,
                          }}
                        >
                          {lessonDone ? <i className="bi bi-check2" /> : index + 1}
                        </div>
                        <div className="flex-grow-1" style={{ minWidth: 0 }}>
                          <div className="fw-bold text-truncate" style={{ color: lessonActive ? "var(--text)" : "var(--text-secondary)" }}>
                            {lesson.title}
                          </div>
                          <div style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{lesson.duration}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default CoursePlayer;
