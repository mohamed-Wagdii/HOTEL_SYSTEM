import axiosInstance from "../axiousInstance/axoiusInstance";
const experienceService = {
  getAllExperiences: async () => {
    const res = await axiosInstance.get("/experiences");
    return res.data;
  },

  getExperienceById: async (id) => {
    const res = await axiosInstance.get(`/experiences/${id}`);
    return res.data;
  },

  searchExperiences: async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const res = await axiosInstance.get(`/experiences/search?${params}`);
    return res.data;
  },

  getHostExperiences: async () => {
    const res = await axiosInstance.get("/experiences/host");
    return res.data;
  },

  addExperience: async (data) => {
    const res = await axiosInstance.post("/experiences", data);
    return res.data;
  },

  deleteExperience: async (id) => {
    const res = await axiosInstance.delete(`/experiences/${id}`);
    return res.data;
  },

  updateExperience: async (id, data) => {
    const res = await axiosInstance.put(`/experiences/${id}`, data);
    return res.data;
  },

  addActivity: async (id, formData) => {
    const res = await axiosInstance.post(`/experiences/${id}/activities`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  removeActivity: async (id, activityId) => {
    const res = await axiosInstance.delete(`/experiences/${id}/activities/${activityId}`);
    return res.data;
  },

  addDate: async (id, date) => {
    const res = await axiosInstance.post(`/experiences/${id}/dates`, { date });
    return res.data;
  },
  removeDate: async (id, date) => {
    const res = await axiosInstance.delete(`/experiences/${id}/dates`, {
      data: { date },
    });
    return res.data;
  },

  addExperienceImages: async (id, formData) => {
    const res = await axiosInstance.post(`/experiences/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

export default experienceService;