const authService = {
  login: async ({ email, password }) => {
    try {
      console.log("Attempting login with:", email, password);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Server response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data;
    } catch (error) {
      console.error("Error in authService.login:", error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      console.log("Attempting registration with:", userData);

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      console.log("Registration response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    } catch (error) {
      console.error("Error in authService.register:", error);
      throw error;
    }
  },
};

export default authService;
