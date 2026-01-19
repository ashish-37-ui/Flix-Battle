function VoteSection({
  optionA,
  optionB,
  hasVoted,
  userVote,
  onVoteA,
  onVoteB,
}) {
  return (
    <div className="vote-buttons">
      <button
        disabled={hasVoted}
        onClick={hasVoted ? undefined : onVoteA}
        className={hasVoted && userVote === "A" ? "voted" : ""}
      >
        {hasVoted && userVote === "A" ? "✔ Voted" : `Vote ${optionA}`}
      </button>

      <button
        disabled={hasVoted}
        onClick={hasVoted ? undefined : onVoteB}
        className={hasVoted && userVote === "B" ? "voted" : ""}
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
