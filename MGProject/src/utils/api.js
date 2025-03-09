import { getAuthToken } from './auth';

// API base URL
const API_URL = 'http://localhost:5000/api';

// Generic API request function that includes auth token
export const apiRequest = async (endpoint, options = {}) => {
  // Get the auth token
  const token = getAuthToken();
  
  // Set up headers with auth token
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  // Add auth token to headers if available
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
  
  // Handle error responses
  if (response.status !== 200 && response.status !== 201) {
    throw new Error(data.message || 'API request failed');
  }
  
  return data;
};

// Example API functions
export const getPosts = () => {
  return apiRequest('/feed/posts');
};

export const createPost = (postData) => {
  return apiRequest('/posts', {
    method: 'POST',
    body: JSON.stringify(postData)
  });
};

export const likePost = (postId) => {
  return apiRequest(`/feed/likes`, {
    method: 'POST',
    body: JSON.stringify({
      entityType: 'POST',
      entityID: postId
    })
  });
}; 