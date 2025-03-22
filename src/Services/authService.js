const authService = {
    login: async (email, password) => {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {
          throw new Error('Login failed');
        }
  
        return response.json();
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
  };
  
  export default authService;
  