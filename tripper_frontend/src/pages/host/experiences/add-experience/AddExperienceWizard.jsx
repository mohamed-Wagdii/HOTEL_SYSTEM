import React, { useState } from "react";
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  Fade,
} from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { experienceSchema } from "../../validation/experienceSchema";
import experienceService from "../../../../services/experince.service";

// Steps
import StepBasicInfo from "./steps/StepBasicInfo";
import StepPhotos from "./steps/StepPhotos";
import StepActivities from "./steps/StepActivities";
import StepDates from "./steps/StepDates";
import StepReview from "./steps/StepReview";
import { useNavigate } from "react-router-dom";
import { ArrowBackIosNew } from "@mui/icons-material";

const steps = ["Basic Info", "Photos", "Activities", "Dates", "Review"];

const AddExperienceWizard = () => {
  const methods = useForm({
    resolver: yupResolver(experienceSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      country: "",
      city: "",
      photos: [],
      activities: [],
      dates: [],
    },
  });

  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [experienceId, setExperienceId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const { trigger, getValues } = methods;

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const saveActivities = async (activities) => {
    try {
      const uploadPromises = activities.map((act) => {
        const formData = new FormData();
        formData.append("title", act.title);
        formData.append("description", act.description);
        formData.append("image", act.image);

        return experienceService.addActivity(experienceId, formData);
      });

      await Promise.all(uploadPromises);
      showSnackbar(" All activities saved successfully!", "success");
    } catch (err) {
      console.error(err);
      showSnackbar(" Error saving activities", "error");
      throw err;
    }
  };

  const handleNext = async () => {
    const data = getValues();
    let valid = true;

    try {
      switch (activeStep) {
        case 0:
          valid = await trigger([
            "name",
            "description",
            "price",
            "country",
            "city",
          ]);
          break;

        case 1:
          valid = await trigger("photos");
          if (!data.photos || data.photos.length === 0) {
            valid = false;
            showSnackbar(" Please upload at least one photo", "error");
          }
          break;

        case 2:
          if (!data.activities || data.activities.length === 0) {
            showSnackbar(" Please add at least one activity", "error");
            return;
          }

          setLoading(true);
          await saveActivities(data.activities);
          setActiveStep((prev) => prev + 1);
          return;

        case 3:
          valid = await trigger("dates");
          break;

        default:
          break;
      }

      if (!valid) return;

      if (activeStep === 1) {
        await handleCreateExperience();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } catch (err) {
      console.error(err);
      showSnackbar(" Something went wrong, please try again", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleCreateExperience = async () => {
    const data = getValues();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("address[country]", data.country);
      formData.append("address[city]", data.city);
      data.photos.forEach((file) => formData.append("images", file));

      const newExperience = await experienceService.addExperience(formData);
      setExperienceId(newExperience._id);

      showSnackbar("Basic info & photos saved successfully!", "success");
      setActiveStep((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      showSnackbar("Error creating experience. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <Fade in timeout={500}>
        <Paper
          elevation={4}
          sx={{
            position: "relative",
            width: "100%",
            p: 4,
            borderRadius: 4,
            backgroundColor: "#fff",
            maxWidth: "900px",
            margin: "40px auto",
          }}
        >
          <Button
            startIcon={<ArrowBackIosNew />}
            onClick={() => navigate(-1)}
            sx={{
              position: "absolute",
              top: 20,
              left: 20,
              color: "#f27244",
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                color: "#034959",
              },
            }}
          >
            Back
          </Button>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            mb={4}
            color="#034959"
          >
            Add New Experience
          </Typography>

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{
              "& .MuiStepLabel-label": { fontWeight: "bold" },
              "& .MuiStepIcon-root.Mui-active": { color: "#f27244" },
              "& .MuiStepIcon-root.Mui-completed": { color: "#f27244" },
            }}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box
            sx={{
              mt: 5,
              minHeight: 360,
              px: { xs: 1, md: 3 },
              transition: "all 0.3s ease",
            }}
          >
            {activeStep === 0 && <StepBasicInfo />}
            {activeStep === 1 && <StepPhotos />}
            {activeStep === 2 && <StepActivities experienceId={experienceId} />}
            {activeStep === 3 && <StepDates experienceId={experienceId} />}
            {activeStep === 4 && <StepReview experienceId={experienceId} />}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent:
                activeStep === 0
                  ? "flex-end"
                  : activeStep === steps.length - 1
                  ? "center"
                  : "space-between",
              mt: 5,
              pt: 3,
              borderTop: "1px solid #eee",
            }}
          >
            {activeStep > 0 && (
              <Button
                onClick={handleBack}
                variant="outlined"
                sx={{
                  px: 4,
                  fontWeight: "bold",
                  borderColor: "#f27244",
                  color: "#f27244",
                  "&:hover": { borderColor: "#e05f33", color: "#e05f33" },
                }}
                disabled={loading}
              >
                Back
              </Button>
            )}

            {activeStep < steps.length - 1 && (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#f27244",
                  "&:hover": { backgroundColor: "#e05f33" },
                  px: 4,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  boxShadow: 3,
                }}
                onClick={handleNext}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={22} sx={{ color: "white" }} />
                ) : (
                  "Next"
                )}
              </Button>
            )}
          </Box>

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
    </FormProvider>
  );
};

export default AddExperienceWizard;
