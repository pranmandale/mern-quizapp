// src/api/userService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL/users;


// Register a new user
export const registerUser = (userData) => axios.post(`${API_BASE_URL}/register`, userData, { withCredentials: true });

// Log in an existing user
export const loginUser = (credentials) => axios.post(`${API_BASE_URL}/login`, credentials, { withCredentials: true });

// Log out the current user
export const logoutUser = () => axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });

// Refresh the access token
export const refreshAccessToken = () => axios.post(`${API_BASE_URL}/refresh-token`, {}, { withCredentials: true });

// Change the user's password
export const changePassword = (passwordData) => {
  return axios.post(`${API_BASE_URL}/change-password`, passwordData, {
    withCredentials: true,
  });
};

// Fetch current user details
export const getCurrentUser = () => axios.get(`${API_BASE_URL}/current-user`, { withCredentials: true });

// Update account details
export const updateAccountDetails = (updateData) => {
  return axios.patch(`${API_BASE_URL}/update-account`, updateData, { withCredentials: true });
};
