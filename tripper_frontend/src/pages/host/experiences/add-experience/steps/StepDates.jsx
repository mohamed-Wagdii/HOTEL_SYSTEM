import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Stack,
  Snackbar,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import experienceService from "../../../../../services/experince.service";

const StepDates = ({ experienceId }) => {
  const [dates, setDates] = useState([]);
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    dateToDelete: null,
  });

  useEffect(() => {
    const fetchDates = async () => {
      if (!experienceId) return;
      try {
        const experience = await experienceService.getExperienceById(experienceId);
        setDates(experience.dates || []);
      } catch (err) {
        console.error(err);
        showSnackbar("Failed to load dates", "error");
      }
    };
    fetchDates();
  }, [experienceId]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAddDate = async () => {
    if (!newDate || !experienceId) return;
    setLoading(true);
    try {
      const res = await experienceService.addDate(experienceId, newDate);
      setDates(res.dates || []);
      setNewDate("");
      showSnackbar("Date added successfully!");
    } catch (err) {
      console.error(err);
      showSnackbar("Error adding date", "error");
    } finally {
      setLoading(false);
    }
  };

  
  const confirmDeleteDate = (date) => {
    setConfirmDialog({ open: true, dateToDelete: date });
  };


  const handleConfirmDelete = async () => {
    const date = confirmDialog.dateToDelete;
    if (!date) return;

    setLoading(true);
    try {
      const res = await experienceService.removeDate(experienceId, date);
      setDates(res.dates || []);
      showSnackbar("Date removed successfully!");
    } catch (err) {
      console.error(err);
      showSnackbar("Error removing date", "error");
    } finally {
      setLoading(false);
      setConfirmDialog({ open: false, dateToDelete: null });
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" color="#f27244" mb={3}>
        Available Dates
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={8}>
          <TextField
            label="Select a date"
            type="date"
            fullWidth
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#f27244",
              "&:hover": { bgcolor: "#e05f33" },
              fontWeight: "bold",
              py: 1.5,
            }}
            onClick={handleAddDate}
            disabled={loading || !newDate}
          >
            {loading ? <CircularProgress size={22} sx={{ color: "white" }} /> : "Add Date"}
          </Button>
        </Grid>
      </Grid>

      <Stack spacing={2} mt={4}>
        {dates.length === 0 ? (
          <Paper
            elevation={1}
            sx={{ p: 3, textAlign: "center", borderRadius: 2, background: "#f9f9f9" }}
          >
            <Typography color="text.secondary">
              No dates added yet. Start by adding one above!
            </Typography>
          </Paper>
        ) : (
          dates.map((d, i) => (
            <Paper
              key={i}
              elevation={1}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: 2,
              }}
            >
              <Typography fontWeight="bold">
                {new Date(d).toLocaleDateString()}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={() => confirmDeleteDate(d)}
                disabled={loading}
              >
                Remove
              </Button>
            </Paper>
          ))
        )}
      </Stack>

      {/*  Dialog  */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, dateToDelete: null })}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>{new Date(confirmDialog.dateToDelete).toLocaleDateString()}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ open: false, dateToDelete: null })}
            color="inherit"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            sx={{
              bgcolor: "#f27244",
              "&:hover": { bgcolor: "#e05f33" },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default StepDates;
