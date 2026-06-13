import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from "react-hot-toast"; 
import experienceService from "../../../../../services/experince.service";

const PhotosSection = ({ experience, onUpdate }) => {
  const [images, setImages] = useState(experience.images || []);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    imageUrl: null,
  });

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(files);
  };

  const handleUpload = async () => {
    if (newImages.length === 0) {
      return toast.error("Please select images to upload.");
    }

    const formData = new FormData();
    newImages.forEach((file) => formData.append("images", file));

    try {
      setLoading(true);

      const res = await experienceService.addExperienceImages(
        experience._id,
        formData
      );

      const updatedImages = res.images;
      setImages(updatedImages);
      onUpdate({ ...experience, images: updatedImages });
      setNewImages([]);

      toast.success("Images uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload images.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteImage = (imageUrl) => {
    setDeleteDialog({ open: true, imageUrl });
  };

  const handleDeleteImage = async () => {
    const imageUrl = deleteDialog.imageUrl;
    try {
      setLoading(true);

      const updatedImages = images.filter((img) => img !== imageUrl);

      const res = await experienceService.updateExperience(experience._id, {
        images: updatedImages,
      });

      setImages(res.images);
      onUpdate(res);

      toast.success("Image removed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete image.");
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, imageUrl: null });
    }
  };

  return (
    <Card elevation={3} sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" mb={2} gutterBottom>
          Experience Photos
        </Typography>

        {/* existing images */}
        <Grid container spacing={2}>
          {images.length > 0 ? (
            images.map((img, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Box position="relative" sx={{ borderRadius: 2, overflow: "hidden" }}>
                  <img
                    src={img}
                    alt={`experience-${index}`}
                    width="100%"
                    height={160}
                    style={{ objectFit: "cover" }}
                  />
                  <IconButton
                    color="error"
                    onClick={() => confirmDeleteImage(img)}
                    sx={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      backgroundColor: "rgba(255,255,255,0.85)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
                    }}
                    size="small"
                    disabled={loading}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography color="text.secondary" sx={{ ml: 2 }}>
              No images uploaded yet.
            </Typography>
          )}
        </Grid>

        {/* upload new images */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Add New Photos
          </Typography>

          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={4}>
              <Button variant="outlined" component="label" fullWidth>
                Select Images
                <input type="file" multiple hidden onChange={handleFileChange} />
              </Button>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpload}
                disabled={loading || newImages.length === 0}
                fullWidth
                sx={{ py: 1.2 }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={22} sx={{ color: "#fff", mr: 1 }} />
                    Uploading...
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </Grid>
          </Grid>

          {newImages.length > 0 && (
            <Grid container spacing={2} mt={2}>
              {newImages.map((file, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Box
                    sx={{
                      border: "1px solid #ddd",
                      borderRadius: 2,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${index}`}
                      width="100%"
                      height={150}
                      style={{ objectFit: "cover" }}
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </CardContent>

      {/* Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, imageUrl: null })}
      >
        <DialogTitle>Confirm Image Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this image? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, imageUrl: null })}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteImage} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default PhotosSection;
