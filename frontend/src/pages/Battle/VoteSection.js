
function VoteSection({
  optionA,
  optionB,
  posterA,
  posterB,
  hasVoted,
  userVote,
  onVoteA,
  onVoteB,
}) {
  return (
    <div className="vote-container">

      {/* OPTION A */}
      <div
        className={`vote-card ${
          hasVoted && userVote === "A" ? "selected" : ""
        }`}
        onClick={!hasVoted ? onVoteA : undefined}
      >

        {posterA ? (
          <img src={posterA} alt={optionA} className="battle-poster" />
        ) : (
          <div className="poster-fallback">{optionA}</div>
        )}

        <div className="vote-label">
          {optionA}
        </div>

        {hasVoted && userVote === "A" && (
          <div className="vote-badge">✔ Voted</div>
        )}

      </div>

      {/* VS TEXT */}
      <div className="vs-text">VS</div>

      {/* OPTION B */}
      <div
        className={`vote-card ${
          hasVoted && userVote === "B" ? "selected" : ""
        }`}
        onClick={!hasVoted ? onVoteB : undefined}
      >

        {posterB ? (
          <img src={posterB} alt={optionB} className="battle-poster" />
        ) : (
          <div className="poster-fallback">{optionB}</div>
        )}

        <div className="vote-label">
          {optionB}
        </div>

        {hasVoted && userVote === "B" && (
          <div className="vote-badge">✔ Voted</div>
        )}

      </div>

      {/* CONFIRMATION */}
      {hasVoted && (
        <p className="vote-confirmation">
          ✅ You voted for{" "}
          <strong>{userVote === "A" ? optionA : optionB}</strong>
        </p>
      )}

    </div>
  );
}

export default VoteSection;

