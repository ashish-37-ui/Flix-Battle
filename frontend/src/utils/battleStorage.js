export const getBattleData = (battleIndex) => {
  const stored = localStorage.getItem(`battle_${battleIndex}`);
  return stored ? JSON.parse(stored) : null;
};

export const saveBattleData = (battleIndex, data) => {
  localStorage.setItem(`battle_${battleIndex}`, JSON.stringify(data));
};



