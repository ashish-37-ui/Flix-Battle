import "./OpinionSection.css";

function OpinionSection({
  hasVoted,
  opinionText,
  currentUser,
  setOpinionText,
  onSubmit,
  opinions = [],
  showOpinions,
  toggleOpinions,
  likeOpinion,
  userId,
  topOpinion,
}) {
  return (
    <div className="opinions-wrapper">
      {topOpinion && (
        <div className="opinion-card top-opinion">
          <div className="top-opinion-header">🔥 Top Opinion</div>

          <p className="opinion-text">{topOpinion.text}</p>

          <div className="opinion-meta">👍 {topOpinion.likes.length} likes</div>
        </div>
      )}

      {/* ✍️ WRITE OPINION */}
      {/* 🔒 Not logged in */}
      {hasVoted && !userId && (
        <p className="empty-state">🔒 Login to share your opinion.</p>
      )}

      {/* ✍️ Write opinion (only when logged in + voted) */}
      {hasVoted && userId &&  (
        <div className="opinion-card write-card">
          <h3 className="opinion-title">💬 Why did you choose this?</h3>

          <textarea
            value={opinionText}
            onChange={(e) => setOpinionText(e.target.value)}
            rows={3}
            placeholder="Share your reasoning in a line or two…"
            className="opinion-input"
            maxLength={200}
          />

          <div className="opinion-actions">
            <button
              onClick={onSubmit}
              className="primary-btn"
              disabled={!opinionText.trim()}
            >
              Post Opinion
            </button>

            <span className="char-hint">{opinionText.length}/200</span>
          </div>
        </div>
      )}

      {/* 🔥 TOP OPINION */}
    

      {/* 👀 TOGGLE OPINIONS */}
      {opinions.length > 0 && (
        <div className="opinions-toggle">
          <button onClick={toggleOpinions}>
            {showOpinions
              ? "⬆ Hide community opinions"
              : `⬇ View community opinions (${opinions.length})`}
          </button>
        </div>
      )}

      {/* 💬 COMMUNITY OPINIONS */}
      {showOpinions && (
        <div className="opinions-panel">
          <div className="opinions-header">💬 Community Opinions</div>

          <div className="opinions-list">
            {opinions.map((op) => (
              <div key={op.id} className="opinion-item">
                <div className="opinion-badge">Picked {op.option}</div>

                <p className="opinion-text">{op.text}</p>

                <div className="opinion-meta">
                  <span>👍 {(op.likes || []).length}</span>

                  {op.userId !== userId &&
                    !(op.likes || []).includes(userId) && (
                      <button
                        className="like-btn"
                        onClick={() => likeOpinion(op.id)}
                      >
                        Like
                      </button>
                    )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default OpinionSection;
