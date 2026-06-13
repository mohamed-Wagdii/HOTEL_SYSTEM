import React, { useState } from "react";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import { Save } from "@mui/icons-material";

const EditProfile = () => {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "+201234567890",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfile({ ...profile, avatar: url });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated Profile:", profile);
   
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Edit Profile
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          p: 3,
          bgcolor: "#fff",
          borderRadius: 3,
          boxShadow: 3,
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Avatar
            src={profile.avatar}
            alt="avatar"
            sx={{ width: 120, height: 120 }}
          />
          <Button variant="outlined" component="label">
            Change Photo
            <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
          </Button>
        </Stack>

        <TextField
          label="Name"
          name="name"
          value={profile.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Email"
          name="email"
          value={profile.email}
          onChange={handleChange}
          type="email"
          fullWidth
          required
        />
        <TextField
          label="Phone"
          name="phone"
          value={profile.phone}
          onChange={handleChange}
          fullWidth
        />

        <Button
          type="submit"
          variant="contained"
          startIcon={<Save />}
          sx={{ bgcolor: "#FF385C", "&:hover": { bgcolor: "#e22d50" } }}
        >
          Save Changes
        </Button>
      </Box>
    </Container>
  );
};

export default EditProfile;
