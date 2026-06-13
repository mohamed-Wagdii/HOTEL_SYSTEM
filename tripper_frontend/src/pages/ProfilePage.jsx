import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Paper,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Button,
  Modal,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import VerifiedIcon from "@mui/icons-material/Verified";
import IdentityIcon from "@mui/icons-material/Badge";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { toast } from "react-hot-toast";
import authService from "../services/authservice";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editOpen, setEditOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "" });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await authService.getCurrentUser();
        setUser(data);
        setFormData({ name: data.name, phone: data.phone });
      } catch (err) {
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  const handleEditSubmit = async () => {
    try {
      const updated = await authService.updateProfile(formData);
      setUser(updated);
      setEditOpen(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    }
  };

  const handleImageUpload = async (file) => {
    if (!file) return;
    try {
      setUploading(true);
      const updatedImage = await authService.uploadProfileImage(file);
      setUser((prev) => ({ ...prev, image: updatedImage.image }));
      setUploading(false);
      toast.success("Profile image uploaded!");
    } catch (err) {
      console.error(err);
      setUploading(false);
      toast.error("Failed to upload image");
    }
  };

  const verificationColor = {
    verified: "success",
    pending: "warning",
    rejected: "error",
    notVerified: "default",
  };

  return (
    <Box sx={{ backgroundColor: "#f2f4f7", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: 5,
            borderRadius: 3,
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Profile Image with Upload */}
          <Box
            sx={{
              position: "relative",
              display: "inline-block",
              cursor: "pointer",
            }}
          >
            <Avatar
              src={user.image || ""}
              sx={{
                width: 120,
                height: 120,
                mx: "auto",
                mb: 2,
                bgcolor: "red",
              }}
              onClick={() => setImageModalOpen(true)}
            >
              <PersonIcon sx={{ fontSize: 70 }} />
            </Avatar>
            <IconButton
              color="primary"
              sx={{ position: "absolute", bottom: 0, right: 0 }}
              component="label"
            >
              {uploading ? (
                <CircularProgress size={24} />
              ) : (
                <>
                  <PhotoCamera />
                  <input
                    type="file"
                    hidden
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />
                </>
              )}
            </IconButton>
          </Box>

          <Typography variant="h5" fontWeight="bold" mb={1}>
            {user.name}
          </Typography>

          {/* Info List */}
          <List>
            <ListItem>
              <ListItemIcon>
                <EmailIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Email" secondary={user.email} />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemIcon>
                <PersonIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Role" secondary={user.activeRole} />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemIcon>
                <PhoneIcon color="primary" />
              </ListItemIcon>
              <ListItemText primary="Phone" secondary={user.phone} />
            </ListItem>
            <Divider />

            <ListItem>
              <ListItemIcon>
                <VerifiedIcon
                  color={
                    user.isVerified === "verified" ? "success" : "disabled"
                  }
                />
              </ListItemIcon>
              <ListItemText
                primary="Account Verification"
                secondary={
                  <Chip
                    label={user.isVerified}
                    color={verificationColor[user.isVerified]}
                    size="small"
                  />
                }
              />
            </ListItem>

            {/* Host-specific Identity */}
            {user.activeRole === "host" && (
              <>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <IdentityIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Identity Status"
                    secondary={
                      <Chip
                        label={
                          user.isVerified === "verified"
                            ? "Verified"
                            : "Upload Pending"
                        }
                        color={
                          user.isVerified === "verified" ? "success" : "warning"
                        }
                        size="small"
                      />
                    }
                  />
                </ListItem>
              </>
            )}
          </List>

          <Box mt={3}>
            <Button variant="contained" onClick={() => setEditOpen(true)}>
              Edit Profile
            </Button>
          </Box>
        </Paper>
      </Container>

      {/* Edit Profile Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)}>
        <Box
          sx={{
            width: { xs: "90%", sm: 400 },
            bgcolor: "white",
            p: 4,
            mx: "auto",
            mt: 10,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" mb={2}>
            Edit Profile
          </Typography>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          <TextField
            label="Phone"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
          <Box mt={2} textAlign="right">
            <Button onClick={handleEditSubmit} variant="contained">
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Image Modal */}
      <Modal
        open={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        closeAfterTransition
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            width: "100vw",
            backgroundColor: "rgba(0,0,0,0.8)",
            position: "relative",
            p: 2,
          }}
          onClick={() => setImageModalOpen(false)}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              position: "relative",
              maxWidth: "90%",
              maxHeight: "90%",
            }}
          >
            <IconButton
              onClick={() => setImageModalOpen(false)}
              sx={{
                position: "absolute",
                top: -10,
                right: -10,
                color: "white",
                bgcolor: "rgba(0,0,0,0.6)",
                "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                zIndex: 10,
              }}
            >
              ✕
            </IconButton>

            <img
              src={user.image || ""}
              alt="Profile"
              style={{
                display: "block",
                width: "auto",
                height: "auto",
                maxWidth: "100%",
                maxHeight: "90vh",
                borderRadius: "8px",
              }}
            />
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfilePage;
