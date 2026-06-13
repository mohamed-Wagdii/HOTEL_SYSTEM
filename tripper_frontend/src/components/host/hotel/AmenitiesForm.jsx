import React, { useEffect, useState } from "react";
import {
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const AmenitiesForm = () => {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const selectedAmenities = watch("amenities") || [];
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const defaultAmenities = [
      "Free Wi-Fi",
      "Air Conditioning",
      "Swimming Pool",
      "Parking",
      "TV",
      "Kitchen",
      "Washer",
      "Pet Friendly",
      "Breakfast Included",
      "24/7 Support",
    ];
    setAmenities(defaultAmenities.map((a) => a.toLowerCase()));
    setLoading(false);
  }, []);

  const handleChange = (amenity) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setValue("amenities", updated, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <Box
      data-error-section="amenities"
      sx={{
        p: 2,
        borderRadius: 3,
        border: errors.amenities
          ? "1.5px solid #FF385C"
          : "1.5px solid rgba(0,0,0,0.1)",
        transition: "0.3s",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={1}
        display="flex"
        alignItems="center"
      >
        Amenities
        {errors.amenities && (
          <WarningAmberIcon sx={{ color: "#FF385C", fontSize: 22, ml: 1 }} />
        )}
      </Typography>

      {loading ? (
        <Box display="flex" justifyContent="center" py={3}>
          <CircularProgress size={24} />
        </Box>
      ) : (
        <>
          <FormGroup
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 1,
            }}
          >
            {amenities.map((amenity) => (
              <FormControlLabel
                key={amenity}
                control={
                  <Checkbox
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => handleChange(amenity)}
                  />
                }
                label={amenity.charAt(0).toUpperCase() + amenity.slice(1)}
              />
            ))}
          </FormGroup>

          {errors.amenities && (
            <Typography
              variant="body2"
              sx={{
                color: "#FF385C",
                fontSize: "0.875rem",
                mt: 1,
                display: "flex",
                alignItems: "center",
                gap: 0.5,
              }}
            >
              <WarningAmberIcon sx={{ fontSize: 18 }} />
              {errors.amenities?.message ||
                "Please select at least one amenity."}
            </Typography>
          )}
        </>
      )}
    </Box>
  );
};

export default AmenitiesForm;
