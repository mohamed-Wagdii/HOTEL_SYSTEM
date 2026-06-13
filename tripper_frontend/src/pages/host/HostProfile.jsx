import React from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  IconButton,
  Stack,
  Button,
  Paper,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import HomeIcon from "@mui/icons-material/Home";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import { useNavigate } from "react-router-dom";

const HostProfile = () => {
  const navigate = useNavigate();

  const host = {
    name: "John Doe",
    email: "johndoe@example.com",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
    listingsCount: 5,
    reservationsCount: 12,
    bio: "Superhost with amazing properties worldwide.",
  };

  const stats = [
    {
      label: "Your Listings",
      value: host.listingsCount,
      icon: <HomeIcon fontSize="medium" color="primary" />,
    },
    {
      label: "Reservations",
      value: host.reservationsCount,
      icon: <BookOnlineIcon fontSize="medium" color="primary" />,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "transparent",
        p: 2,
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 700,
          borderRadius: 4,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* Avatar & Info */}
        <Box sx={{ position: "relative", mb: 3 }}>
          <Avatar
            src={host.avatar}
            sx={{
              width: 100,
              height: 100,
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            }}
          />
          <IconButton
            sx={{
              position: "absolute",
              bottom: 0,
              right: 0,
              bgcolor: "white",
              boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              "&:hover": { bgcolor: "grey.100" },
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="h6" fontWeight="bold">
          {host.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {host.email}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, mb: 3, maxWidth: 450 }}
        >
          {host.bio}
        </Typography>

        <Divider sx={{ width: "100%", mb: 3 }} />

        {/* Stats */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} key={stat.label}>
              <Card
                sx={{
                  py: 2,
                  borderRadius: 3,
                  textAlign: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                  "&:hover": { boxShadow: "0 4px 14px rgba(0,0,0,0.1)" },
                }}
              >
                <CardContent>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {stat.icon}
                    <Typography
                      variant="h5"
                      fontWeight="bold"
                      color="primary.main"
                    >
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ width: "100%", mb: 3 }} />

        {/* Actions */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            sx={{
              px: 4,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
            }}
            onClick={() => navigate("/host/edit-profile")}
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={{
              px: 4,
              borderRadius: 3,
              textTransform: "none",
              fontWeight: 600,
            }}
            onClick={() => navigate("/host/listings")}
          >
            View Listings
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default HostProfile;
