export function getBattleOfTheDay(battleData) {
  if (!battleData || battleData.length === 0) return null;

  const today = new Date().toDateString(); // stable per day
  let hash = 0;

  for (let i = 0; i < today.length; i++) {
    hash += today.charCodeAt(i);
  }

  const index = hash % battleData.length;
  return battleData[index];
}
