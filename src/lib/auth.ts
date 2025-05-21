
// Simple frontend-only authentication
// In a real application, this should be replaced with a proper backend authentication system

interface Admin {
  username: string;
  password: string;
}

const ADMIN_USER: Admin = {
  username: "admin",
  password: "password123" // This is not secure, just for demo purposes
};

export const login = (username: string, password: string): boolean => {
  if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
    localStorage.setItem('isAuthenticated', 'true');
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem('isAuthenticated');
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

