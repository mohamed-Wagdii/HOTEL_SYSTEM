import axiosInstance from "../axiousInstance/axoiusInstance";

const favoriteService = {
  addFavorite: async (itemId, itemType) => {
    try {
      const response = await axiosInstance.post("/favorites", { itemId, itemType });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeFavorite: async (itemId, itemType) => {
    try {
      const response = await axiosInstance.delete("/favorites", {
        data: { itemId, itemType }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserFavorites: async () => {
    try {
      const response = await axiosInstance.get("/favorites");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  checkFavorite: async (itemId, itemType) => {
    try {
      const response = await axiosInstance.get("/favorites/check", {
        params: { itemId, itemType }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default favoriteService;