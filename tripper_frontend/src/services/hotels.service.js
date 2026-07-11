import axiosInstance from "../axiousInstance/axoiusInstance";

const hotelService = {
  getAllHotels: async () => {
    const res = await axiosInstance.get("/hotels");
    return res.data;
  },

  searchHotelsByCity: async (city) => {
    const res = await axiosInstance.get(`/hotels/search?city=${city}`);
    return res.data;
  },

  getHotelById: async (id) => {
    const res = await axiosInstance.get(`/hotels/${id}`);
    return res.data;
  },

  //Hosts
  getHostHotels: async () => {
    const res = await axiosInstance.get("/hotels/host");
    return res.data;
  },

  deleteHotel: async (id) => {
    const res = await axiosInstance.delete(`/hotels/${id}`);
    return res.data;
  },

  addHotel: async (data) => {
    const res = await axiosInstance.post("/hotels", data);
    return res.data;
  },

  updateHotel: async (id, data) => {
    const res = await axiosInstance.put(`/hotels/${id}`, data);
    return res.data;
  },
  
  updateHotelImages: async (id, formData) => {
    const res = await axiosInstance.patch(`/hotels/${id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }

};

export default hotelService;
