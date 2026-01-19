function VoteSection({ optionA, optionB, hasVoted, userVote, onVoteA, onVoteB }) {
  return (
    <div className="vote-buttons">
      <button
        className={`vote-btn ${
          hasVoted && userVote === "A" ? "voted" : ""
        }`}
        disabled={hasVoted}
        onClick={!hasVoted ? onVoteA : undefined}
      >
        {hasVoted && userVote === "A" ? "✔ Voted" : `Vote ${optionA}`}
      </button>

      <button
        className={`vote-btn ${
          hasVoted && userVote === "B" ? "voted" : ""
        }`}
        disabled={hasVoted}
        onClick={!hasVoted ? onVoteB : undefined}
      >
        {hasVoted && userVote === "B" ? "✔ Voted" : `Vote ${optionB}`}
      </button>

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
