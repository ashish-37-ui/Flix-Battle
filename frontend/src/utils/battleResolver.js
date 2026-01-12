import battleDataMap from "../data/battleData";

export function getBattleByTypeAndIndex(type, index) {
  // 🧩 Custom battles
  if (type === "custom") {
    const customBattles =
      JSON.parse(localStorage.getItem("customBattles")) || [];

    return customBattles[index] || null;
  }

  // 🧩 Predefined battles
  const data = battleDataMap[type] || battleDataMap.movies;
  return data[index] || null;
}
