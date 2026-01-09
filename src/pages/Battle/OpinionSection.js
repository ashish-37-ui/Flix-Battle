function OpinionSection({
  hasVoted,
  opinionText,
  setOpinionText,
  onSubmit,
  opinions,
  showOpinions,
  toggleOpinions,
  likeOpinion,
  userId,
  topOpinion,
}) {
  return (
    <>
      {/* ✍️ Write Opinion */}
      {hasVoted && (
        <div className="opinion-card">
          <h3>💬 Why did you choose this?</h3>

          <textarea
            value={opinionText}
            onChange={(e) => setOpinionText(e.target.value)}
            rows={3}
            placeholder="What made this better for you?"
            className="opinion-input"
          />

          <div className="opinion-actions">
            <button onClick={onSubmit} className="primary-btn">
              Submit Opinion
            </button>

            <button className="secondary-btn">✨ Share my thought</button>
          </div>
        </div>
      )}

      {/* 👀 View / Hide Opinions */}
      {opinions.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <button onClick={toggleOpinions}>
             {showOpinions ? "⬆ Hide opinions" : `⬇ View opinions (${opinions.length})`}

          </button>
        </div>
      )}

      {/* 🔥 TOP OPINION */}
      {topOpinion && (topOpinion.likes || []).length > 0 && (
        <div
          style={{
            marginTop: "20px",
            padding: "12px",
            border: "1px solid #22c55e",
            borderRadius: "6px",
            background: "#052e16",
          }}
        >
          <strong>🔥 Top Opinion</strong>
          <p style={{ marginTop: "6px" }}>{topOpinion.text}</p>
          <div style={{ fontSize: "14px", marginTop: "4px" }}>
            👍 {(topOpinion.likes || []).length}
          </div>
        </div>
      )}

      {/* 💬 Opinions List */}
      {showOpinions && (
  <div className="opinions-panel">
    <div className="opinions-header">
      💬 Community Opinions
    </div>

    <div className="opinions-list">
      {opinions.map((op) => (
        <div key={op.id} className="opinion-item">
          <strong>{op.option}</strong>
          <p>{op.text}</p>

          <div className="opinion-meta">
            👍 {(op.likes || []).length} likes

            {op.userId !== userId &&
              !(op.likes || []).includes(userId) && (
                <button
                  className="like-btn"
                  onClick={() => likeOpinion(op.id)}
                >
                  👍 Like
                </button>
              )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

    </>
  );
}

export default OpinionSection;
