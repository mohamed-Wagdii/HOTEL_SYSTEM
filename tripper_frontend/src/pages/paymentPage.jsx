import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Stack,
  Container
} from "@mui/material";
import {
  CreditCard,
  Lock,
  Security,
  CheckCircle,
  Error as ErrorIcon
} from "@mui/icons-material";
import axiosInstance from "../axiousInstance/axoiusInstance";

const stripePromise = loadStripe("pk_test_51RyskeFiZ2ZQ1Dto62nBPPrY60ibBapgprQ9lPqWqop06w3dWWee6aNM59qRu0gBJWTvfEXfuI36fk0A9uJppFcT00ehHVHgLr");

function PaymentForm() {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  
  const reservationId = location.state?.reservationId;
  const reservationAmount = location.state?.amount;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!reservationId) {
      setErrorMessage("No reservation found. Please create a reservation first.");
    }
  }, [reservationId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements || !reservationId) {
      return;
    }

    setIsProcessing(true);
    setPaymentStatus("");
    setErrorMessage("");

    try {
      // ✅ Create payment intent عند الضغط على Pay Now فقط
      const paymentRes = await axiosInstance.post("/payment/create", { 
        reservationId 
      });
      
      const clientSecret = paymentRes.data.clientSecret;
      const cardElement = elements.getElement(CardElement);

      // ✅ Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });

      if (error) {
        console.log("Payment error:", error.message);
        setErrorMessage(error.message);
        setPaymentStatus("error");
      } else if (paymentIntent.status === "succeeded") {
        await axiosInstance.post("/payment/webhook", {
          type: "payment_intent.succeeded",
          data: {
            object: {
              id: paymentIntent.id,
            }
          }
        });
        
        console.log("Payment successful!");
        setPaymentStatus("success");
        
        setTimeout(() => {
    navigate("/my-trips");  
  }, 2000)
      }
    } catch (err) {
      console.error("Payment error:", err);
      setErrorMessage(err.response?.data?.message || "Payment failed. Please try again.");
      setPaymentStatus("error");
    } finally {
      setIsProcessing(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        "::placeholder": {
          color: "#aab7c4",
        },
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        padding: "10px 12px",
      },
    },
    hidePostalCode: true,
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Card 
        elevation={3}
        sx={{
          borderRadius: 2,
          overflow: "hidden"
        }}
      >
        <Box
          sx={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            py: 4,
            px: 3,
            textAlign: "center"
          }}
        >
          <CreditCard sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            Secure Payment
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Enter your card details to complete your purchase
          </Typography>
          {reservationAmount && (
            <Typography variant="h5" sx={{ mt: 2, fontWeight: "bold" }}>
              Amount: {reservationAmount} ج.م
            </Typography>
          )}
        </Box>

        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <Box>
                <Typography variant="h6" gutterBottom fontWeight="medium">
                  Card Details
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{
                    p: 2,
                    borderRadius: 1,
                    borderColor: "divider",
                    "&:hover": {
                      borderColor: "primary.main"
                    }
                  }}
                >
                  <CardElement options={cardElementOptions} />
                </Paper>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={!stripe || isProcessing || !reservationId}
                fullWidth
                sx={{
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: "bold",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: 3
                  },
                  "&:disabled": {
                    background: "grey.300"
                  }
                }}
              >
                {isProcessing ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CircularProgress size={20} sx={{ color: "white" }} />
                    Processing...
                  </Box>
                ) : (
                  "Pay Now"
                )}
              </Button>

              {errorMessage && (
                <Alert 
                  severity="error" 
                  icon={<ErrorIcon />}
                  sx={{ borderRadius: 1 }}
                >
                  {errorMessage}
                </Alert>
              )}

              {paymentStatus === "success" && (
                <Alert 
                  severity="success" 
                  icon={<CheckCircle />}
                  sx={{ borderRadius: 1 }}
                >
                  Payment successful! Redirecting to your profile...
                </Alert>
              )}
            </Stack>
          </form>

          <Divider sx={{ my: 3 }} />

          <Stack spacing={2}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Lock color="success" />
              <Typography variant="body2" color="text.secondary">
                Your payment is secured with SSL encryption
              </Typography>
            </Box>
            
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Security color="info" />
              <Typography variant="body2" color="text.secondary">
                We never store your card details
              </Typography>
            </Box>

            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                We accept:
              </Typography>
              <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  💳 Visa • MasterCard • American Express • Discover
                </Typography>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm />
    </Elements>
  );
}