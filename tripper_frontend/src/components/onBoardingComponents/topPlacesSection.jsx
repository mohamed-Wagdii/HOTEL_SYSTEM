import { Typography, Box, Grid, Card, CardMedia, CardContent, Button, Snackbar, Alert } from "@mui/material";
import React, { use, useEffect, useState } from "react";
import axiosInstance from "../../axiousInstance/axoiusInstance";
import { Navigate, useNavigate } from "react-router-dom";

export default function TopPlacesSection() {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", type: "success" });
  const navigate = useNavigate();

   const [topPlaces, setData] =useState([]);
  // [
  //   {
  //     img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  //     title: "Santorini, Greece",
  //     location: "Greece, Europe",
  //   },
  //   {
  //     img: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff",
  //     title: "Bali, Indonesia",
  //     location: "Indonesia, Asia",
  //   },
  //   {
  //     img: "https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba",
  //     title: "Swiss Alps, Switzerland",
  //     location: "Switzerland, Europe",
  //   },
  // ];

  useEffect(() => {
    axiosInstance.get("/places").then((res) => {
      console.log(res.data.data);
      setData(res.data.data);
    }).catch((err) => console.log(err));
  },[]);
  const handleAddToPlan = (place) => {
    const stored = JSON.parse(localStorage.getItem("plan")) || [];
    const exists = stored.some((item) => item.title === place.title);

    if (!exists) {
      const newPlace = {
        ...place,
        id: Date.now(),
        days: [
          { day: "Day 1", desc: "Explore the local culture and landmarks." },
          { day: "Day 2", desc: "Visit top attractions and hidden gems." },
          { day: "Day 3", desc: "Relax and enjoy local cuisine." },
        ],
      };

      stored.push(newPlace);
      localStorage.setItem("plan", JSON.stringify(stored));
      setSnackbar({ open: true, message: `${place.title} added to your plan!`, type: "success" });
    } else {
      setSnackbar({ open: true, message: "This place is already in your plan.", type: "info" });
    }
  };

    const handleCardClick = (id) => {
      console.log('place clicked');
      
 const model='places';
    navigate(`/${model}/details/${id}`);
  };

  return (
    <Box sx={{ textAlign: "center", py: 10, backgroundColor: "#f9f9f9" }}>
      <Typography
        variant="subtitle2"
        sx={{
          textTransform: "uppercase",
          color: "#5E6282",
          fontWeight: 600,
          letterSpacing: 2,
          mb: 1,
        }}
      >
        Top Places
      </Typography>

      <Typography
        variant="h4"
        sx={{
          fontWeight: 800,
          color: "#034959",
          mb: 6,
        }}
      >
        Explore Our Most Popular Destinations
      </Typography>

      <Grid container spacing={5} justifyContent="center">
        {topPlaces.map((place, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Card
            onClick={() => handleCardClick(place._id)}
              sx={{
                borderRadius: "20px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                overflow: "hidden",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                "&:hover": { transform: "translateY(-8px)" },
              }}
            >
              <CardMedia
                component="img"
                height="220"
                image={place.images[0]}
                alt={place.name}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#034959" }}>
                  {place.name}
                </Typography>
                <Typography variant="body2" color="#5E6282">
                  {place.address.city}, {place.address.country}
                </Typography>

                {/* <Button
                  variant="contained"
                  sx={{
                    mt: 2,
                    backgroundColor: "#f27244",
                    borderRadius: "12px",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { backgroundColor: "#034959" },
                  }}
                  onClick={() => handleAddToPlan(place)}
                >
                  Add to Plan
                </Button> */}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Snackbar notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snackbar.type}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
