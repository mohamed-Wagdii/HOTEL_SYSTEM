import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { experienceReservationsService } from "../../../services/reservationsService";
import ReservationDetailsLayout from "../../../components/host/reservations/ReservationDetailsLayout";

const ExperienceReservationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await experienceReservationsService.getById(id);
        setReservation(res);
      } catch (error) {
        console.error("Error fetching experience reservation:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [id]);

  if (!reservation) return <ReservationDetailsLayout loading={loading} />;

  const { experienceId: exp, guestId: guest } = reservation;

  return (
    <ReservationDetailsLayout
      loading={loading}
      reservation={reservation}
      title={exp?.name}
      subtitle={`${exp?.address?.city || ""}, ${exp?.address?.country || ""}`}
      leftSection={
        <>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Guest Information
          </Typography>
          <Typography><b>Name:</b> {guest?.name}</Typography>
          <Typography><b>Email:</b> {guest?.email}</Typography>
          <Typography><b>Guests:</b> {reservation.guestsCount}</Typography>
        </>
      }
      rightSection={
        <>
          <Typography variant="h6" fontWeight="bold" mb={1}>
            Experience Details
          </Typography>
          <Typography>
            <b>Date:</b> {new Date(reservation.checkIn).toLocaleDateString("en-GB")}
          </Typography>
          <Typography><b>Description:</b> {exp?.description}</Typography>
        </>
      }
      totalPrice={reservation.totalPrice}
      viewBtnLabel="View Experience"
      onViewClick={() => navigate(`/experiance/details/${exp?._id}`)}
    />
  );
};

export default ExperienceReservationDetails;
