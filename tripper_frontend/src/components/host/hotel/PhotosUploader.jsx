import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Stack, IconButton, FormHelperText } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { Delete } from "@mui/icons-material";

const PhotosUploader = () => {
  const {
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useFormContext();

  const photos = watch("photos") || [];
  const oldPhotos = watch("oldPhotos") || [];

  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);

  useEffect(() => {
    if (Array.isArray(oldPhotos) && oldPhotos.length !== existingPhotos.length) {
      setExistingPhotos(oldPhotos);
    }
  }, [oldPhotos]);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (validImages.length !== files.length) {
      setError("photos", { message: "Only image files are allowed" });
      return;
    }

    if (validImages.length === 0) {
      setError("photos", { message: "Please upload at least one image" });
      return;
    }

    clearErrors("photos");
    setValue("photos", validImages);

    const previews = validImages.map((file) => URL.createObjectURL(file));
    setPreviewUrls(previews);
  };

  const handleRemoveOldPhoto = (index) => {
    const updated = existingPhotos.filter((_, i) => i !== index);
    setExistingPhotos(updated);
    setValue("oldPhotos", updated);
  };

  const handleRemoveNewPhoto = (index) => {
    const updatedFiles = photos.filter((_, i) => i !== index);
    const updatedPreviews = previewUrls.filter((_, i) => i !== index);
    setValue("photos", updatedFiles);
    setPreviewUrls(updatedPreviews);

    if (updatedFiles.length === 0 && existingPhotos.length === 0) {
      setError("photos", { message: "Please upload at least one image" });
    }
  };

  return (
    <Box>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Upload Photos
      </Typography>

      <Button
        variant="contained"
        component="label"
        sx={{
          bgcolor: "#f27244",
          "&:hover": { bgcolor: "#034959" },
          borderRadius: 3,
          textTransform: "none",
          fontWeight: 600,
        }}
      >
        Select Images
        <input type="file" hidden multiple onChange={handleFileChange} />
      </Button>

      {errors.photos && (
        <FormHelperText error sx={{ mt: 1, fontSize: "0.9rem" }}>
          {errors.photos.message}
        </FormHelperText>
      )}

      {existingPhotos.length > 0 && (
        <>
          <Typography variant="subtitle1" mt={3} mb={1}>
            Existing Photos:
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {existingPhotos.map((url, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={url}
                  alt={`old-${index}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemoveOldPhoto(index)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "rgba(255,255,255,0.7)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </>
      )}

      {previewUrls.length > 0 && (
        <>
          <Typography variant="subtitle1" mt={3} mb={1}>
            New Photos:
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {previewUrls.map((url, index) => (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  width: 120,
                  height: 120,
                  borderRadius: 2,
                  overflow: "hidden",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={url}
                  alt={`new-${index}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleRemoveNewPhoto(index)}
                  sx={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    bgcolor: "rgba(255,255,255,0.7)",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.9)" },
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default PhotosUploader;
