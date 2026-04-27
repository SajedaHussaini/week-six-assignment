export function login(username, password) {
  // Fake login - any user/pass accepted
  if (username && password) {
    const user = {
      username,
      name: username,
      avatar: "https://static.vecteezy.com/system/resources/thumbnails/050/426/948/small_2x/blue-circular-user-profile-icon-vector.jpg" // demo avatar

    };
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  }
  return null;
}

export function logout() {
  localStorage.removeItem("user");
}

export function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}
