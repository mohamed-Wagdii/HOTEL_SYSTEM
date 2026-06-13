import React from "react";
import {
  Grid,
  Card,
  Box,
  CardMedia,
  CardContent,
  Typography,
  Divider,
  Stack,
  IconButton,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

const ListingCard = ({ listing, onEdit, onDelete }) => {
  
  const displayPrice =
    listing.rooms && listing.rooms.length > 0
      ? Math.min(...listing.rooms.map((r) => r.price)) 
      : listing.price;

  const priceText =
    listing.rooms && listing.rooms.length > 0
      ? `from $${displayPrice} / night`
      : `$${displayPrice} / night`;

  return (
    <Grid item xs={12} sm={6} md={4}>
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
          <Typography variant="h6" fontWeight="bold" noWrap gutterBottom>
            {listing.name}
          </Typography>
          <Divider sx={{ my: 1.5 }} />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Stack direction="row" spacing={1}>
              <IconButton color="primary" size="small" onClick={onEdit}>
                <Edit />
              </IconButton>
              <IconButton color="error" size="small" onClick={onDelete}>
                <Delete />
              </IconButton>
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {listing.address?.city || "-"}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ListingCard;
