import axiosInstance from "../axiousInstance/axoiusInstance";
const experienceService = {
  getAllExperiences: async () => {
    const res = await axiosInstance.get("/experiance");
    return res.data;
  },

  getExperienceById: async (id) => {
    const res = await axiosInstance.get(`/experiance/${id}`);
    return res.data;
  },

  searchExperiences: async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const res = await axiosInstance.get(`/experience/search?${params}`);
    return res.data;
  },

     // Hosts 
  getHostExperiences: async () => {
    const res = await axiosInstance.get("/experiance/host");
    return res.data;
  },


   addExperience: async (data) => {
    const res = await axiosInstance.post("/experiance", data);
    return res.data;
  },

/*************  ✨ Windsurf Command ⭐  *************/
  /**
   * Deletes an experience by its id.
   * @param {string} id - The id of the experience to delete.
   * @returns {Promise<object>} - The response of the delete request.
/*******  c0523b5d-4aa4-40b0-9e55-bc1f269f1a70  *******/  
  deleteExperience: async (id) => {
    const res = await axiosInstance.delete(`/experiance/${id}`);
    return res.data;
  },

 
  updateExperience: async (id, data) => {
    const res = await axiosInstance.put(`/experiance/${id}`, data);
    return res.data;
  },

    //  Activities
  addActivity: async (id, formData) => {
    const res = await axiosInstance.post(`/experiance/${id}/activities`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
  removeActivity: async (id, activityId) => {
    const res = await axiosInstance.delete(`/experiance/${id}/activities/${activityId}`);
    return res.data;
  },

    //  Dates
  addDate: async (id, date) => {
    const res = await axiosInstance.post(`/experiance/${id}/dates`, { date });
    return res.data;
  },
  removeDate: async (id, date) => {
    const res = await axiosInstance.delete(`/experiance/${id}/dates`, {
      data: { date },
    });
    return res.data;
  },

    //Adding new images to an existing experience
  addExperienceImages: async (id, formData) => {
    const res = await axiosInstance.post(`/experiance/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

export default experienceService;