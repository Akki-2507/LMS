import React from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ course }) => {
  const { _id, title, description, instructor, duration, category, level, thumbnail, rating, enrolledCount } = course;

  const catColors = {
    "Programming Language": { bg: "rgba(124,111,255,0.12)", color: "#7c6fff", border: "rgba(124,111,255,0.25)" },
    "Web Development":      { bg: "rgba(56,189,248,0.12)",  color: "#38bdf8", border: "rgba(56,189,248,0.25)" },
    "Backend Development":  { bg: "rgba(0,229,176,0.12)",   color: "#00e5b0", border: "rgba(0,229,176,0.25)" },
    "Data Science":         { bg: "rgba(255,209,102,0.12)", color: "#ffd166", border: "rgba(255,209,102,0.25)" },
  };

  const lvlColors = {
    Beginner:     { bg: "rgba(0,229,176,0.12)",   color: "#00e5b0" },
    Intermediate: { bg: "rgba(255,209,102,0.12)", color: "#ffd166" },
    Advanced:     { bg: "rgba(255,107,157,0.12)", color: "#ff6b9d" },
  };

  const c = catColors[category] || catColors["Web Development"];
  const l = lvlColors[level] || lvlColors["Beginner"];
  const stars = Math.floor(rating || 4.5);

  return (
    <div className="glow-card h-100 d-flex flex-column" style={{ overflow: "hidden" }}>
      <div style={{ position: "relative", height: 185, overflow: "hidden", borderRadius: "16px 16px 0 0" }}>
        <img
          src={thumbnail || "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400"}
          alt={title}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
          onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400"; }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(7,7,15,0.7) 0%, transparent 50%)"
        }} />
        <span style={{
          position: "absolute", top: 12, right: 12,
          padding: "3px 10px", borderRadius: 50,
          fontSize: "0.72rem", fontWeight: 700,
          background: l.bg, color: l.color,
          border: `1px solid ${l.color}40`,
          backdropFilter: "blur(8px)"
        }}>{level}</span>
      </div>

      <div style={{ padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
        <span style={{
          alignSelf: "flex-start", padding: "3px 10px", borderRadius: 50,
          fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
          background: c.bg, color: c.color, border: `1px solid ${c.border}`
        }}>{category}</span>

        <h5 style={{ fontWeight: 700, color: "#f0f0ff", lineHeight: 1.4, fontSize: "0.97rem", margin: 0 }}>
          {title}
        </h5>

        <p style={{ fontSize: "0.83rem", color: "#9090b8", lineHeight: 1.65, margin: 0, flex: 1 }}>
          {description?.length > 90 ? description.slice(0, 90) + "..." : description}
        </p>

        <div className="d-flex gap-3 flex-wrap">
          <span style={{ fontSize: "0.8rem", color: "#55557a", display: "flex", alignItems: "center", gap: 5 }}>
            <i className="bi bi-person-circle" style={{ color: "#7c6fff" }}></i>{instructor}
          </span>
          <span style={{ fontSize: "0.8rem", color: "#55557a", display: "flex", alignItems: "center", gap: 5 }}>
            <i className="bi bi-clock" style={{ color: "#7c6fff" }}></i>{duration}
          </span>
        </div>

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          paddingTop: 12, borderTop: "1px solid #1e1e3a", marginTop: "auto"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ color: "#ffd166", fontSize: "0.85rem" }}>{"★".repeat(stars)}</span>
            <span style={{ fontWeight: 700, fontSize: "0.82rem", color: "#f0f0ff" }}>
              {(rating || 4.5).toFixed(1)}
            </span>
            <span style={{ fontSize: "0.78rem", color: "#55557a" }}>
              ({(enrolledCount || 0).toLocaleString()})
            </span>
          </div>
          <Link to={`/course/${_id}`} style={{
            padding: "6px 16px",
            background: "linear-gradient(135deg, #7c6fff, #6357e8)",
            color: "white", borderRadius: 8, fontSize: "0.82rem", fontWeight: 700,
            boxShadow: "0 2px 12px rgba(124,111,255,0.35)"
          }}>
            View →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;