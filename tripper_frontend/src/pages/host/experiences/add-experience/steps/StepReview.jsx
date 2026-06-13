import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
  Paper,
  Snackbar,
  Alert,
  Fade,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import experienceService from "../../../../../services/experince.service";
const StepReview = ({ experienceId }) => {
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (!experienceId) return;

    const fetchExperience = async () => {
      setLoading(true);
      try {
        const data = await experienceService.getExperienceById(experienceId);
        setExperience(data);
      } catch (err) {
        console.error(err);
        setSnackbar({
          open: true,
          message: "Failed to load experience details",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [experienceId]);

  const handleFinish = () => {
    setSnackbar({
      open: true,
      message: " Experience published successfully!",
      severity: "success",
    });
    setTimeout(() => navigate("/host/listings"), 2000);   
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress sx={{ color: "#f27244" }} />
      </Box>
    );

  if (!experience)
    return (
      <Typography color="text.secondary">No experience data found.</Typography>
    );

  return (
    <Fade in timeout={500}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          background: "#fff",
          boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h5" fontWeight="bold" color="#f27244" mb={2}>
           Review & Publish Your Experience
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {/*  Basic Info */}
        <Typography variant="h6" fontWeight="bold" mb={1}>
         <strong> Experience: </strong> {experience.name}
        </Typography>
        <Typography variant="body1" mb={2}>
         <strong>Description: </strong> {experience.description || "No description provided."}
        </Typography>
        <Typography variant="body2" mb={1}>
          <strong>Price: </strong> ${experience.price}
        </Typography>
        <Typography variant="body2" mb={3}>
          <strong>Location: </strong> {experience.address?.city}, {experience.address?.country}
        </Typography>

        {/* Photos */}
        {experience.images?.length > 0 && (
          <>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Photos:
            </Typography>
            <Grid container spacing={2} mb={3}>
              {experience.images.map((img, i) => (
                <Grid item xs={6} sm={4} md={3} key={i}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      transition: "0.3s",
                      "&:hover": { transform: "scale(1.03)" },
                    }}
                  >
                    <CardMedia
                      component="img"
                      image={img}
                      alt={`photo-${i}`}
                      sx={{ height: 150, objectFit: "cover" }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/*  Activities */}
        {experience.activities?.length > 0 && (
          <>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Activities:
            </Typography>
            <Grid container spacing={2} mb={3}>
              {experience.activities.map((a) => (
                <Grid item xs={12} sm={6} key={a._id}>
                  <Card
                    sx={{
                      borderRadius: 2,
                      overflow: "hidden",
                      height: "100%",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
                    }}
                  >
                    {a.image && (
                      <CardMedia
                        component="img"
                        image={a.image}
                        alt={a.title}
                        sx={{ height: 140, objectFit: "cover" }}
                      />
                    )}
                    <CardContent>
                      <Typography fontWeight="bold" mb={0.5}>
                        {a.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {a.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </>
        )}

        {/*  Dates */}
        {experience.dates?.length > 0 && (
          <>
            <Typography variant="subtitle1" fontWeight="bold" mb={1}>
              Available Dates:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {experience.dates.map((d, i) => (
                <Box
                  key={i}
                  sx={{
                    background: "#f2724415",
                    color: "#f27244",
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}
                >
                  {new Date(d).toLocaleDateString()}
                </Box>
              ))}
            </Box>
          </>
        )}

        {/*  Finish Button */}
        <Box sx={{ mt: 5, textAlign: "center" }}>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#f27244",
              "&:hover": { bgcolor: "#e05f33" },
              px: 5,
              py: 1.5,
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: 3,
              boxShadow: 3,
            }}
            onClick={handleFinish}
          >
            Finish & Publish Experience
          </Button>
        </Box>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </Fade>
  );
};

export default StepReview;
