import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
} from "@mui/material";
import { toast } from "react-hot-toast";
import experienceService from "../../../../../services/experince.service";
import { basicInfoUpdateSchema } from "../../../validation/experienceSchema";

const BasicInfoSection = ({ experience, onUpdate }) => {
  const [form, setForm] = useState({
    name: experience.name || "",
    description: experience.description || "",
    price: experience.price || 0,
    country: experience.address?.country || "",
    city: experience.address?.city || "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({}); 
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); 
    setIsDirty(true);
  };

  const handleSave = async () => {
    try {
      setErrors({});
      const basicInfoData = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        country: form.country,
        city: form.city,
      };

      
      await basicInfoUpdateSchema.validate(basicInfoData, {
        abortEarly: false,
      });

      setLoading(true);

      const updatedData = {
        ...basicInfoData,
        address: { country: form.country, city: form.city },
      };

      const res = await experienceService.updateExperience(
        experience._id,
        updatedData
      );

      onUpdate(res);
      toast.success("Basic info updated successfully!");
    } catch (err) {
      if (err.name === "ValidationError") {
        
        const fieldErrors = {};
        err.inner.forEach((e) => {
          fieldErrors[e.path] = e.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error(err);
        toast.error("Failed to update basic info.");
      }
    } finally {
      setLoading(false);
      setIsDirty(false);

    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" mb={2} gutterBottom>
          Basic Information
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Price"
              name="price"
              type="number"
              fullWidth
              value={form.price}
              onChange={handleChange}
              inputProps={{ min: 0 }}
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              fullWidth
              multiline
              rows={3}
              value={form.description}
              onChange={handleChange}
              error={!!errors.description}
              helperText={errors.description}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="Country"
              name="country"
              fullWidth
              value={form.country}
              onChange={handleChange}
              error={!!errors.country}
              helperText={errors.country}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <TextField
              label="City"
              name="city"
              fullWidth
              value={form.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city}
            />
          </Grid>
        </Grid>

        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={loading || !isDirty}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
