function VoteSection({
  optionA,
  optionB,
  hasVoted,
  onVoteA,
  onVoteB,
}) {
  return (
    <div className="vote-buttons">
      <button disabled={hasVoted} onClick={onVoteA}>
        Vote {optionA}
      </button>
      <button disabled={hasVoted} onClick={onVoteB}>
        Vote {optionB}
      </button>
    </div>
  );
}

export default VoteSection;
