function ResultsSection({
  optionA,
  optionB,
  votesA,
  votesB,
  percentA,
  percentB,
}) {
  return (
    <div className="results">
      <strong>Live Results</strong>

      <div className="progress-container">
        <div className="progress-row">
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

        <div className="progress-row">
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
    </div>
  );
}

export default ResultsSection;
