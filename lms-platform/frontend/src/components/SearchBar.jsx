import React from "react";

const SearchBar = ({ search, setSearch, category, setCategory, level, setLevel }) => {
  const categories = ["All", "Programming Language", "Web Development", "Backend Development", "Data Science"];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  return (
    <div className="search-panel">
      <div className="row g-4 align-items-end">
        <div className="col-12 col-lg-5">
          <label className="form-label small fw-bold text-uppercase mb-2" style={{ color: "var(--text-muted)", letterSpacing: "0.12em" }}>
            Search
          </label>
          <div className="input-group">
            <span className="input-group-text border-end-0">
              <i className="bi bi-search" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 border-end-0"
              placeholder="Search by course, skill, or instructor"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="btn btn-outline-custom border-start-0" onClick={() => setSearch("")}>
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <div className="row g-3">
            <div className="col-12">
              <label className="form-label small fw-bold text-uppercase mb-2" style={{ color: "var(--text-muted)", letterSpacing: "0.12em" }}>
                Category
              </label>
              <div className="d-flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button key={cat} className={`filter-chip ${category === cat ? "is-active" : ""}`} onClick={() => setCategory(cat)}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-12">
              <label className="form-label small fw-bold text-uppercase mb-2" style={{ color: "var(--text-muted)", letterSpacing: "0.12em" }}>
                Level
              </label>
              <div className="d-flex flex-wrap gap-2">
                {levels.map((lv) => (
                  <button key={lv} className={`filter-chip ${level === lv ? "is-active" : ""}`} onClick={() => setLevel(lv)}>
                    {lv}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
