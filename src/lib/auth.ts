
// Simple frontend-only authentication
// In a real application, this should be replaced with a proper backend authentication system

interface Admin {
  username: string;
  password: string;
}

const ADMIN_USER: Admin = {
  username: "gadasu",
  password: "gadasu1" // Updated admin credentials
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
