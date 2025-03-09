import { getAuthToken } from './auth';

// API base URL
const API_URL = 'http://localhost:5000/api';

/**
 * Make an authenticated API request
 * @param {string} endpoint - API endpoint (without base URL)
 * @param {Object} options - Request options
 * @returns {Promise<any>} - Response data
 */
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
  
  // For GET requests, handle query parameters
  let url = `${API_URL}${endpoint}`;
  
  // Make the request
  const config = {
    method: options.method || 'GET',
    headers,
    ...options
  };
  
  // Don't include body for GET requests
  if (config.method === 'GET' && config.body) {
    delete config.body;
  }
  
  //console.log(`Making ${config.method} request to ${url}`, config);
  
  const response = await fetch(url, config);
  
  // Handle non-JSON responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();
    
    // Log response for debugging
   // console.log(`Response from ${url}:`, data);
    
    // Handle error responses
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(data.message || 'API request failed');
    }
    
    return data;
  } else {
    const text = await response.text();
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(text || 'API request failed');
    }
    return { success: true, message: text };
  }
};

// Convenience methods for common HTTP methods
export const get = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'GET' });
};

export const post = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, { 
    ...options, 
    method: 'POST',
    body: JSON.stringify(data)
  });
};

export const put = (endpoint, data, options = {}) => {
  return apiRequest(endpoint, { 
    ...options, 
    method: 'PUT',
    body: JSON.stringify(data)
  });
};

export const del = (endpoint, options = {}) => {
  return apiRequest(endpoint, { ...options, method: 'DELETE' });
};

// Example API functions using the convenience methods
export const getPosts = (page = 1, limit = 10, sortBy = 'recent') => {
  return get(`/feed/posts?page=${page}&limit=${limit}&sortBy=${sortBy}`);
};

export const createPost = (postData) => {
  return post('/feed/posts', postData);
};

export const likePost = (postId) => {
  return post('/feed/likes', {
    entityType: 'POST',
    entityID: postId
  });
};

export const addComment = (postId, commentText) => {
  return post('/feed/comments', {
    postID: postId,
    body: commentText
  });
};

export const getComments = (postId, page = 1, limit = 20, sortBy = 'recent') => {
  return get(`/feed/posts/comments?id=${postId}`);

};

// Add this to your existing API utility functions
export const login = (username, password) => {
  return post('/auth/login', { username, password });
};

export const register = (userData) => {
  return post('/auth/register', userData);
}; 