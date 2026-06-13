import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Chip,
  Grid,
  useTheme,
  alpha,
} from "@mui/material";
import { 
  Close as CloseIcon, 
  CheckCircle as CheckCircleIcon,
  ChevronLeft,
  ChevronRight,
} from "@mui/icons-material";
import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { format, addMonths, subMonths, isSameDay, isWithinInterval, isBefore, isAfter, startOfDay } from 'date-fns';
import axiosInstance from "../../axiousInstance/axoiusInstance";

// Integrated Calendar Component
const BookingCalendar = ({ availableDates = [], onDateSelect, selectedRange }) => {
  const theme = useTheme();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoveredDate, setHoveredDate] = useState(null);

  const isDateAvailable = (date) => {
    // Normalize the date to start of day for accurate comparison
    const checkDate = startOfDay(date);
    
    // If loading or no data yet, disable all dates
    if (availableDates.length === 0) return false;
    
    // Check if date falls within any available range
    return availableDates.some(range => {
      const rangeStart = startOfDay(range.start);
      const rangeEnd = startOfDay(range.end);
      
      // Date must be >= start and <= end (inclusive on both sides)
      return (
        (isAfter(checkDate, rangeStart) || isSameDay(checkDate, rangeStart)) &&
        (isBefore(checkDate, rangeEnd) || isSameDay(checkDate, rangeEnd))
      );
    });
  };

  const isDateSelected = (date) => {
    if (!selectedRange.start) return false;
    if (selectedRange.end) {
      return isWithinInterval(date, { 
        start: selectedRange.start, 
        end: selectedRange.end 
      });
    }
    return isSameDay(date, selectedRange.start);
  };

  const isStartDate = (date) => {
    return selectedRange.start && isSameDay(date, selectedRange.start);
  };

  const isEndDate = (date) => {
    return selectedRange.end && isSameDay(date, selectedRange.end);
  };

  const isInSelectionRange = (date) => {
    if (!selectedRange.start || !hoveredDate || selectedRange.end) return false;
    
    const start = selectedRange.start;
    const end = hoveredDate;
    
    return isWithinInterval(date, {
      start: start < end ? start : end,
      end: start < end ? end : start
    });
  };

  const handleDateClick = (date) => {
    const normalizedDate = startOfDay(date);
    
    if (!isDateAvailable(normalizedDate)) return;

    if (!selectedRange.start || (selectedRange.start && selectedRange.end)) {
      // First click or restart selection
      onDateSelect({ start: normalizedDate, end: null });
    } else {
      // Second click - set end date
      if (isBefore(normalizedDate, selectedRange.start)) {
        // If clicked date is before start, swap them
        onDateSelect({ start: normalizedDate, end: selectedRange.start });
      } else {
        // Normal case: clicked date is after start
        onDateSelect({ start: selectedRange.start, end: normalizedDate });
      }
    }
  };

  const handleDateHover = (date) => {
    if (selectedRange.start && !selectedRange.end) {
      setHoveredDate(date);
    }
  };

  const navigateMonths = (direction) => {
    setCurrentMonth(current => 
      direction === 'next' ? addMonths(current, 1) : subMonths(current, 1)
    );
  };

  const CustomDay = (props) => {
    const { day, outsideCurrentMonth, ...other } = props;
    const date = day;
    const available = isDateAvailable(date);
    const selected = isDateSelected(date);
    const isStart = isStartDate(date);
    const isEnd = isEndDate(date);
    const inSelectionRange = isInSelectionRange(date);
    const isToday = isSameDay(date, new Date());

    return (
      <Box
        {...other}
        sx={{
          position: 'relative',
          height: 40,
          width: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: available ? 'pointer' : 'not-allowed',
          opacity: outsideCurrentMonth ? 0.3 : 1,
          '&:hover': {
            backgroundColor: available ? alpha(theme.palette.primary.main, 0.1) : 'transparent',
            borderRadius: '50%'
          },
          ...(inSelectionRange && {
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
          }),
          ...(isStart && !isEnd && inSelectionRange && {
            borderTopRightRadius: 0,
            borderBottomRightRadius: 0
          }),
          ...(isEnd && !isStart && inSelectionRange && {
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0
          }),
          ...(inSelectionRange && !isStart && !isEnd && {
            borderRadius: 0
          })
        }}
        onClick={() => handleDateClick(date)}
        onMouseEnter={() => handleDateHover(date)}
      >
        <Box
          sx={{
            height: 36,
            width: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            position: 'relative',
            zIndex: 1,
            ...(selected && {
              backgroundColor: '#f27244',
              color: '#fff',
              fontWeight: 'bold'
            }),
            ...(isToday && !selected && {
              border: `2px solid ${theme.palette.text.primary}`
            }),
            ...(!available && {
              color: theme.palette.text.disabled,
              textDecoration: 'line-through'
            })
          }}
        >
          {format(date, 'd')}
        </Box>
        
        {inSelectionRange && (isStart || isEnd) && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: isStart ? '50%' : 0,
              right: isEnd ? '50%' : 0,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              zIndex: 0
            }}
          />
        )}
      </Box>
    );
  };

  return (
    <Box>
      {/* Calendar Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton onClick={() => navigateMonths('prev')}>
          <ChevronLeft />
        </IconButton>
        
        <Box sx={{ display: 'flex', gap: 6 }}>
          <Typography variant="h6" fontWeight="600">
            {format(currentMonth, 'MMMM yyyy')}
          </Typography>
          <Typography variant="h6" fontWeight="600">
            {format(addMonths(currentMonth, 1), 'MMMM yyyy')}
          </Typography>
        </Box>

        <IconButton onClick={() => navigateMonths('next')}>
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Calendar Grid */}
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <DateCalendar
            value={null}
            onChange={() => {}}
            referenceDate={currentMonth}
            reduceAnimations
            slots={{ day: CustomDay }}
            sx={{
              width: '100%',
              '& .MuiDayCalendar-header': {
                justifyContent: 'space-around',
                '& .MuiDayCalendar-weekDayLabel': {
                  height: 40,
                  width: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 500,
                  color: theme.palette.text.secondary
                }
              },
              '& .MuiDayCalendar-monthContainer': {
                '& .MuiDayCalendar-weekContainer': {
                  justifyContent: 'space-around'
                }
              }
            }}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <DateCalendar
            value={null}
            onChange={() => {}}
            referenceDate={addMonths(currentMonth, 1)}
            reduceAnimations
            slots={{ day: CustomDay }}
            sx={{
              width: '100%',
              '& .MuiDayCalendar-header': {
                justifyContent: 'space-around',
                '& .MuiDayCalendar-weekDayLabel': {
                  height: 40,
                  width: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 500,
                  color: theme.palette.text.secondary
                }
              },
              '& .MuiDayCalendar-monthContainer': {
                '& .MuiDayCalendar-weekContainer': {
                  justifyContent: 'space-around'
                }
              }
            }}
          />
        </Grid>
      </Grid>

      {/* Clear dates button */}
      {selectedRange.start && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <Button
            onClick={() => onDateSelect({ start: null, end: null })}
            sx={{ 
              color: 'text.secondary',
              textTransform: 'none',
              '&:hover': {
                color: 'text.primary',
              }
            }}
          >
            Clear dates
          </Button>
        </Box>
      )}
    </Box>
  );
};

// Main Booking Component
export default function BookingBox({ place, model }) {
  const [open, setOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomCount, setRoomCount] = useState(1);
  const [guests, setGuests] = useState(1);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [availableDates, setAvailableDates] = useState([]);

  const [bookingForSelf, setBookingForSelf] = useState(true);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const steps = ["Place & Room Details", "Guest Information", "Confirmation"];

  // Fetch available dates from API
  const fetchAvailableDates = async (hotelId, roomId = null) => {
    try {
      const params = new URLSearchParams({ hotelId });
      if (roomId) params.append('roomId', roomId);
      
      const res = await axiosInstance.get(`/api/reservations/availableDates?${params}`);
      
      // The API returns an array of ranges: [{ start, end }, ...]
      // Convert date strings to Date objects and normalize times
      const ranges = res.data.map(range => ({
        start: startOfDay(new Date(range.start)),
        end: startOfDay(new Date(range.end))
      }));
      
      return ranges;
    } catch (err) {
      console.error("Error fetching available dates:", err);
      return [];
    }
  };

  useEffect(() => {
    if (open && place?._id) {
      const loadDates = async () => {
        setAvailableDates([]); // Clear old data
        const roomIdToFetch = selectedRoom?._id || null;
        const ranges = await fetchAvailableDates(place._id, roomIdToFetch);
        setAvailableDates(ranges);
      };
      loadDates();
    }
  }, [open, place?._id, selectedRoom?._id]);

  const handleDateSelect = (range) => {
    setSelectedRange(range);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (!selectedRange.start || !selectedRange.end) {
        setMessage("Please select check-in and check-out dates");
        return;
      }
      if (!selectedRoom && place.rooms && place.rooms.length > 0) {
        setMessage("Please select a room");
        return;
      }
    } else if (activeStep === 1 && !bookingForSelf) {
      if (!guestName || !guestPhone) {
        setMessage("Please fill all guest details");
        return;
      }
    }
    setMessage("");
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setMessage("");
  };

  const handleReserve = async () => {
    if(JSON.parse(localStorage.getItem("user"))===null){
      setMessage("Please login to make a reservation.");
      return;
    }
    try {  
      if (!bookingForSelf) {
        if (!guestName || !guestPhone) {
          setMessage("Please fill all guest details before confirming.");
          return;
        }
      }
      
      setLoading(true);
      setMessage("");

      const checkIn = selectedRange.start;
      const checkOut = selectedRange.end;

      let payload = {
        guestsCount: guests,
        roomCount: 1,
      };

      if (model.toLowerCase() === "hotel") {
        payload.hotelId = place._id;
        if (selectedRoom) {
          payload.roomId = selectedRoom._id;
          payload.roomCount = roomCount;
        }
        payload.checkIn = checkIn;
        payload.checkOut = checkOut;
      } else if (model.toLowerCase() === "experiance") {
        payload.experienceId = place._id;
        payload.checkIn = checkIn;
        payload.checkOut = null;
      }

      if (!bookingForSelf) {
        payload.guestData = {
          name: guestName,
          email: guestEmail,
          phone: guestPhone,
        };
      }

      const res = await axiosInstance.post("/api/reservations", payload);
      console.log("Reservation created:", res.data);
      setLoading(false);
      
      // For experience, show success message
      if (model.toLowerCase() === "experiance") {
        setMessage("✅ Reservation created successfully.");
      } else {
        // For hotel, move to success step in wizard
        handleNext();
      }
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.message || "❌ Failed to create reservation.");
      setLoading(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setActiveStep(0);
    setMessage("");
    setSelectedRange({ start: null, end: null });
    setSelectedRoom(null);
    setBookingForSelf(true);
    setGuestName("");
    setGuestEmail("");
    setGuestPhone("");
  };

  const formatDate = (date) => {
    if (!date) return "";
    return format(date, 'MMM d, yyyy');
  };

  const calculateNights = () => {
    if (selectedRange.start && selectedRange.end) {
      return Math.ceil((selectedRange.end - selectedRange.start) / (1000 * 60 * 60 * 24));
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    const pricePerNight = selectedRoom?.price || place.price;
    return nights * pricePerNight * roomCount;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 4 }}>
        {/* Floating Book Button */}
        <Button
          variant="contained"
          size="large"
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            py: 1.5,
            px: 4,
            borderRadius: 3,
            backgroundColor: "#f27244",
            fontWeight: 600,
            textTransform: "none",
            fontSize: "1.1rem",
            boxShadow: "0 4px 12px rgba(242, 114, 68, 0.4)",
            "&:hover": { 
              backgroundColor: "#034959",
              boxShadow: "0 6px 16px rgba(3, 73, 89, 0.4)",
            },
            zIndex: 1000,
          }}
        >
          Book Now
        </Button>

        {/* Booking Wizard Dialog */}
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              minHeight: "600px",
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h5" fontWeight={700}>
                Book Your Stay
              </Typography>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Stepper activeStep={activeStep} sx={{ mt: 2 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </DialogTitle>

          <DialogContent>
            {/* Step 1: Place & Room Details */}
            {activeStep === 0 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  {place.name} - {place.address.city}, {place.address.country}
                </Typography>
                {place.rooms.length <= 0 && (
                  <Typography variant="h6" fontWeight={600} sx={{ mb: 2, color: "blue" }}>
                    {place.price}$ For One Night
                  </Typography>
                )}
                
                {/* Room Selection */}
                {place.rooms && place.rooms.length > 0 && (
                  <>
                    <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                      Available Rooms
                    </Typography>
                    
                    {place.rooms.map((room) => (
                      <Card
                        key={room._id}
                        sx={{
                          mb: 2,
                          cursor: "pointer",
                          border: selectedRoom?._id === room._id ? "2px solid #f27244" : "1px solid #e0e0e0",
                          transition: "all 0.3s",
                          "&:hover": {
                            boxShadow: 3,
                          }
                        }}
                        onClick={() => {
                          setSelectedRoom(room);
                          //console.log(selectedRoom);
                          
                          setSelectedRange({ start: null, end: null });
                        }}
                      >
                        <CardContent>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" fontWeight={600}>
                                {room.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {room.description}
                              </Typography>
                              <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                                {room.price} ج.م <Typography component="span" variant="body2">/ night</Typography>
                              </Typography>
                            </Box>
                            <Radio checked={selectedRoom?._id === room._id} />
                          </Box>
                        </CardContent>
                      </Card>
                    ))}

                    <Grid container spacing={2} sx={{ mt: 2, mb: 3 }}>
                      {
                        <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          label="Number of Rooms"
                          value={roomCount}
                          onChange={(e) => setRoomCount(Number(e.target.value))}
                          fullWidth
                        >
                          {[1, 2, 3, 4, 5].map((num) => (
                            <MenuItem key={num} value={num}>
                              {num} {num === 1 ? "room" : "rooms"}
                            </MenuItem>
                          ))}
                          </TextField>
                        </Grid>}
                      <Grid item xs={12} sm={6}>
                        <TextField
                          select
                          label="Number of Guests"
                          value={guests}
                          onChange={(e) => setGuests(Number(e.target.value))}
                          fullWidth
                        >
                          {selectedRoom &&
                            Array.from({ length: selectedRoom.maxGuests }, (_, i) => i + 1).map(
                              (num) => (
                                <MenuItem key={num} value={num}>
                                  {num} {num === 1 ? "guest" : "guests"}
                                </MenuItem>
                              )
                            )}
                        </TextField>
                      </Grid>

                    </Grid>
                  </>
                )}

                {/* Date Selection with Calendar */}
                <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 2 }}>
                  Select Your Dates
                </Typography>

                {availableDates.length === 0 && (
                  <Paper sx={{ p: 2, mb: 2, backgroundColor: "#fff3e0" }}>
                    <Typography variant="body2" color="text.secondary">
                      Loading available dates...
                    </Typography>
                  </Paper>
                )}
                
                <Paper sx={{ p: 2, mb: 2, backgroundColor: "#f5f5f5" }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Selected Dates:
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {selectedRange.start && selectedRange.end
                      ? `${formatDate(selectedRange.start)} - ${formatDate(selectedRange.end)}`
                      : selectedRange.start
                      ? `${formatDate(selectedRange.start)} - Select checkout date`
                      : "Click on calendar to select dates"}
                  </Typography>
                </Paper>

                <BookingCalendar
                  availableDates={availableDates}
                  onDateSelect={handleDateSelect}
                  selectedRange={selectedRange}
                />

                {/* Show total when dates are selected */}
                {selectedRange.start && selectedRange.end && (
                  <Paper sx={{ p: 2, mt: 3, backgroundColor: "#e8f5e9" }}>
                    <Typography variant="h6" fontWeight={600}>
                      Total: {calculateTotal().toLocaleString()} ج.م
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {calculateNights()} {calculateNights() === 1 ? "night" : "nights"} × {roomCount} {roomCount === 1 ? "room" : "rooms"}
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}

            {/* Step 2: Guest Information */}
            {activeStep === 1 && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
                  Guest Information
                </Typography>

                <FormControl component="fieldset" sx={{ mb: 3 }}>
                  <RadioGroup
                    value={bookingForSelf ? "self" : "other"}
                    onChange={(e) => setBookingForSelf(e.target.value === "self")}
                  >
                    <FormControlLabel
                      value="self"
                      control={<Radio />}
                      label="I'm booking for myself"
                    />
                    <FormControlLabel
                      value="other"
                      control={<Radio />}
                      label="I'm booking for someone else"
                    />
                  </RadioGroup>
                </FormControl>

                {!bookingForSelf && (
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                      label="Guest Full Name"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      fullWidth
                      required
                    />
                    <TextField
                      label="Guest Email"
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      fullWidth
                    />
                    <TextField
                      label="Guest Phone Number"
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      fullWidth
                      required
                    />
                  </Box>
                )}

                {bookingForSelf && (
                  <Paper sx={{ p: 3, backgroundColor: "#e8f5e9", textAlign: "center" }}>
                    <CheckCircleIcon sx={{ fontSize: 48, color: "#4caf50", mb: 1 }} />
                    <Typography variant="body1" color="text.secondary">
                      The reservation will be made under your account
                    </Typography>
                  </Paper>
                )}
              </Box>
            )}

            {/* Step 3: Success */}
            {activeStep === 2 && (
              <Box sx={{ mt: 4, textAlign: "center", py: 4 }}>
                <CheckCircleIcon sx={{ fontSize: 80, color: "#4caf50", mb: 2 }} />
                <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
                  Reservation Successful!
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  Your reservation has been confirmed.
                </Typography>
                
                <Paper sx={{ p: 3, maxWidth: 400, mx: "auto", textAlign: "left" }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Booking Details
                  </Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    <strong>Place:</strong> {place.name}
                  </Typography>
                  {selectedRoom && (
                    <Typography variant="body1">
                      <strong>Room:</strong> {selectedRoom.name}
                    </Typography>
                  )}
                  <Typography variant="body1">
                    <strong>Check-in:</strong> {formatDate(selectedRange.start)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Check-out:</strong> {formatDate(selectedRange.end)}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Guests:</strong> {guests}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 2, color: "#f27244" }}>
                    <strong>Total:</strong> {calculateTotal().toLocaleString()} ج.م
                  </Typography>
                </Paper>

                <Button
                  variant="contained"
                  onClick={handleClose}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    px: 4,
                    borderRadius: 3,
                    backgroundColor: "#f27244",
                    "&:hover": { backgroundColor: "#034959" },
                  }}
                >
                  Close
                </Button>
              </Box>
            )}

            {message && (
              <Typography
                variant="body2"
                textAlign="center"
                sx={{ mt: 2, color: message.includes("✅") ? "green" : "red" }}
              >
                {message}
              </Typography>
            )}

            {/* Navigation Buttons */}
            {activeStep < 2 && (
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  sx={{ textTransform: "none" }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  onClick={activeStep === 1 ? handleReserve : handleNext}
                  disabled={loading}
                  sx={{
                    py: 1.2,
                    px: 4,
                    borderRadius: 3,
                    backgroundColor: "#f27244",
                    textTransform: "none",
                    "&:hover": { backgroundColor: "#034959" },
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : activeStep === 1 ? (
                    "Confirm Reservation"
                  ) : (
                    "Next"
                  )}
                </Button>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}