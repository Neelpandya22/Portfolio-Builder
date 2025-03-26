export const authService = {
  isAuthenticated: () => !!localStorage.getItem("token"),
  getUser: () => JSON.parse(localStorage.getItem("user") || "{}"),
};