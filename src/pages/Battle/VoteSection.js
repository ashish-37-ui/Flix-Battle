function VoteSection({ optionA, optionB, hasVoted, onVoteA, onVoteB }) {
  return (
    <div className="vote-buttons">
      <button
        disabled={hasVoted}
        title={hasVoted ? "You have already voted" : ""}
        onClick={onVoteA}
      >
        Vote {optionA}
      </button>

      <button
        disabled={hasVoted}
        title={hasVoted ? "You have already voted" : ""}
        onClick={onVoteB}
      >
        Vote {optionB}
      </button>
      {hasVoted && (
        <p style={{ marginTop: "10px", color: "#22c55e", fontSize: "14px" }}>
          ✅ Vote recorded
        </p>
      )}
    </div>
  );
}

export default VoteSection;
