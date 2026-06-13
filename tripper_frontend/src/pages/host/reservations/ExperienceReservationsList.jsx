import React, { useEffect, useState } from "react";
import { experienceReservationsService ,hotelReservationsService} from "../../../services/reservationsService";
import ReservationsList from "../../../components/host/reservations/ReservationsList";

const ExperienceReservationsList = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const res = await experienceReservationsService.getAll();
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

  return (
    <ReservationsList
      title="Experience Reservations"
      reservations={reservations}
      loading={loading}
      onAccept={handleAccept}
      onReject={handleReject}
      detailsBasePath="/host/reservations/experience"
      fields={[
        { key: "guest", label: "Guest", render: (r) => r.guestId?.name },
        { key: "experience", label: "Experience", render: (r) => r.experienceId?.name },
        { key: "guestsCount", label: "Guests" },
        {
          key: "date",
          label: "Date",
          render: (r) => new Date(r.checkIn).toLocaleDateString("en-GB"),
        },
        { key: "totalPrice", label: "Total ($)" },
      ]}
    />
  );
};

export default ExperienceReservationsList;
