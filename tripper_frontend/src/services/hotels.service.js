import axiosInstance from "../axiousInstance/axoiusInstance";

const hotelService = {
  getAllHotels: async () => {
    const res = await axiosInstance.get("/hotel");
    return res.data;
  },

  searchHotelsByCity: async (city) => {
    const res = await axiosInstance.get(`/hotel/search?city=${city}`);
    return res.data;
  },

  getHotelById: async (id) => {
    const res = await axiosInstance.get(`/hotel/${id}`);
    return res.data;
  },


  //Hosts
   getHostHotels: async () => {
    const res = await axiosInstance.get("/hotel/host");
    return res.data;
  },

  deleteHotel: async (id) => {
    const res = await axiosInstance.delete(`/hotel/${id}`);
    return res.data;
  },

  addHotel: async (data) => {
    const res = await axiosInstance.post("/hotel", data);
    return res.data;
  },

  updateHotel: async (id, data) => {
    const res = await axiosInstance.put(`/hotel/${id}`, data);
    return res.data;
  },
  
  updateHotelImages: async (id, formData) => {
    const res = await axiosInstance.patch(`/hotel/${id}/images`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  }

};

export default hotelService;
