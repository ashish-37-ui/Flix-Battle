import { useState } from "react";
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
  submitReply,
}) {
  const [sortType, setSortType] = useState("top");
  const [openReplies, setOpenReplies] = useState({});

  

  const toggleReplies = (opinionId) => {
    setOpenReplies((prev) => ({
      ...prev,
      [opinionId]: !prev[opinionId],
    }));
  };

  const otherOpinions = topOpinion
    ? opinions.filter((op) => op.id !== topOpinion.id)
    : opinions;

  const sortedOpinions = [...otherOpinions].sort((a, b) => {
    if (sortType === "top") {
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    }

    if (sortType === "new") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }

    if (sortType === "liked") {
      return (b.likes?.length || 0) - (a.likes?.length || 0);
    }

    return 0;
  });

  return (
    <div className="opinions-wrapper">
      {/* 🔥 TOP OPINION */}
      {/* 🔥 TOP OPINION */}
{topOpinion && (
  <div className="opinion-card">

    {/* HEADER */}
    <div className="opinion-header">

      <div className="avatar">👤</div>

      <div className="opinion-user">
        <div className="username">{topOpinion.userId}</div>
        <div className="picked-option">picked {topOpinion.option}</div>
      </div>

    </div>

    {/* OPINION TEXT */}
    <div className="opinion-body">
      {topOpinion.text}
    </div>

    {/* ACTION BAR */}
    <div className="opinion-footer">

      <div className="likes">
        👍 {(topOpinion.likes || []).length}

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

      {topOpinion.replies && topOpinion.replies.length > 0 && (
        <div
          className="reply-toggle"
          onClick={() => toggleReplies(topOpinion.id)}
        >
          {openReplies[topOpinion.id]
            ? "▲ Hide replies"
            : `▼ See ${topOpinion.replies.length} replies`}
        </div>
      )}

    </div>

    {/* REPLIES */}
    {openReplies[topOpinion.id] && topOpinion.replies && (
      <div className="reply-list">

        {topOpinion.replies.map((reply) => (
          <div key={reply.id} className="reply-item">

            <div className="avatar small">👤</div>

            <div className="reply-content">
              <strong>{reply.userId}</strong>
              <p>{reply.text}</p>
            </div>

          </div>
        ))}

      </div>
    )}

    {/* REPLY INPUT */}
    <div className="reply-box">

      <input
        placeholder="Write a reply..."
        value={replyText?.[topOpinion.id] || ""}
        onChange={(e) =>
          setReplyText((prev) => ({
            ...prev,
            [topOpinion.id]: e.target.value,
          }))
        }
      />

      <button onClick={() => submitReply(topOpinion.id)}>
        Reply
      </button>

    </div>

  </div>
)}

      {/* WRITE OPINION */}
      {hasVoted && userId && (
        <div className="opinion-card write-card">
          <h3 className="opinion-title">💬 Share your reasoning</h3>

          <textarea
            value={opinionText}
            onChange={(e) => setOpinionText(e.target.value)}
            rows={3}
            placeholder="Why did you choose this option?"
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

      {/* TOGGLE */}
      {otherOpinions.length > 0 && (
        <div className="opinions-toggle">
          <button onClick={toggleOpinions}>
            {showOpinions
              ? "⬆ Hide community opinions"
              : `⬇ View community opinions (${otherOpinions.length})`}
          </button>
        </div>
      )}

      {/* SORT */}
      <div className="opinion-sort">
        <span
          className={sortType === "top" ? "active" : ""}
          onClick={() => setSortType("top")}
        >
          🔥 Top
        </span>

        <span
          className={sortType === "new" ? "active" : ""}
          onClick={() => setSortType("new")}
        >
          🆕 Newest+
        </span>

        <span
          className={sortType === "liked" ? "active" : ""}
          onClick={() => setSortType("liked")}
        >
          👍 Most liked
        </span>
      </div>

      {/* COMMUNITY OPINIONS */}
      {showOpinions && (
        <div className="opinions-panel">
          {sortedOpinions.map((op) => (
            <div key={op.id} className="opinion-card">
              <div className="opinion-header">
                <div className="avatar">👤</div>

                <div className="user-info">
                  <strong>{op.userId}</strong>
                  <span className="picked-option">picked {op.option}</span>
                </div>
              </div>

              <div className="opinion-body">{op.text}</div>

              <div className="opinion-actions">
                <span>👍 {(op.likes || []).length}</span>

                {op.userId !== userId && !(op.likes || []).includes(userId) && (
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
                <>
                  <div
                    className="reply-toggle"
                    onClick={() => toggleReplies(op.id)}
                  >
                    {openReplies[op.id]
                      ? `▲ Hide replies`
                      : `▼ See ${op.replies.length} replies`}
                  </div>

                  {openReplies[op.id] && (
                    <div className="reply-list">
                      {op.replies.map((reply) => (
                        <div key={reply.id} className="reply-item">
                          <div className="avatar small">👤</div>

                          <div className="reply-content">
                            <strong>{reply.userId}</strong>
                            <p>{reply.text}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {/* Reply input */}
              <div className="reply-box">
                <input
                  placeholder="Write a reply..."
                  value={replyText?.[op.id] || ""}
                  onChange={(e) =>
                    setReplyText((prev) => ({
                      ...prev,
                      [op.id]: e.target.value,
                    }))
                  }
                />

                <button onClick={() => submitReply(op.id)}>Reply</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OpinionSection;
