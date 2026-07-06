const API_BASE = import.meta.env.VITE_API_URL;

const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  };

  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  return data;
};

export const api = {
  getProfile: () => fetchAPI("/api/profile"),
  getSkills: () => fetchAPI("/api/skills"),
  getProjects: () => fetchAPI("/api/projects"),
  getExperience: () => fetchAPI("/api/experience"),
  getEducation: () => fetchAPI("/api/education"),
  getCerts: () => fetchAPI("/api/certs"),
  sendMessage: (payload) => fetchAPI("/api/messages", {
    method: "POST",
    body: JSON.stringify(payload),
  }),
  login: (username, password) => fetchAPI("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  }),
  forgotPassword: (username, email, newPassword) => fetchAPI("/api/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ username, email, newPassword }),
  }),
  register: (username, email, password) => fetchAPI("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  }),
  updateAccount: (payload, token) => fetchAPI("/api/auth/update", {
    method: "PUT",
    headers: { "Authorization": `Bearer ${token}` },
    body: JSON.stringify(payload),
  }),
};
