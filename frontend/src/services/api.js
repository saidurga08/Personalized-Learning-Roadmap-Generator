import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject JWT Auth Token into every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle global response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear token on unauthorized
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

// API Service Methods
export const authService = {
  login: async (credentials) => {
    const res = await api.post('/login', credentials);
    return res.data;
  },
  register: async (userData) => {
    const res = await api.post('/register', userData);
    return res.data;
  },
  getProfile: async () => {
    const res = await api.get('/profile');
    return res.data;
  },
};

export const goalService = {
  createGoal: async (goalData) => {
    const res = await api.post('/goals', goalData);
    return res.data;
  },
  getGoals: async () => {
    const res = await api.get('/goals');
    return res.data;
  },
  deleteGoal: async (id) => {
    const res = await api.delete(`/goals/${id}`);
    return res.data;
  },
};

export const roadmapService = {
  generateRoadmap: async (params) => {
    const res = await api.post('/roadmaps/generate', params);
    return res.data;
  },
  getRoadmaps: async () => {
    const res = await api.get('/roadmaps');
    return res.data;
  },
  getRoadmapById: async (id) => {
    const res = await api.get(`/roadmaps/${id}`);
    return res.data;
  },
  modifyRoadmap: async (id, modificationData) => {
    const res = await api.put(`/roadmaps/${id}`, modificationData);
    return res.data;
  },
  deleteRoadmap: async (id) => {
    const res = await api.delete(`/roadmaps/${id}`);
    return res.data;
  },
};

export const taskService = {
  updateTaskStatus: async (taskId, completed) => {
    const res = await api.patch(`/tasks/${taskId}`, { completed });
    return res.data;
  },
};

export const dashboardService = {
  getDashboardData: async () => {
    const res = await api.get('/dashboard');
    return res.data;
  },
  getBadges: async () => {
    const res = await api.get('/badges');
    return res.data;
  },
};

export const integrationService = {
  syncGoogleCalendar: async (roadmapId) => {
    const res = await api.post('/calendar/sync', { roadmap_id: roadmapId });
    return res.data;
  },
  exportPdfUrl: (roadmapId) => `${API_BASE_URL}/roadmaps/${roadmapId}/pdf`,
};

export default api;
