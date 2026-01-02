export const getUserId = () => {
  let userId = localStorage.getItem("flixbattle_user_id");

  if (!userId) {
    userId = `user_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("flixbattle_user_id", userId);
  }

  return userId;
};
