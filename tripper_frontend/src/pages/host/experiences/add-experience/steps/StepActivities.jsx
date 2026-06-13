import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Snackbar,
  Alert,
} from "@mui/material";
import { useFormContext } from "react-hook-form";

const StepActivities = () => {
  const { setValue } = useFormContext();

  const [activities, setActivities] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleAddActivity = () => {
    if (!title.trim() || title.length < 2) {
      return setSnackbar({
        open: true,
        message: "Title must be at least 2 characters",
        severity: "error",
      });
    }
    if (!description.trim() || description.length < 5) {
      return setSnackbar({
        open: true,
        message: "Description must be at least 5 characters",
        severity: "error",
      });
    }
    if (!image) {
      return setSnackbar({
        open: true,
        message: "Please upload an image",
        severity: "error",
      });
    }

    const newActivity = { title, description, image };
    setActivities((prev) => [...prev, newActivity]);
    setValue("activities", [...activities, newActivity]);

    // Reset form
    setTitle("");
    setDescription("");
    setImage(null);
    setPreview(null);
    setSnackbar({
      open: true,
      message: " Activity added successfully !",
      severity: "success",
    });
  };

  const handleDeleteActivity = (index) => {
    const updatedActivities = [...activities];
    updatedActivities.splice(index, 1);
    setActivities(updatedActivities);
    setValue("activities", updatedActivities);
  };

  return (
    <Box>
      <Typography variant="h6" mb={2} fontWeight="bold">
        Add Activities
      </Typography>

      <Box sx={{ mb: 3, p: 2, backgroundColor: "#f9f9f9", borderRadius: 2 }}>
        <TextField
          label="Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 2 }}>
          <Button variant="outlined" component="label" sx={{ flex: 1 }}>
            {image ? "Change Image" : "Upload Image"}
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </Button>

          <Button
            variant="contained"
            sx={{
              flex: 1,
              bgcolor: "#f27244",
              "&:hover": { bgcolor: "#e05f33" },
            }}
            onClick={handleAddActivity}
          >
            Add Activity
          </Button>
        </Box>

        {preview && (
          <Box sx={{ mt: 2 }}>
            <img
              src={preview}
              alt="preview"
              style={{
                width: "100%",
                height: 200,
                borderRadius: 8,
                objectFit: "cover",
              }}
            />
          </Box>
        )}
      </Box>

      <Typography variant="subtitle1" fontWeight="bold" mb={1}>
        Current Activities:
      </Typography>

      {activities.length === 0 ? (
        <Typography color="text.secondary">No activities yet.</Typography>
      ) : (
        <Grid container spacing={2}>
          {activities.map((a, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
                {a.image && (
                  <CardMedia
                    component="img"
                    image={URL.createObjectURL(a.image)}
                    sx={{ height: 140, objectFit: "cover" }}
                  />
                )}
                <CardContent>
                  <Typography fontWeight="bold">{a.title}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {a.description}
                  </Typography>
                  <Button
                    color="error"
                    size="small"
                    onClick={() => handleDeleteActivity(i)}
                    sx={{ textTransform: "none" }}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

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

export default StepActivities;
