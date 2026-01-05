export function getAllBattleStats() {
  const stats = [];

  Object.keys(localStorage).forEach((key) => {
    if (!key.includes("-")) return;

    try {
      const data = JSON.parse(localStorage.getItem(key));
      if (!data) return;

      const [type, index] = key.split("-");

      stats.push({
        type,
        index: Number(index),
        totalVotes: (data.votesA || 0) + (data.votesB || 0),
        opinions: data.opinions || [],
      });
    } catch (e) {
      // ignore invalid data
    }
  });

  return stats;
}
