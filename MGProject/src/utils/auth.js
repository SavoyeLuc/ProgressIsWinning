// Authentication utility functions

// Store the auth token in session storage
export const setAuthToken = (token) => {
  if (token) {
    sessionStorage.setItem('authToken', token);
  } else {
    sessionStorage.removeItem('authToken');
  }
};

// Get the auth token from session storage
export const getAuthToken = () => {
  return sessionStorage.getItem('authToken');
};

// Store user data in session storage
export const setUserData = (userData) => {
  if (userData) {
    sessionStorage.setItem('userData', JSON.stringify(userData));
  } else {
    sessionStorage.removeItem('userData');
  }
};

// Get user data from session storage
export const getUserData = () => {
  const userData = sessionStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// Logout user
export const logout = () => {
  sessionStorage.removeItem('authToken');
  sessionStorage.removeItem('userData');
}; 