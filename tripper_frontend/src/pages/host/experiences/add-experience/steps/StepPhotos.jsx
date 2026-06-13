import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  Typography,
  Grid,
  Card,
  CardMedia,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { useFormContext } from "react-hook-form";

const StepPhotos = () => {
  const { setValue } = useFormContext();
  const [previewUrls, setPreviewUrls] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const fileInputRef = useRef(null);
   
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newUrls = files.map((file) => URL.createObjectURL(file));
    setValue("photos", files);
    setPreviewUrls(newUrls);

         
    e.target.value = "";

    setSnackbar({
      open: true,
      message: `${files.length} photo${files.length > 1 ? "s" : ""} selected`,
      severity: "success",
    });
  };

  const handleRemovePhoto = (index) => {
    setPreviewUrls((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      setValue("photos", updated);
      return updated;
    });
    setSnackbar({
      open: true,
      message: "Photo removed successfully",
      severity: "info",
    });
  };

  
  const handleClearAll = () => {
    setValue("photos", []);
    setPreviewUrls([]);
    setSnackbar({
      open: true,
      message: "All photos cleared",
      severity: "warning",
    });
  };

  return (
    <Box
      sx={{
        p: 3,
        backgroundColor: "#fafafa",
        borderRadius: 3,
        boxShadow: 1,
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={3}
        textAlign="center"
        color="#f27244"
      >
        Upload Experience Photos
      </Typography>

      {/* Upload & Clear Buttons */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          component="label"
          sx={{
            bgcolor: "#f27244",
            "&:hover": { bgcolor: "#e05f33" },
            textTransform: "none",
          }}
        >
          Choose Images
          <input
            type="file"
            hidden
            multiple
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </Button>

        {previewUrls.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            sx={{ textTransform: "none" }}
            onClick={handleClearAll}
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* Preview */}
      {previewUrls.length > 0 ? (
        <Grid container spacing={2} justifyContent="center">
          {previewUrls.map((url, idx) => (
            <Grid item xs={6} sm={4} md={3} key={idx}>
              <Box sx={{ position: "relative" }}>
                <Card
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 2,
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.05)" },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={url}
                    alt={`preview-${idx}`}
                    sx={{ height: 160, objectFit: "cover" }}
                  />
                </Card>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemovePhoto(idx)}
                  sx={{
                    position: "absolute",
                    top: 6,
                    right: 6,
                    bgcolor: "white",
                    boxShadow: 1,
                    "&:hover": { bgcolor: "#ffe5e5" },
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography
          color="text.secondary"
          textAlign="center"
          sx={{ mt: 3, fontStyle: "italic" }}
        >
          No photos selected yet.
        </Typography>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StepPhotos;
