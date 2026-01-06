import { getAllBattleStats } from "./trends";
import battleDataMap from "../data/battleData";

export function getPopularBattles(limit = 4) {
  const stats = getAllBattleStats();

  return stats
    .filter((b) => b.totalVotes > 0)
    .sort((a, b) => b.totalVotes - a.totalVotes)
    .slice(0, limit)
    .map((b) => {
      const data =
        battleDataMap[b.type] || battleDataMap.movies;

      return {
        ...data[b.index],
        type: b.type,
        index: b.index,
        totalVotes: b.totalVotes,
      };
    });
}

export function getRecentBattles(limit = 4) {
  const raw = JSON.parse(localStorage.getItem("customBattles")) || [];

  return raw
    .slice()
    .reverse() // newest first
    .slice(0, limit);
}
