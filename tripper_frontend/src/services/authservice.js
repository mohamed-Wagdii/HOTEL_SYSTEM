import axiosInstance from "../axiousInstance/axoiusInstance";

const authService = {
  signup: async (data) => {
    const res = await axiosInstance.post("/user/signup", data);
    return res.data;
  },

  signin: async (data) => {
    const res = await axiosInstance.post("/user/signin", data);
    return res.data;
  },

 swichRole: async (data) => {
  const res = await axiosInstance.patch("/user/switch-role", data);
  
  // ✅ Save new token and user data
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
  }
  
  return res.data;
},

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  saveAuthData: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },

  getAuthData: () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    return { user, token };
  },


  // User Profile 
  getCurrentUser: async () => {
    const res = await axiosInstance.get("/user/profile");
    return res.data.data;
  },

  updateProfile: async (data) => {
    const res = await axiosInstance.patch("/user/profile", data);
    return res.data.data;
  },

  uploadProfileImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await axiosInstance.patch("/user/profile/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.data;
  },
};
export default authService;
