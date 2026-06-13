import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Divider,
  Box,
  CircularProgress,
  Button,
} from "@mui/material";
import { ArrowBackIosNew } from "@mui/icons-material";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";

import { editHotelSchema } from "../validation/hotelSchema";
import ListingDetailsForm from "../../../components/host/hotel/ListingDetailsForm";
import AmenitiesForm from "../../../components/host/hotel/AmenitiesForm";
import PhotosUploader from "../../../components/host/hotel/PhotosUploader";
import RoomsForm from "../../../components/host/hotel/RoomsForm";
import SubmitSection from "../../../components/host/hotel/SubmitSection";
import HostLayout from "../../../components/host/HostLayout";
import hotelService from "../../../services/hotels.service";

const EditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasRooms, setHasRooms] = useState(false);
  const [originalPhotos, setOriginalPhotos] = useState([]);

  const methods = useForm({
    resolver: yupResolver(editHotelSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
      country: "",
      city: "",
      street: "",
      amenities: [],
      photos: [],
      oldPhotos: [],
      rooms: [],
    },
  });

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const hotel = await hotelService.getHotelById(id);

        
        const roomsExist = hotel.rooms && hotel.rooms.length > 0;
        setHasRooms(roomsExist);
        setOriginalPhotos(hotel.images || []);

        // normalize amenities
        let normalizedAmenities = [];
        (hotel.amenities || []).forEach((a) => {
          if (typeof a === "string") {
            try {
              const parsed = JSON.parse(a);
              if (Array.isArray(parsed))
                normalizedAmenities.push(...parsed.map((x) => x.toLowerCase()));
              else normalizedAmenities.push(a.trim().toLowerCase());
            } catch {
              normalizedAmenities.push(a.trim().toLowerCase());
            }
          }
        });

        methods.reset({
          title: hotel.name,
          description: hotel.description || "",
          price: roomsExist ? null : hotel.price || null,
          country: hotel.address?.country || "",
          city: hotel.address?.city || "",
          street: hotel.address?.street || "",
          amenities: normalizedAmenities,
          oldPhotos: hotel.images || [],
          photos: [],
          rooms: roomsExist ? hotel.rooms : [],
        });
      } catch {
        toast.error("Failed to load hotel data");
      } finally {
        setLoading(false);
      }
    };

    fetchHotel();
  }, [id, methods]);

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      const roomsExist = data.rooms && data.rooms.length > 0;

      const payload = {
        name: data.title,
        description: data.description,
        price: roomsExist ? 0 : Number(data.price),
        address: {
          country: data.country,
          city: data.city,
          street: data.street,
        },
        amenities: data.amenities,
        rooms: roomsExist ? data.rooms : [],
        images: data.oldPhotos,
      };

      await hotelService.updateHotel(id, payload);
      
    if (data.photos && data.photos.length > 0) {
      const formData = new FormData();
      data.photos.forEach((file) => {
        formData.append("images", file);
      });
      
      await hotelService.updateHotelImages(id, formData);
    }
      toast.success("Hotel updated successfully!");
      setTimeout(() => navigate("/host/listings"), 1200);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update hotel");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <HostLayout>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="70vh"
        >
          <CircularProgress />
        </Box>
      </HostLayout>
    );

  return (
    <HostLayout>
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{ p: { xs: 2, sm: 4 }, borderRadius: 4, position: "relative" }}
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
              "&:hover": { color: "#034959" },
            }}
          >
            Back
          </Button>

          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            textAlign="center"
            color="#034959"
          >
            ✏️ Edit Hotel
          </Typography>

          <Divider sx={{ mb: 4 }} />

          <FormProvider {...methods}>
            <Box
              component="form"
              onSubmit={methods.handleSubmit(onSubmit)}
              noValidate
            >
              <Paper sx={{ p: 3, mb: 3 }}>
                <ListingDetailsForm />
              </Paper>

              <Paper sx={{ p: 3, mb: 3 }}>
                <AmenitiesForm />
              </Paper>

              {methods.watch("rooms")?.length > 0 && (
                <Paper sx={{ p: 3, mb: 3 }}>
                  <RoomsForm showRooms={true} />
                </Paper>
              )}

              <Paper sx={{ p: 3, mb: 3 }}>
                <PhotosUploader />
              </Paper>

              <Box textAlign="center">
                <SubmitSection loading={saving} />
              </Box>
            </Box>
          </FormProvider>
        </Paper>
      </Container>
    </HostLayout>
  );
};

export default EditHotel;
