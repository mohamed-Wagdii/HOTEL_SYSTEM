import React, { useEffect, useState, useCallback } from "react";
import { Box, Typography, Grid, Button, Container, CircularProgress } from "@mui/material";
import HomeCard from "../components/sharedComponents/HomeCard";
import { useNavigate } from "react-router-dom";
import FooterComponent from "../components/onBoardingComponents/footer";
import favoriteService from "../services/favorite.service";

export default function FavouritePage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchFavorites = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await favoriteService.getUserFavorites();
      setFavorites(response.favorites || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      if (error.message === "Invalid token" || error.message === "No token provided") {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  // ✅ دالة لحذف الكارد من القائمة
  const handleRemoveFavorite = (itemId) => {
    setFavorites((prevFavorites) => 
      prevFavorites.filter((item) => item.id !== itemId)
    );
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "100vh" 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ backgroundColor: "#fafafa", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {favorites.length === 0 ? (
          <Box sx={{ mt: 6, textAlign: "center" }}>
            <Typography color="gray" sx={{ mb: 1 }}>
              No favourites yet
            </Typography>
            <Typography color="gray" sx={{ mb: 3 }}>
              As you search, click the heart icon to save your favorite places and experiences to a wishlist.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                backgroundColor: "#14183E",
                borderRadius: "16px",
                px: 4,
                textTransform: "none",
                fontWeight: 600,
                "&:hover": { backgroundColor: "#14186E" },
              }}
              onClick={() => navigate("/home")}
            >
              Start Exploring
            </Button>
          </Box>
        ) : (
          <Grid
            container
            spacing={3}
            justifyContent="center"
            alignItems="stretch"
          >
            {favorites.map((item) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                lg={3}
                key={item.favoriteId}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ width: "100%", maxWidth: 320 }}>
                  <HomeCard 
                    {...item} 
                    onRemove={handleRemoveFavorite}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>

      <FooterComponent />
    </Box>
  );
}