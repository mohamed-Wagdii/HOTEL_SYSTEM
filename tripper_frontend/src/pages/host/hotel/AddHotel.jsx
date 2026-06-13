import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Box,
  Button,
  Tabs,
  Tab,
} from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import ListingDetailsForm from "../../../components/host/hotel/ListingDetailsForm";
import AmenitiesForm from "../../../components/host/hotel/AmenitiesForm";
import PhotosUploader from "../../../components/host/hotel/PhotosUploader";
import SubmitSection from "../../../components/host/hotel/SubmitSection";
import HostLayout from "../../../components/host/HostLayout";
import hotelService from "../../../services/hotels.service";
import { addHotelSchema } from "../validation/hotelSchema";
import RoomsForm from "../../../components/host/hotel/RoomsForm";

const AddHotel = () => {
  const methods = useForm({
    resolver: yupResolver(addHotelSchema),
    defaultValues: {
      type: "hotel",
      title: "",
      description: "",
      price: null, 
      country: "",
      city: "",
      street: "",
      amenities: [],
      starRating: 0,
      photos: [],
      rooms: [],
    },
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState(0);

  const tabToType = ["hotel", "villa", "apartment"];
  const tabTitles = ["🏨 Add Hotel", "🏡 Add Villa", "🏢 Add Apartment"];

  useEffect(() => {
    methods.setValue("type", tabToType[tab], { shouldValidate: true, shouldDirty: true });
  }, [tab, methods]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();

      formData.append("type", data.type);
      formData.append("name", data.title);
      formData.append("description", data.description);

    
      formData.append("price", data.type === "hotel" ? 0 : Number(data.price ?? 0));

      formData.append("address[country]", data.country || "Egypt");
      formData.append("address[city]", data.city || "Cairo");
      formData.append("address[street]", data.street || "Any Street");

      (data.amenities || []).forEach((item) => {
        formData.append("amenities[]", item);
      });

      (data.photos || []).forEach((file) => formData.append("images", file));

      if (data.type === "hotel" && data.rooms?.length > 0) {
        data.rooms.forEach((room, index) => {
          formData.append(`rooms[${index}][name]`, room.name);
          formData.append(`rooms[${index}][price]`, room.price);
          formData.append(`rooms[${index}][quantity]`, room.quantity);
          formData.append(`rooms[${index}][maxGuests]`, room.maxGuests);
        });
      }

      await hotelService.addHotel(formData);

      toast.success(`${data.type} added successfully!`);

      methods.reset(); 
      setTimeout(() => navigate("/host/listings"), 1200);
    } catch (err) {
      console.error("Add property error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to add listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <HostLayout>
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 4,
            position: "relative",
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

          {/* Dynamic Title */}
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            color="#034959"
          >
            {tabTitles[tab]}
          </Typography>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs value={tab} onChange={(e, v) => setTab(v)} centered>
              <Tab label="Hotel" />
              <Tab label="Villa" />
              <Tab label="Apartment" />
            </Tabs>
          </Box>

          <Divider sx={{ mb: 4 }} />

          <FormProvider {...methods}>
            <Box component="form" onSubmit={methods.handleSubmit(onSubmit)} noValidate>
              <Paper sx={{ p: 3, mb: 3 }}>
                <ListingDetailsForm />
              </Paper>

              <Paper sx={{ p: 3, mb: 3 }}>
                <AmenitiesForm />
              </Paper>

              {/* Only show rooms for Hotels */}
              {methods.watch("type") === "hotel" && (
                <Paper sx={{ p: 3, mb: 3 }}>
                  <RoomsForm />
                </Paper>
              )}

              <Paper sx={{ p: 3, mb: 3 }}>
                <PhotosUploader />
              </Paper>

              <Box textAlign="center">
                
                <SubmitSection loading={loading} />
              </Box>
            </Box>
          </FormProvider>
        </Paper>
      </Container>
    </HostLayout>
  );
};

export default AddHotel;
