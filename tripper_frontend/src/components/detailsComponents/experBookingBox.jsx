import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../axiousInstance/axoiusInstance";
import { set } from "react-hook-form";

export default function ExpBookingBox({ place, model }) {
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [nights, setNights] = useState(1);
  const [totalPrice, setTotalPrice] = useState(place.price);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomCount, setRoomCount] = useState(1);
  const pricePerNight = selectedRoom?.price || place.price;
const [availableRooms, setAvailableRooms] = useState(null);

  const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  useEffect(() => {
    if (model.toLowerCase() === "hotel") {
      setCheckIn(getTodayDate());
    }
  }, [model]);

  useEffect(() => {
    if (model.toLowerCase() === "hotel" && place.rooms?.length > 0) {
      setSelectedRoom(place.rooms[0]);
      setTotalPrice(place.rooms[0].price);
    }
  }, [place, model]);

  useEffect(() => {
    if (checkIn && checkOut && model.toLowerCase() === "hotel") {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      if (end > start) {
        const diffDays = (end - start) / (1000 * 60 * 60 * 24);
        setNights(diffDays);
setTotalPrice(diffDays * pricePerNight * roomCount);
      } else {
        setNights(0);
        setTotalPrice(0);
      }
    } else if (model.toLowerCase() === "experiance") {
      setTotalPrice(1 * guests * pricePerNight);
    }
  }, [checkIn, checkOut, guests, model, pricePerNight]);
const fetchAvailability = async (date) => {
  if (!selectedRoom?._id) return;

  try {
    const res = await axiosInstance.get("/api/reservations/availability", {
      params: {
        hotelId: place._id,
        roomId: selectedRoom._id,
        date
      }
    });

    setAvailableRooms(res.data.available);
  } catch (err) {
    console.error(err);
  }
};

  const handleReserve = async () => {
    if (JSON.parse(localStorage.getItem("user")) === null) {
      setMessage("Please login to make a reservation.");
      return;
    }
    try {
      setLoading(true);
      setMessage("");

      let payload = {
        checkIn,
        checkOut,
        guestsCount: guests,
      };

      if (model.toLowerCase() === "hotel") {
        payload.hotelId = place._id;
        payload.roomId = selectedRoom?._id;
        payload.roomCount = roomCount;
      } else if (model.toLowerCase() === "experiance") {
        payload.experienceId = place._id;
      }

      // ✅ Create reservation only (NO payment yet)
      const res = await axiosInstance.post("/api/reservations", payload);
      console.log("Reservation created:", res.data);
      setLoading(false);
      setMessage("✅ Reservation created successfully.");
      // ✅ Navigate to payment page with reservation data
      // navigate("/payment", { 
      //   state: { 
      //     reservationId: res.data._id,
      //     amount: res.data.totalPrice 
      //   } 
      // });
      
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to create reservation.");
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const upcomingDates = (place.dates || []).filter((d) => {
    const date = new Date(d);
    const today = new Date();
    date.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return date >= today;
  });

  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 4,
          width: 340,
          backgroundColor: "#fff",
          position: "sticky",
          top: 100,
        }}
      >
        <Typography variant="h6" fontWeight={700} sx={{ mb: 1, color: "#222" }}>
          {totalPrice.toLocaleString()} ج.م{" "}
          {model?.toLowerCase() === "hotel" && nights > 0 && (
            <Typography component="span" fontSize={15} color="text.secondary">
              for {nights} {nights === 1 ? "night" : "nights"}
            </Typography>
          )}
          {model?.toLowerCase() === "experiance" && guests > 0 && (
            <Typography component="span" fontSize={15} color="text.secondary">
              for {guests} {guests === 1 ? "guest" : "guests"}
            </Typography>
          )}
        </Typography>

        {model.toLowerCase() === "hotel" && place.rooms?.length > 0 && (
          <TextField
            select
            label="Room Type"
            value={selectedRoom?._id || ""}
            onChange={(e) => {
              const room = place.rooms.find((r) => r._id === e.target.value);
              setSelectedRoom(room);
              setTotalPrice(nights * guests * room.price);
            }}
            fullWidth
            sx={{ mb: 2 }}
          >
            {place.rooms.map((room) => (
              <MenuItem key={room._id} value={room._id}>
                {room.name} — {room.price} ج.م
              </MenuItem>
            ))}
          </TextField>
        )}
{model.toLowerCase() === "hotel" && place.rooms?.length > 0 && (
  <TextField
    select
    label="Rooms Count"
    value={roomCount}
    onChange={(e) => {
      const value = Number(e.target.value);
      setRoomCount(value);
      setTotalPrice(nights * guests * pricePerNight * value);
    }}
    fullWidth
    sx={{ mb: 2 }}
  >
    {[1, 2, 3, 4, 5].map((num) => (
      <MenuItem key={num} value={num}>
        {num} {num === 1 ? "room" : "rooms"}
      </MenuItem>
    ))}
  </TextField>
)}

        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            {model.toLowerCase() === "hotel" && (
              <>
                <TextField
                  label="Check-in"
                  type="date"
                  value={checkIn}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    fetchAvailability(e.target.value);
                  }} InputLabelProps={{ shrink: true }}
                  inputProps={{ min: getTodayDate() }}
                  fullWidth
                />
                <TextField
                  label="Check-out"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  inputProps={{ min: checkIn || getTodayDate() }}
                  fullWidth
                />
              </>
            )}

            {model.toLowerCase() === "experiance" && (
              <TextField
                select
                label="Available Dates"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                fullWidth
              >
                {upcomingDates.length > 0 ? (
                  upcomingDates.map((date, idx) => (
                    <MenuItem key={idx} value={date}>
                      {formatDate(date)}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>No upcoming dates available</MenuItem>
                )}
              </TextField>
            )}
          </Box>
          {/* {availableRooms !== null && (
  <Typography sx={{ mt: 1, color: availableRooms > 0 ? "green" : "red" }}>
    {availableRooms > 0
      ? `Available rooms: ${availableRooms}`
      : "No rooms available on this date"}
  </Typography>
)} */}


          {model.toLowerCase() === "experiance" && (
            <TextField
              select
              label="Guests"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              fullWidth
              sx={{ mb: 3 }}
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <MenuItem key={num} value={num}>
                  {num} {num === 1 ? "guest" : "guests"}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleReserve}
            disabled={checkIn === "" || loading}
            sx={{
              py: 1.3,
              borderRadius: 3,
              backgroundColor: "#f27244",
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": { backgroundColor: "#034959" },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Reserve"}
          </Button>

          <Typography
            variant="body2"
            textAlign="center"
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            You won't be charged yet
          </Typography>

          {message && (
            <Typography
              variant="body2"
              textAlign="center"
              sx={{ mt: 2, color: message.includes("✅") ? "green" : "red" }}
            >
              {message}
            </Typography>
          )}
        </Box>
      </Paper>
    </Box>
  );
}