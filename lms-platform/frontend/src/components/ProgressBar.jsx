import React from "react";

const ProgressBar = ({ progress = 0, showLabel = true }) => {
  const p = Math.min(100, Math.max(0, progress));
  const color = p >= 80 ? "var(--accent)" : p >= 40 ? "var(--warning)" : "var(--primary)";

  return (
    <div className="w-100">
      {showLabel && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small style={{ color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700 }}>
            Progress
          </small>
          <small className="fw-bold" style={{ color: "var(--text)" }}>
            {p}%
          </small>
        </div>
      )}
      <div className="progress" style={{ height: 10, background: "rgba(148,163,184,0.12)", borderRadius: 999 }}>
        <div
          className="progress-bar"
          role="progressbar"
          style={{
            width: `${p}%`,
            background: `linear-gradient(90deg, ${color}, ${color})`,
            borderRadius: 999,
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
          }}
          aria-valuenow={p}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {p === 100 && (
        <small className="mt-2 d-inline-flex align-items-center gap-2" style={{ color: "var(--accent)", fontWeight: 700 }}>
          <i className="bi bi-check-circle-fill" />
          Completed
        </small>
      )}
    </div>
  );
};

export default ProgressBar;
