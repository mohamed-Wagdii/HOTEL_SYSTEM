import { useEffect, useState } from "react";
import { userReservationsService } from "../services/reservationsService";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Skeleton,
} from "@mui/material";
import { Payment as PaymentIcon } from "@mui/icons-material";
import { Chip, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function MyTrips() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

    const handlePayNow = (reservation) => {
    navigate("/payment", {
      state: {
        reservationId: reservation._id,
        amount: reservation.totalPrice,
      },
    });
  };

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await userReservationsService.getAll();
        setReservations(res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, []);


  const renderCard = (res) => {
    const hotel = res.hotelId;
    const exp = res.experienceId;

    const img = hotel?.images?.[0] || exp?.images?.[0] || "/placeholder.jpg";
    const title = hotel?.name || exp?.name;
    const price = res.totalPrice;

    const start = new Date(res.checkIn).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
    const end = res.checkOut
      ? new Date(res.checkOut).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        })
      : null;


          const getStatusColor = () => {
      if (res.paymentStatus === "succeeded") return "success";
      if (res.status === "confirmed" && res.paymentStatus === "unpaid") return "warning";
      if (res.status === "pending") return "info";
      if (res.status === "cancelled") return "error";
      return "default";
    };

    const getStatusText = () => {
      if (res.paymentStatus === "succeeded") return "Paid";
      if (res.status === "confirmed" && res.paymentStatus === "unpaid") return "Awaiting Payment";
      return res.status;
    };

    return (
      <Card
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          cursor: "pointer",
          position: "relative",
          transition: "0.3s",
          "&:hover": { transform: "scale(1.03)", boxShadow: "0 8px 20px rgba(0,0,0,0.15)" },
        }}
      >
        {/* Status badge */}
         <Chip
          label={getStatusText()}
          color={getStatusColor()}
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            fontWeight: "bold",
            textTransform: "capitalize",
            zIndex: 1,
          }}
        />
        <CardMedia component="img" height="200" image={img} alt={title} sx={{ objectFit: "cover" }} />

        <CardContent>
          <Typography variant="h6" fontWeight="bold">
            {title}
          </Typography>

          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {start} {end ? `→ ${end}` : ""}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {res.guestsCount} guest{res.guestsCount > 1 ? "s" : ""}
          </Typography>

          <Typography variant="body1" mt={1} fontWeight="bold">
            ${price} total
          </Typography>
          
             {/* إضافة زرار Pay Now */}
          {res.status === "confirmed" && res.paymentStatus === "unpaid" && (
            <Button
              variant="contained"
              fullWidth
              startIcon={<PaymentIcon />}
              onClick={() => handlePayNow(res)}
              sx={{
                mt: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                fontWeight: "bold",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                },
              }}
            >
              Pay Now
            </Button>
          )}
        </CardContent>
      </Card>
    );
  };

  // Loading Skeleton 
  const renderSkeleton = (count = 6) =>
    Array.from(new Array(count)).map((_, idx) => (
      <Grid item xs={12} sm={6} md={4} key={idx}>
        <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 3 }} />
        <Skeleton height={30} sx={{ mt: 1, borderRadius: 1 }} />
        <Skeleton height={20} sx={{ mt: 0.5, borderRadius: 1 }} />
        <Skeleton height={20} sx={{ mt: 0.5, width: "50%", borderRadius: 1 }} />
      </Grid>
    ));

  return (
    <Box p={{ xs: 2, sm: 3 }}>
      <Typography
        variant="h4"
        mb={3}
        fontWeight="bold"
        sx={{ fontSize: { xs: "24px", md: "32px" } }}
      >
        Your Trips
      </Typography>

      {/*  Hotels Section  */}
      <Box mb={5}>
        <Typography variant="h5" mb={2} fontWeight="bold">
          Hotels
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {loading
            ? renderSkeleton()
            : reservations.filter((res) => res.hotelId).length > 0
            ? reservations.filter((res) => res.hotelId).map((res) => (
                <Grid item xs={12} sm={6} md={4} key={res._id}>
                  {renderCard(res)}
                </Grid>
              ))
            : (
              <Typography color="text.secondary" sx={{ m: 2 }}>
                No Hotel Reservations yet.
              </Typography>
            )}
        </Grid>
      </Box>

      {/*  Experiences Section  */}
      <Box>
        <Typography variant="h5" mb={2} fontWeight="bold">
          Experiences
        </Typography>

        <Grid container spacing={{ xs: 2, sm: 3 }}>
          {loading
            ? renderSkeleton()
            : reservations.filter((res) => res.experienceId).length > 0
            ? reservations.filter((res) => res.experienceId).map((res) => (
                <Grid item xs={12} sm={6} md={4} key={res._id}>
                  {renderCard(res)}
                </Grid>
              ))
            : (
              <Typography color="text.secondary" sx={{ m: 2 }}>
                No Experience Reservations yet.
              </Typography>
            )}
        </Grid>
      </Box>
    </Box>
  );
}
