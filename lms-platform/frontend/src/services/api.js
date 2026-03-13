import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5002/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) localStorage.removeItem("userInfo");
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  signup: (data) => api.post("/auth/signup", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  getAllUsers: () => api.get("/auth/users"),
  makeAdmin: (id) => api.put(`/auth/users/${id}/make-admin`),
};

export const coursesAPI = {
  getAll: (params) => api.get("/courses", { params }),
  getById: (id) => api.get(`/courses/${id}`),
  create: (data) => api.post("/courses", data),
  update: (id, data) => api.put(`/courses/${id}`, data),
  delete: (id) => api.delete(`/courses/${id}`),
  enroll: (courseId) => api.post("/courses/enroll", { courseId }),
  getMyCourses: () => api.get("/mycourses"),
  updateProgress: (courseId, lessonIndex) => api.put(`/courses/${courseId}/progress`, { lessonIndex }),
  getAdminStats: () => api.get("/courses/admin/stats"),
  seed: () => api.post("/courses/seed/all"),
};

export default api;