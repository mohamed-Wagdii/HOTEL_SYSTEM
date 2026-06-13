import React, { useEffect, useState } from "react";
import { hotelReservationsService } from "../../../services/reservationsService";
import ReservationsList from "../../../components/host/reservations/ReservationsList";

const HotelReservationsList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const res = await hotelReservationsService.getAll();
      setReservations(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleAccept = async (res) => {
    await hotelReservationsService.confirm(res._id);
    fetchReservations();
  };

  const handleReject = async (res) => {
    await hotelReservationsService.reject(res._id);
    fetchReservations();
  };

  const calculateNights = (checkIn, checkOut) => {
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diff = outDate - inDate;
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  };

  return (
    <ReservationsList
      title="Hotel Reservations"
      reservations={reservations}
      loading={loading}
      onAccept={handleAccept}
      onReject={handleReject}
      detailsBasePath="/host/reservations"
      fields={[
        { key: "guest", label: "Guest", render: (r) => r.guestId?.name },
        { key: "hotel", label: "Hotel", render: (r) => r.hotelId?.name },
        {
          key: "checkIn",
          label: "Check-in",
          render: (r) => new Date(r.checkIn).toLocaleDateString("en-GB"),
        },
        {
          key: "checkOut",
          label: "Check-out",
          render: (r) => new Date(r.checkOut).toLocaleDateString("en-GB"),
        },
        {
          key: "nights",
          label: "Nights",
          render: (r) => calculateNights(r.checkIn, r.checkOut),
        },
        { key: "totalPrice", label: "Total($)" },
        { key: "paymentStatus", label: "Payment", render: r => r.paymentStatus }

      ]}
    />
  );
};

export default HotelReservationsList;
