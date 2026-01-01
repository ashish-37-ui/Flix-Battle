function OpinionSection({
  hasVoted,
  opinionText,
  setOpinionText,
  onSubmit,
  opinions,
  showOpinions,
  toggleOpinions,
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

      {showOpinions && (
        <div style={{ marginTop: "20px" }}>
          {opinions.map((op, index) => (
            <div
              key={index}
              style={{
                borderBottom: "1px solid #334155",
                padding: "10px 0",
              }}
            >
              <strong>{op.option}</strong>
              <p>{op.text}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default OpinionSection;
