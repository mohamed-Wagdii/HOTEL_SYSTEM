import React from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Chip,
  Divider,
  Button,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const statusColors = {
  pending: "warning",
  confirmed: "success",
  cancelled: "error",
  completed: "info",
};

const ReservationDetailsLayout = ({
  loading,
  reservation,
  title,
  subtitle,
  leftSection,
  rightSection,
  totalPrice,
  viewBtnLabel,
  onViewClick,
}) => {
  const navigate = useNavigate();

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="70vh">
        <CircularProgress sx={{ color: "#FF385C" }} />
      </Box>
    );

  if (!reservation)
    return (
      <Box textAlign="center" mt={10}>
        <Typography color="text.secondary">Reservation not found.</Typography>
      </Box>
    );

  return (
    <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh", py: { xs: 3, md: 6 } }}>
      <Box maxWidth="1000px" mx="auto" px={{ xs: 2, sm: 3 }}>
        {/* Header */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          flexWrap="wrap"
          gap={2}
          mb={3}
        >
          <Button
            onClick={() => navigate(-1)}
            sx={{
              color: "#f27244",
              fontWeight: 600,
              "&:hover": { color: "#034959" },
            }}
          >
            Back
          </Button>

          <Chip
            label={reservation.status}
            color={statusColors[reservation.status]}
            sx={{
              textTransform: "capitalize",
              fontWeight: 600,
              fontSize: { xs: "0.8rem", sm: "1rem" },
            }}
          />
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 4,
            backgroundColor: "#fff",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          {/* Title */}
          <Typography variant="h5" fontWeight="bold" mb={0.5} color="#034959">
            {title}
          </Typography>

          {subtitle && (
            <Typography color="text.secondary" mb={2}>
              {subtitle}
            </Typography>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Custom sections (left + right) */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {leftSection}
            </Grid>
            <Grid item xs={12} md={6}>
              {rightSection}
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Price Section */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            flexWrap="wrap"
            gap={2}
          >
            <Typography fontWeight="bold" fontSize={{ xs: "1rem", sm: "1.1rem" }}>
              Total Price
            </Typography>
            <Typography
              fontWeight="bold"
              color="#034959"
              fontSize={{ xs: "1.2rem", sm: "1.4rem" }}
            >
              ${totalPrice}
            </Typography>
          </Box>

          {/* View Button */}
          <Box textAlign={{ xs: "center", sm: "center" }} mt={4}>
            <Button
              variant="contained"
              
              onClick={onViewClick}
              sx={{
                backgroundColor: "#f27244",
                
                fontWeight: "bold",
                borderRadius: "12px",
                px: { xs: 2, sm: 3 },
                py: 1,
                "&:hover": { backgroundColor: "#034959" },
              }}
            >
              {viewBtnLabel}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default ReservationDetailsLayout;
