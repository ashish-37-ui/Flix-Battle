function ResultsSection({
  optionA,
  optionB,
  votesA,
  votesB,
  percentA,
  percentB,
}) {
  const winner =
    votesA === votesB ? null : votesA > votesB ? "A" : "B";

  return (
    <div className="results">
      <strong>Live Results</strong>

      <div className={`progress-row ${winner === "A" ? "winner" : ""}`}>
        <div className="progress-label">
          {optionA}: {percentA}% ({votesA} votes)
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentA}%` }}
          />
        </div>
      </div>

      <div className={`progress-row ${winner === "B" ? "winner" : ""}`}>
        <div className="progress-label">
          {optionB}: {percentB}% ({votesB} votes)
        </div>
        <div className="progress-bar-bg">
          <div
            className="progress-bar-fill"
            style={{ width: `${percentB}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default ResultsSection;
