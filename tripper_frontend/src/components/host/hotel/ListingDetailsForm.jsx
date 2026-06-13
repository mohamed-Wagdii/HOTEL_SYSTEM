import React from "react";
import { TextField, Grid } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";

const ListingDetailsForm = () => {
  const {
    register,
    watch,
    control,
    formState: { errors },
  } = useFormContext();

  const type = watch("type");
  const rooms = watch("rooms") || []; 

  return (
    <Grid container spacing={2}>
      {/* Title */}
      <Grid item xs={12}>
        <TextField
          label="Title"
          {...register("title")}
          fullWidth
          error={!!errors.title}
          helperText={errors.title?.message}
        />
      </Grid>

      {/* Price  */}
      {type !== "hotel" && rooms.length === 0 && (
        <Grid item xs={12} sm={6}>
          <Controller
            name="price"
            control={control}
            defaultValue={null}
            render={({ field }) => (
              <TextField
                {...field}
                label="Price"
                type="number"
                fullWidth
                error={!!errors.price}
                helperText={errors.price?.message}
                onChange={(e) =>
                  field.onChange(e.target.value === "" ? null : Number(e.target.value))
                }
                value={field.value ?? ""}
              />
            )}
          />
        </Grid>
      )}

      {/* Country */}
      <Grid item xs={12} sm={6}>
        <TextField label="Country" {...register("country")} fullWidth />
      </Grid>

      {/* City */}
      <Grid item xs={12} sm={6}>
        <TextField label="City" {...register("city")} fullWidth />
      </Grid>

      {/* Street */}
      <Grid item xs={12} sm={6}>
        <TextField label="Street" {...register("street")} fullWidth />
      </Grid>

      {/* Description */}
      <Grid item xs={12}>
        <TextField
          label="Description"
          {...register("description")}
          multiline
          minRows={4}
          fullWidth
          error={!!errors.description}
          helperText={errors.description?.message}
        />
      </Grid>
    </Grid>
  );
};
export default ListingDetailsForm;