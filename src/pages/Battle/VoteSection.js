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
    </div>
  );
}

export default VoteSection;
