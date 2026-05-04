import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

// =====================
// AXIOS INSTANCE
// =====================
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// =====================
// REQUEST INTERCEPTOR (TOKEN)
// =====================
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// =====================
// RESPONSE INTERCEPTOR (AUTH HANDLING)
// =====================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // safer redirect
      window.location.replace("/login");
    }

    return Promise.reject(error);
  }
);

// =====================
// LOGOUT FUNCTION
// =====================
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.replace("/login");
};

// =====================
// AUTH APIs
// =====================
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
};

// =====================
// PROJECT APIs
// =====================
export const projectAPI = {
  getProjects: () => api.get("/projects"),
  getProject: (id) => api.get(`/projects/${id}`),
  createProject: (data) => api.post("/projects", data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),

  // 👇 MEMBER MANAGEMENT (future dropdown support)
  addMember: (projectId, memberId) =>
    api.post(`/projects/${projectId}/add-member`, { memberId }),

  searchUsers: (search) => api.get(`/users`, { params: { search } }),

  removeMember: (projectId, memberId) =>
    api.delete(`/projects/${projectId}/remove-member/${memberId}`),
};

// =====================
// TASK APIs
// =====================
export const taskAPI = {
  getTasksByProject: (projectId) =>
    api.get(`/tasks/${projectId}`),

  createTask: (data) => api.post("/tasks", data),

  updateTask: (id, data) => api.put(`/tasks/${id}`, data),

  deleteTask: (id) => api.delete(`/tasks/${id}`),

  getDashboardStats: () => api.get("/tasks/stats/dashboard"),
};

export default api;