import React from "react";
import { Grid, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

const StepBasicInfo = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid container spacing={2}>
      {/* Experience Name */}
      <Grid item xs={12}>
        <TextField
          label="Experience Name"
          fullWidth
          placeholder="e.g. Desert Safari Adventure"
          {...register("name", {
            required: "Experience name is required",
            minLength: { value: 3, message: "Name must be at least 3 characters" },
          })}
          error={!!errors.name}
          helperText={errors.name?.message}
        />
      </Grid>

      {/* Description */}
      <Grid item xs={12}>
        <TextField
          label="Description"
          multiline
          rows={4}
          fullWidth
          placeholder="Describe the experience details..."
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description must be at least 10 characters",
            },
          })}
          error={!!errors.description}
          helperText={errors.description?.message}
        />
      </Grid>

      {/* Price */}
      <Grid item xs={6}>
        <TextField
          label="Price ($)"
          type="number"
          fullWidth
          placeholder="e.g. 100"
          inputProps={{ min: 1 }}
          {...register("price", {
            required: "Price is required",
            min: { value: 1, message: "Price must be greater than 0" },
          })}
          error={!!errors.price}
          helperText={errors.price?.message}
        />
      </Grid>

      {/* Country */}
      <Grid item xs={6}>
        <TextField
          label="Country"
          fullWidth
          placeholder="e.g. Egypt"
          {...register("country", {
            required: "Country is required",
            minLength: {
              value: 2,
              message: "Country must be at least 2 characters",
            },
          })}
          error={!!errors.country}
          helperText={errors.country?.message}
        />
      </Grid>

      {/* City */}
      <Grid item xs={6}>
        <TextField
          label="City"
          fullWidth
          placeholder="e.g. Cairo"
          {...register("city", {
            required: "City is required",
            minLength: {
              value: 2,
              message: "City must be at least 2 characters",
            },
          })}
          error={!!errors.city}
          helperText={errors.city?.message}
        />
      </Grid>
    </Grid>
  );
};

export default StepBasicInfo;
