import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Button,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Grid,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import hotelService from "../../services/hotels.service";
import experienceService from "../../services/experince.service";
import ListingCard from "../../components/host/ListingCard";

const MyListings = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    id: null,
  });

  const handleTabChange = (e, newValue) => setTab(newValue);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const data =
        tab === 0
          ? await hotelService.getHostHotels()
          : await experienceService.getHostExperiences();
      setListings(data);
    } catch (err) {
      console.error(err);
      toast.error("Error fetching listings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [tab]);

  const handleEdit = (listing) => {
    if (tab === 0) {
      navigate(`/host/hotels/edit/${listing._id}`);
    } else {
      navigate(`/host/experiences/update/${listing._id}`);
    }
  };

  const handleAddListing = () => {
    if (tab === 0) navigate("/host/add-hotel");
    else navigate("/host/experiences/add");
  };

  const handleOpenDialog = (id) => setDeleteDialog({ open: true, id });
  const handleCloseDialog = () => setDeleteDialog({ open: false, id: null });

  const confirmDelete = async () => {
    try {
      if (tab === 0) await hotelService.deleteHotel(deleteDialog.id);
      else await experienceService.deleteExperience(deleteDialog.id);

      setListings((prev) =>
        prev.filter((item) => item._id !== deleteDialog.id)
      );
      toast.success("Listing deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete listing");
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ color: "#034959" }}>
          My Listings
        </Typography>

        <Button
          variant="contained"
          onClick={handleAddListing}
          sx={{
            bgcolor: "#f27244",
            borderRadius: 3,
            px: 3,
            py: 1,
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "1rem",
            "&:hover": { bgcolor: "#034959" },
          }}
        >
          {tab === 0 ? "+ Add Hotel" : "+ Add Experience"}
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={handleTabChange}
        sx={{
          borderBottom: "1px solid #eee",
          mb: 4,
          "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
          "& .Mui-selected": { color: "#f27244 !important" },
          "& .MuiTabs-indicator": { backgroundColor: "#f27244" },
        }}
      >
        <Tab label="Hotels" />
        <Tab label="Experiences" />
      </Tabs>

      {/* Loading State */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "50vh",
            flexDirection: "column",
          }}
        >
          <CircularProgress sx={{ color: "#FF385C", mb: 2 }} />
          <Typography color="text.secondary">
            Loading your listings...
          </Typography>
        </Box>
      ) : listings.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ mt: 6 }}>
          You have no {tab === 0 ? "hotels" : "experiences"} yet.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {listings.map((listing) => (
            <ListingCard
              key={listing._id}
              listing={listing}
              onEdit={() => handleEdit(listing)}
              onDelete={() => handleOpenDialog(listing._id)}
            />
          ))}
        </Grid>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={handleCloseDialog}>
        <DialogTitle>
          {tab === 0 ? "Delete Hotel" : "Delete Experience"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {tab === 0
              ? "Are you sure you want to delete this hotel? This action cannot be undone."
              : "Are you sure you want to delete this experience? This action cannot be undone."}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            {tab === 0 ? "Delete " : "Delete "}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MyListings;




  
