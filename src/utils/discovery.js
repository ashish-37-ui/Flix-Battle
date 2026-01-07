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

export function getRecentBattles(limit = 5) {
  const raw = JSON.parse(localStorage.getItem("customBattles"));

  if (!raw || typeof raw !== "object") return [];

  const allBattles = [
    ...(Array.isArray(raw.movies) ? raw.movies : []),
    ...(Array.isArray(raw.tv) ? raw.tv : []),
    ...(Array.isArray(raw.actors) ? raw.actors : []),
    ...(Array.isArray(raw.singers) ? raw.singers : []),
  ];

  return allBattles
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, limit);
}

