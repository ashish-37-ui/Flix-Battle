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
      {hasVoted && (
        <div style={{ marginTop: "30px" }}>
          <h3>Why did you choose this?</h3>

          <textarea
            value={opinionText}
            onChange={(e) => setOpinionText(e.target.value)}
            rows={3}
            placeholder="Share your thoughts (optional)"
            style={{ width: "100%", padding: "10px" }}
          />

          <button style={{ marginTop: "10px" }} onClick={onSubmit}>
            Submit Opinion
          </button>
        </div>
      )}

      {opinions.length > 0 && (
        <div style={{ marginTop: "30px" }}>
          <button onClick={toggleOpinions}>
            {showOpinions
              ? "Hide opinions"
              : `View opinions (${opinions.length})`}
          </button>
        </div>
      )}

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

      {showOpinions &&
        opinions.map((op) => (
          <div
            key={op.id}
            style={{
              borderBottom: "1px solid #334155",
              padding: "10px 0",
            }}
          >
            <strong>{op.option}</strong>

            <p style={{ marginTop: "5px" }}>{op.text}</p>

            <div style={{ marginTop: "6px", fontSize: "14px" }}>
              👍 {(op.likes || []).length}

              {op.userId !== userId &&
                !(op.likes || []).includes(userId) && (
                  <button
                    style={{ marginLeft: "10px" }}
                    onClick={() => likeOpinion(op.id)}
                  >
                    Like
                  </button>
                )}
            </div>
          </div>
        ))}
    </>
  );
}

export default OpinionSection;
