import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import hotelService from "../../services/hotels.service";

const Dashboard = () => {
  const navigate = useNavigate();
  const [recentListings, setRecentListings] = useState([]);

  useEffect(() => {
    hotelService
      .getHostHotels()
      .then((data) => {
        setRecentListings(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        p: 2,
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: "100%",
          maxWidth: 1200,
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
          bgcolor: "white",
        }}
      >
        {/* Header */}
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{ mb: 3, textAlign: "center", color: "#034959" }}
        >
          Dashboard
        </Typography>

        <Divider sx={{ mb: 4 }} />

        {/* Add New Listing Button */}
        <Box sx={{ mb: 5, textAlign: "center" }}>
          <Button
            variant="contained"
            sx={{
              px: 4,
              py: 1,
              fontWeight: 600,
              borderRadius: 3,
              bgcolor: "#f27244",
              textTransform: "none",
              "&:hover": { bgcolor: "#034959" },
            }}
            onClick={() => navigate("/host/listings")}
          >
            + Add New Listing
          </Button>
        </Box>

        {/* Recent Listings */}
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{ mb: 2, textAlign: "left", color: "#034959" }}
        >
          Recent Listings
        </Typography>

        <Grid container spacing={3}>
          {recentListings.map((listing) => {
            const displayPrice =
              listing.rooms && listing.rooms.length > 0
                ? Math.min(...listing.rooms.map((r) => r.price))
                : listing.price;

            const priceText =
              listing.rooms && listing.rooms.length > 0
                ? `from $${displayPrice} / night`
                : `$${displayPrice} / night`;

            return (
              <Grid item xs={12} sm={6} md={4} key={listing._id}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
                    transition: "0.3s ease",
                    backgroundColor: "#fff",
                    "&:hover": {
                      boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
                      transform: "translateY(-5px)",
                    },
                  }}
                >
                  <Box sx={{ position: "relative" }}>
                    <CardMedia
                      component="img"
                      image={listing.images?.[0] || "/placeholder.jpg"}
                      alt={listing.name}
                      sx={{ height: 220, objectFit: "cover" }}
                    />
                    <Box
                      sx={{
                        position: "absolute",
                        bottom: 10,
                        left: 10,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        borderRadius: 2,
                        px: 1.2,
                        py: 0.3,
                        fontSize: "0.9rem",
                        fontWeight: 500,
                      }}
                    >
                      {priceText}
                    </Box>
                  </Box>
                  <CardContent sx={{ px: 2.5, py: 2 }}>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      noWrap
                      gutterBottom
                    >
                      {listing.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard;
