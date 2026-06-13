import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  CircularProgress,
  Typography,
  Divider,
  Paper,
  Container,
  Button,
} from "@mui/material";
import experienceService from "../../../../services/experince.service";
import BasicInfoSection from "./EditSections/BasicInfoSection";
import ActivitiesSection from "./EditSections/ActivitiesSection";
import PhotosSection from "./EditSections/PhotosSection";
import DatesSection from "./EditSections/DatesSection";
import { ArrowBackIosNew } from "@mui/icons-material";

const EditExperiencePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperience = async () => {
      try {
        const data = await experienceService.getExperienceById(id);
        setExperience(data);
      } catch (err) {
        console.error("Failed to fetch experience:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperience();
  }, [id]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!experience) {
    return (
      <Box textAlign="center" mt={5}>
        <Typography variant="h6" color="error">
          Experience not found!
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 6, mb: 8 }}>
      <Box
        sx={{
          transition: "all 0.3s ease",
          opacity: loading ? 0 : 1,
          transform: loading ? "translateY(40px)" : "translateY(0)",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 4,
            backgroundColor: "#fff",
          }}
        >
          <Button
            startIcon={<ArrowBackIosNew />}
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              color: "#FF385C",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                bgcolor: "rgba(255,56,92,0.08)",
              },
            }}
          >
            Back
          </Button>
          <Typography variant="h4" fontWeight="bold" align="center" mb={2}>
            Edit Experience
          </Typography>

          {/* BASIC INFO SECTION */}
          <BasicInfoSection experience={experience} onUpdate={setExperience} />

          <Divider sx={{ my: 4 }} />

          {/* PHOTOS SECTION */}
          <PhotosSection experience={experience} onUpdate={setExperience} />

          <Divider sx={{ my: 4 }} />

          {/* ACTIVITIES SECTION */}
          <ActivitiesSection experience={experience} onUpdate={setExperience} />

          <Divider sx={{ my: 4 }} />

          {/* DATES SECTION */}
          <DatesSection experience={experience} onUpdate={setExperience} />
        </Paper>
      </Box>
    </Container>
  );
};

export default EditExperiencePage;
