import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Box,
  Container,
  Grid,
  Divider,
  Paper
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';

const HotelBookingFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    checkIn: '2024-01-15',
    checkOut: '2024-01-18',
    guests: 2,
    roomType: 'Deluxe Room',
    totalPrice: 450,
    taxes: 45,
    finalAmount: 495,
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const steps = ['Booking Information', 'Payment', 'Completed'];

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderBookingInformation = () => (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <Grid container>
        {/* Left Side - Image */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              height: 300,
              backgroundImage: 'linear-gradient(45deg, #2196f3, #21cbf3)',
              borderRadius: 2,
              m: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}
          >
            <Typography variant="h6" color="white">
              Luxury Resort Villa
            </Typography>
          </Box>
        </Grid>

        {/* Right Side - Booking Details */}
        <Grid item xs={12} md={6}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Booking Details
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Check-in Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {bookingData.checkIn}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Check-out Date
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {bookingData.checkOut}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Guests
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {bookingData.guests} {bookingData.guests > 1 ? 'Guests' : 'Guest'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Room Type
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {bookingData.roomType}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" fontWeight="bold">
                  Total Price
                </Typography>
                <Typography variant="h5" fontWeight="bold" color="primary">
                  ${bookingData.totalPrice}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 4, py: 1.5 }}
              onClick={handleNext}
            >
              Continue
            </Button>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );

  const renderPayment = () => (
    <Card sx={{ maxWidth: 800, margin: 'auto', mt: 4 }}>
      <Grid container>
        {/* Left Side - Booking Summary */}
        <Grid item xs={12} md={6}>
          <CardContent sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Booking Summary
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Room Type
                </Typography>
                <Typography variant="body1">
                  {bookingData.roomType}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Duration
                </Typography>
                <Typography variant="body1">
                  {bookingData.checkIn} to {bookingData.checkOut}
                </Typography>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Guests
                </Typography>
                <Typography variant="body1">
                  {bookingData.guests} {bookingData.guests > 1 ? 'Guests' : 'Guest'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Room Charges</Typography>
                <Typography variant="body2">${bookingData.totalPrice}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Taxes & Fees</Typography>
                <Typography variant="body2">${bookingData.taxes}</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" fontWeight="bold">
                  Total Amount
                </Typography>
                <Typography variant="h6" fontWeight="bold" color="primary">
                  ${bookingData.finalAmount}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Grid>

        {/* Right Side - Payment Form */}
        <Grid item xs={12} md={6}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Payment Details
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Cardholder Name"
                value={bookingData.cardholderName}
                onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Card Number"
                placeholder="1234 5678 9012 3456"
                value={bookingData.cardNumber}
                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                margin="normal"
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Expiration Date"
                    placeholder="MM/YY"
                    value={bookingData.expiryDate}
                    onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                    margin="normal"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="CVV"
                    placeholder="123"
                    value={bookingData.cvv}
                    onChange={(e) => handleInputChange('cvv', e.target.value)}
                    margin="normal"
                  />
                </Grid>
              </Grid>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ mt: 4, py: 1.5 }}
              onClick={handleNext}
            >
              Pay Now
            </Button>
          </CardContent>
        </Grid>
      </Grid>
    </Card>
  );

  const renderCompleted = () => (
    <Card sx={{ maxWidth: 600, margin: 'auto', mt: 4, textAlign: 'center', p: 4 }}>
      <CardContent>
        <CheckCircle 
          sx={{ 
            fontSize: 80, 
            color: 'success.main',
            mb: 2
          }} 
        />
        
        <Typography variant="h4" gutterBottom fontWeight="bold" color="success.main">
          Yay! Payment Completed!
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Thank you for booking your stay. A confirmation email has been sent.
        </Typography>

        {/* Gray illustration placeholder */}
        <Paper
          sx={{
            height: 200,
            backgroundColor: 'grey.100',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 4,
            borderRadius: 2
          }}
        >
          <Typography variant="body2" color="grey.500">
            Illustration Placeholder
          </Typography>
        </Paper>

        <Button
          variant="contained"
          size="large"
          onClick={() => setActiveStep(0)}
          sx={{ px: 4 }}
        >
          Back to Home
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Progress Stepper */}
      <Stepper 
        activeStep={activeStep} 
        sx={{ 
          mb: 4,
          '& .MuiStepIcon-root.Mui-completed': {
            color: 'success.main',
          },
          '& .MuiStepIcon-root.Mui-active': {
            color: 'success.main',
          },
        }}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step Content */}
      {activeStep === 0 && renderBookingInformation()}
      {activeStep === 1 && renderPayment()}
      {activeStep === 2 && renderCompleted()}
    </Container>
  );
};

export default HotelBookingFlow;