const USER_KEY = "flixbattle_user";

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem(USER_KEY));
}

export function loginUser(username) {
  const user = {
    username,
    id: `user_${username.toLowerCase()}`,
  };

  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function logoutUser() {
  localStorage.removeItem(USER_KEY);
}
