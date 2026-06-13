import React, { useEffect, useState } from "react";
import { Typography, Grid } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { hotelReservationsService } from "../../../services/reservationsService";
import ReservationDetailsLayout from "../../../components/host/reservations/ReservationDetailsLayout";

const HotelReservationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservation = async () => {
      try {
        const res = await hotelReservationsService.getById(id);
        setReservation(res);
      } catch (error) {
        console.error("Error fetching hotel reservation:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReservation();
  }, [id]);

  if (!reservation) return <ReservationDetailsLayout loading={loading} />;

  const { hotelId: hotel, guestId: guest } = reservation;
  const nights =
    reservation.checkIn && reservation.checkOut
      ? Math.ceil(
          (new Date(reservation.checkOut) - new Date(reservation.checkIn)) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

  // Room info if exists
  const bookedRoom =
    reservation.roomId && hotel?.rooms?.length > 0
      ? hotel.rooms.find((r) => r._id === reservation.roomId)
      : null;

  return (
    <ReservationDetailsLayout
      loading={loading}
      reservation={reservation}
      title={hotel?.name}
      subtitle={`${hotel?.address?.city || ""}, ${hotel?.address?.country || ""}`}
      leftSection={
        <Typography variant="h6" fontWeight="bold" mb={1}>
          Guest Details
          <Typography><b>Name:</b> {guest?.name}</Typography>
          <Typography><b>Email:</b> {guest?.email}</Typography>
          <Typography><b>Guests:</b> {reservation.guestsCount}</Typography>
        </Typography>
      }
      rightSection={
        <Grid container spacing={3}>
          {/* Stay Details */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" fontWeight="bold" mb={1}>
              Stay Details
            </Typography>
            <Typography>
              <b>Check-in:</b> {new Date(reservation.checkIn).toLocaleDateString("en-GB")}
            </Typography>
            <Typography>
              <b>Check-out:</b> {new Date(reservation.checkOut).toLocaleDateString("en-GB")}
            </Typography>
            <Typography><b>Nights:</b> {nights}</Typography>
          </Grid>

          {/* Room Details */}
          {bookedRoom && (
            <Grid item xs={12} md={4}>
              <Typography variant="h6" fontWeight="bold" mb={1}>
                Room Details
              </Typography>
              <Typography>
              <b>Type:</b> {bookedRoom.name} 
              </Typography>
              <Typography>
                <b>Quantity:</b> {reservation.roomCount} 
              </Typography>
              <Typography>
                <b>Max Guests:</b> {bookedRoom.maxGuests}
              </Typography>
            </Grid>
          )}

          {/* Optional placeholder for layout balance if no room */}
          {!bookedRoom && <Grid item xs={12} md={4}></Grid>}
        </Grid>
      }
      totalPrice={reservation.totalPrice}
      viewBtnLabel="View Hotel"
      onViewClick={() => navigate(`/hotel/details/${hotel?._id}`)}
    />
  );
};

export default HotelReservationDetails;
