const API_URL = "http://localhost:5000/api/auth";

export const authService = {
  isAuthenticated: () => {
    const token = localStorage.getItem("authToken");
    return token ? true : false;
  },

  login: async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },

  register: async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },
};

export default authService;
