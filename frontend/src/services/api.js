import axios from 'axios';

// Use environment variable for API URL, fallback to local development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
export const tokenManager = {
  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
};

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          tokenManager.setTokens(access, refreshToken);
          
          // Retry the original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API methods
export const authAPI = {
  login: (username, password) => 
    api.post('/login/', { username, password }),
  
  signup: (userData) => 
    api.post('/signup/', userData),
  
  logout: (refreshToken) => 
    api.post('/logout/', { refresh: refreshToken }),
};

export const profileAPI = {
  getProfile: () => 
    api.get('/profile/'),
  
  updateProfile: (profileData) => 
    api.put('/profile/', profileData),
};

export const skillsAPI = {
  getSkills: () => 
    api.get('/skills/'),
  
  createSkill: (skillData) => 
    api.post('/skills/', skillData),
};

export const offersAPI = {
  getOffers: () => 
    api.get('/offers/'),
  
  createOffer: (offerData) => 
    api.post('/offers/', offerData),
  
  getUserOffers: () => 
    api.get('/my-offers/'),
};

export default api;