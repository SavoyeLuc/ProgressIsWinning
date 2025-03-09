// API utility for making authenticated requests

const API_URL = 'http://localhost:5001/';

// Function to get the auth token from sessionStorage
export const getToken = () => sessionStorage.getItem('token');

// Function to make authenticated API requests
export const apiRequest = async (endpoint, options = {}) => {
  // Get the token
  const token = getToken();
  
  // Set up headers with authentication
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Add token to headers if available
  if (token) {
    headers['x-auth-token'] = token;
  }
  
  // Make the request
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers
  });
  
  // Parse the JSON response
  const data = await response.json();
  
  // If response is not ok, throw an error
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
}; 