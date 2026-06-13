import React from "react";
import { Box, Typography, Card, CardMedia, CardContent } from "@mui/material";

const PlaceDetails = () => {
  const place = JSON.parse(localStorage.getItem("selectedPlace"));

  if (!place) {
    return (
      <Typography
        variant="h5"
        textAlign="center"
        mt={10}
      >
        ⚠️ No place data found.
      </Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Card sx={{ maxWidth: 600, borderRadius: 3, boxShadow: 3 }}>
        <CardMedia
          component="img"
          height="350"
          image={place.image}
          alt={place.title}
        />
        <CardContent>
          <Typography variant="h5" fontWeight="bold">
            {place.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {place.price}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            ⭐ Rating: {place.rating}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PlaceDetails;
