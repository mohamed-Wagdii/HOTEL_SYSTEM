import axiosInstance from "../axiousInstance/axoiusInstance";

export const hotelReservationsService = {
  //     get all hotel reservations
  getAll: async () => {
    const res = await axiosInstance.get("/reservations/host");
    return res.data.filter((r) => r.hotelId);
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/reservations/${id}`);
    return res.data;
  },

  confirm: async (id) => {
    const res = await axiosInstance.patch(`/reservations/${id}/status`, {
      status: "confirmed",
    });
    return res.data;
  },

  reject: async (id) => {
    const res = await axiosInstance.patch(`/reservations/${id}/status`, {
      status: "cancelled",
    });
    return res.data;
  },

};



export const experienceReservationsService = {
  // get all experience reservations    
  getAll: async () => {
    const res = await axiosInstance.get("/reservations/host");
    return res.data.filter((r) => r.experienceId);
  },

  getById: async (id) => {
    const res = await axiosInstance.get(`/reservations/${id}`);
    return res.data;
  },

};


export const userReservationsService = {
  getAll: async () => {
    const res = await axiosInstance.get("/reservations/my");
    return res.data;
  },
};

