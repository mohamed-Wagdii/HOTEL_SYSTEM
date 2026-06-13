import axiosInstance from "../axiousInstance/axoiusInstance";

const favoriteService = {
  addFavorite: async (itemId, itemType) => {
    try {
      const response = await axiosInstance.post("/favorite", {
        itemId,
        itemType
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  removeFavorite: async (itemId, itemType) => {
    try {
      const response = await axiosInstance.delete("/favorite", {
        data: { itemId, itemType }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserFavorites: async () => {
    try {
      const response = await axiosInstance.get("/favorite");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  checkFavorite: async (itemId, itemType) => {
    try {
      const response = await axiosInstance.get("/favorite/check", {
        params: { itemId, itemType }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default favoriteService;