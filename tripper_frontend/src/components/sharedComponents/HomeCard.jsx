import React, { useState, useEffect } from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import favoriteService from "../../services/favorite.service";

const HomeCard = ({ image, title, price, rating, model, id, onRemove }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Check if this card is already in favourites
  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !id || !model) return;

        const itemType = model === "experiance" ? "Experiance" : 
                        model === "hotel" ? "Hotel" : 
                        model === "place" ? "Place" : model;

        const result = await favoriteService.checkFavorite(id, itemType);
        setIsFavorite(result.isFavorite);
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };

    checkIfFavorite();
  }, [id, model]);

  // ✅ Toggle favourite state
  const toggleFavorite = async (e) => {
    e.stopPropagation();
    
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const itemType = model === "experiance" ? "Experiance" : 
                      model === "hotel" ? "Hotel" : 
                      model === "place" ? "Place" : model;

      if (isFavorite) {
        await favoriteService.removeFavorite(id, itemType);
        setIsFavorite(false);
        
        // ✅ إذا كان هناك callback للحذف، نفذه (لحذف الكارد من الصفحة)
        if (onRemove) {
          onRemove(id);
        }
      } else {
        await favoriteService.addFavorite(id, itemType);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert(error.message || "Error updating favorites");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Navigate to details page
  const handleCardClick = () => {
    navigate(`/${model}/details/${id}`);
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        width: "100%",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        cursor: "pointer",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Image Section */}
      <Box sx={{ position: "relative" }}>
        <CardMedia
          component="img"
          height="200"
          image={image}
          alt={title}
          sx={{
            objectFit: "cover",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.03)" },
          }}
        />

        <Chip
          label="Guest favorite"
          size="small"
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "rgba(255,255,255,0.9)",
            fontWeight: 600,
            fontSize: "12px",
            color: "#333",
          }}
        />

        {/* Favourite Icon */}
        <IconButton
          onClick={toggleFavorite}
          disabled={loading}
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: "rgba(255,255,255,0.9)",
            "&:hover": { backgroundColor: "rgba(255,255,255,1)" },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: "#FF385C", fontSize: 22 }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "#333", fontSize: 22 }} />
          )}
        </IconButton>
      </Box>

      {/* Text Section */}
      <CardContent sx={{ p: 2 }}>
        <Typography
          fontWeight="bold"
          sx={{
            mb: 0.5,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            fontSize: "1rem",
          }}
        >
          {title}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 0.5,
          }}
        >
          <Typography variant="body2" sx={{ color: "gray", fontSize: "0.9rem" }}>
            {price}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <StarIcon sx={{ color: "#FFB400", fontSize: 18 }} />
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: "#222", fontSize: "0.9rem" }}
            >
              {rating}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default HomeCard;