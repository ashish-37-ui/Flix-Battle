import data from "../data/data";
import { getBattleData } from "../utils/battleStorage";

function Trends() {
  const battlesWithStats = data.map((battle, index) => {
    const stored = getBattleData(index) || {
      votesA: 0,
      votesB: 0,
      opinions: [],
    };

    const totalVotes = stored.votesA + stored.votesB;
    const totalLikes = stored.opinions.reduce(
      (sum, op) => sum + (op.likes ? op.likes.length : 0),
      0
    );

    return {
      title: battle.title,
      winner:
        stored.votesA > stored.votesB
          ? battle.optionA
          : battle.optionB,
      score: totalVotes + totalLikes,
      totalVotes,
      totalLikes,
    };
  });

  const sorted = [...battlesWithStats].sort(
    (a, b) => b.score - a.score
  );

  return (
    <div style={{ padding: "30px" }}>
      <h1>🔥 Trending Battles</h1>

      {sorted.map((b, i) => (
        <div
          key={i}
          style={{
            marginTop: "16px",
            padding: "12px",
            borderBottom: "1px solid #334155",
          }}
        >
          <strong>{b.title}</strong>
          <div style={{ fontSize: "14px", marginTop: "4px" }}>
            🏆 Winner: {b.winner}
          </div>
          <div style={{ fontSize: "13px", marginTop: "2px" }}>
            Votes: {b.totalVotes} · Likes: {b.totalLikes}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Trends;
