import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Button,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import experienceService from "../../../../../services/experince.service";
import toast from "react-hot-toast";

const DatesSection = ({ experience, onUpdate }) => {
  const [dates, setDates] = useState(experience.dates || []);
  const [newDate, setNewDate] = useState("");
  const [loading, setLoading] = useState(false);

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    index: null,
  });

  const handleAddDate = async () => {
    if (!newDate) {
      return toast.error("Please select a date.");
    }

    if (dates.includes(newDate)) {
      return toast("This date already exists.", {
        style: { background: "#fff7e6", color: "#000" },
      });
    }

    try {
      setLoading(true);
      const updatedDates = [...dates, newDate];

      const res = await experienceService.updateExperience(experience._id, {
        dates: updatedDates,
      });

      setDates(res.dates);
      setNewDate("");
      onUpdate(res);

      toast.success("Date added successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to add date.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteDate = (index) => {
    setDeleteDialog({ open: true, index });
  };

  const handleDeleteDate = async () => {
    const index = deleteDialog.index;
    try {
      setLoading(true);
      const updatedDates = dates.filter((_, i) => i !== index);

      const res = await experienceService.updateExperience(experience._id, {
        dates: updatedDates,
      });

      setDates(res.dates);
      onUpdate(res);

      toast.success("Date removed successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete date.");
    } finally {
      setLoading(false);
      setDeleteDialog({ open: false, index: null });
    }
  };

  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" fontWeight="bold" mb={2} gutterBottom>
          Experience Dates
        </Typography>

        {/* Current dates */}
        <Grid container spacing={2}>
          {dates.length > 0 ? (
            dates.map((date, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Box
                  sx={{
                    p: 2,
                    border: "1px solid #ddd",
                    borderRadius: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography fontWeight="bold">
                    {new Date(date).toLocaleDateString()}
                  </Typography>
                  <IconButton
                    color="error"
                    onClick={() => confirmDeleteDate(index)}
                    disabled={loading}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Grid>
            ))
          ) : (
            <Typography color="text.secondary" sx={{ ml: 2 }}>
              No dates available.
            </Typography>
          )}
        </Grid>

        {/* Add new date */}
        <Box mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="New Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleAddDate}
                disabled={loading}
                sx={{ height: "100%" }}
              >
                {loading ? "Adding..." : "Add Date"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </CardContent>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, index: null })}
      >
        <DialogTitle>Confirm Date Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this date? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, index: null })}
            color="primary"
          >
            Cancel
          </Button>
          <Button onClick={handleDeleteDate} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default DatesSection;
