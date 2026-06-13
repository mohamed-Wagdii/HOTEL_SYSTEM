import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Alert,
  Container,
} from "@mui/material";
import authService from "../services/authservice";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [tab, setTab] = useState(0); 
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (tab === 1 && !formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password.trim())
      newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (tab === 1 && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (tab === 1 && !formData.phone.trim())
      newErrors.phone = "Phone number is required";
    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess("");
      return;
    }

    try {
      if (tab === 0) {
        // 🔹 Login
        const data = await authService.signin({
          email: formData.email,
          password: formData.password,
        });

        authService.saveAuthData(data.user, data.token);
        setSuccess(`Welcome back, ${data.user.email}`);

        if (data.user.activeRole === "host") navigate("/host/dashboard");
        else navigate("/home");
      } else {
        // 🔹 Signup
        const data = await authService.signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        });
        console.log(data);
        
        setSuccess("Account created! Please verify your email before login.");
      }

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
      });
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";
      setErrors({ general: message });
      setSuccess("");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f9f9f9",
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          background: "#fff",
          borderRadius: 4,
          p: 5,
          boxShadow: "0 0 15px rgba(0,0,0,0.05)",
        }}
      >
        <Box textAlign="center" mb={3}>
<Box
          component="img"
          src="navImage.png"
          alt="Tripper logo with slogan"
          sx={{
            height: 40,
            width: 200,
            objectFit: "cover",
            mb: 1,
          }}
        />          <Typography variant="h5" fontWeight={700} mb={1}>
            {tab === 0 ? "Welcome Back" : "Create Account"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {tab === 0
              ? "Login to continue your journey"
              : "Sign up to start exploring amazing places"}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="center" mb={3}>
          <Button
            onClick={() => setTab(0)}
            variant={tab === 0 ? "contained" : "text"}
            sx={{ borderRadius: 2, mx: 1, px: 4,bgcolor:tab===0&&"#f27244" }}
          >
            Log In
          </Button>
          <Button
            onClick={() => setTab(1)}
            variant={tab === 1 ? "contained" : "text"}
            sx={{ borderRadius: 2, mx: 1, px: 4,bgcolor:tab===1&&"#f27244" }}
          >
            Sign Up
          </Button>
        </Box>

        {/* 🔹 Form */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
          {tab === 1 && (
            <TextField
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
            />
          )}

          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password}
            fullWidth
          />

          {tab === 1 && (
            <>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                fullWidth
              />

              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
                fullWidth
              />
            </>
          )}
        </Box>

        {errors.general && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.general}
          </Alert>
        )}

        <Button
          variant="contained"
          fullWidth
          sx={{
            bgcolor: "#f27244",
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 600,
            mb: 2,
          }}
          onClick={handleSubmit}
        >
          {tab === 0 ? "Log In" : "Sign Up"}
        </Button>

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        <Divider sx={{ my: 2 }}>Or</Divider>

        <Typography variant="body2" textAlign="center">
          {tab === 0 ? (
            <>
              Don't have an account?{" "}
              <Button
                variant="text"
                color="primary"
                size="small"
                sx={{ textTransform: "none", fontWeight: 600 }}
                onClick={() => setTab(1)}
              >
                Sign Up
              </Button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <Button
                variant="text"
                color="primary"
                size="small"
                sx={{ textTransform: "none", fontWeight: 600 }}
                onClick={() => setTab(0)}
              >
                Sign In
              </Button>
            </>
          )}
        </Typography>
      </Container>
    </Box>
  );
}
