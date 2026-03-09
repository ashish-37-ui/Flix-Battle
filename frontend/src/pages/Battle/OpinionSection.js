
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
  replyText,
  setReplyText,
  submitReply
}) {

  // remove the top opinion from the list so it doesn't show twice
  const otherOpinions = topOpinion
    ? opinions.filter((op) => op.id !== topOpinion.id)
    : opinions;

  return (
    <>
      <div className="opinions-wrapper">

        {/* 🔥 TOP OPINION */}
        {topOpinion && (
          <div className="opinion-card top-opinion">

            <div className="top-opinion-header">🔥 Top Opinion</div>

            <p className="opinion-text">{topOpinion.text}</p>

            <div className="opinion-meta">
              <span>👍 {(topOpinion.likes || []).length}</span>

              {topOpinion.userId !== userId &&
                !(topOpinion.likes || []).includes(userId) && (
                  <button
                    className="like-btn"
                    onClick={() => likeOpinion(topOpinion.id)}
                  >
                    Like
                  </button>
                )}
            </div>

            {/* Replies */}
            {topOpinion.replies && topOpinion.replies.length > 0 && (
              <div className="replies">
                {topOpinion.replies.map((reply) => (
                  <div key={reply.id} className="reply">
                    <strong>{reply.userId}</strong> {reply.text}
                  </div>
                ))}
              </div>
            )}

            {/* Reply box */}
            <div className="reply-box">
              <input
                placeholder="Write a reply..."
                value={replyText?.[topOpinion.id] || ""}
                onChange={(e) =>
                  setReplyText((prev) => ({
                    ...prev,
                    [topOpinion.id]: e.target.value
                  }))
                }
              />

              <button onClick={() => submitReply(topOpinion.id)}>
                Reply
              </button>
            </div>

          </div>
        )}

        {/* 🔒 Not logged in */}
        {hasVoted && !userId && (
          <p className="empty-state">🔒 Login to share your opinion.</p>
        )}

        {/* ✍️ Write opinion */}
        {hasVoted && userId && (
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

        {/* 👀 Toggle opinions */}
        {otherOpinions.length > 0 && (
          <div className="opinions-toggle">
            <button onClick={toggleOpinions}>
              {showOpinions
                ? "⬆ Hide community opinions"
                : `⬇ View community opinions (${otherOpinions.length})`}
            </button>
          </div>
        )}

        {/* 💬 COMMUNITY OPINIONS */}
        {showOpinions && (
          <div className="opinions-panel">

            <div className="opinions-header">💬 Community Opinions</div>

            <div className="opinions-list">
              {otherOpinions.map((op) => (
                <div key={op.id} className="opinion-item">

                  <div className="opinion-badge">
                    Picked {op.option}
                  </div>

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

                  {/* Replies */}
                  {op.replies && op.replies.length > 0 && (
                    <div className="replies">
                      {op.replies.map((reply) => (
                        <div key={reply.id} className="reply">
                          <strong>{reply.userId}</strong> {reply.text}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply input */}
                  <div className="reply-box">
                    <input
                      placeholder="Write a reply..."
                      value={replyText?.[op.id] || ""}
                      onChange={(e) =>
                        setReplyText((prev) => ({
                          ...prev,
                          [op.id]: e.target.value
                        }))
                      }
                    />

                    <button onClick={() => submitReply(op.id)}>
                      Reply
                    </button>
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </div>
    </>
  );
}

export default OpinionSection;

