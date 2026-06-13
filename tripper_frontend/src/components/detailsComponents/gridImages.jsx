import { Box, IconButton, Typography, CardMedia } from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useState, useEffect } from "react";
import favoriteService from "../../services/favorite.service";
import { useNavigate   } from "react-router-dom";

export default function GridImages({ images, title, itemId, itemType }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Check if item is in favorites
  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !itemId || !itemType) return;

        const result = await favoriteService.checkFavorite(itemId, itemType);
        setIsFavorite(result.isFavorite);
      } catch (error) {
        console.error("Error checking favorite:", error);
      }
    };

    checkIfFavorite();
  }, [itemId, itemType]);

  // ✅ Toggle favourite
  const toggleFavorite = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      if (isFavorite) {
        await favoriteService.removeFavorite(itemId, itemType);
        setIsFavorite(false);
      } else {
        await favoriteService.addFavorite(itemId, itemType);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      alert(error.message || "Error updating favorites");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ flexGrow: 1, fontWeight: 700, color: "#034959" }}
        >
          {title}
        </Typography>
        <IconButton
          onClick={toggleFavorite}  
          disabled={loading}
          sx={{
            border: "1px solid #ccc",
            borderRadius: "50%",
            backgroundColor: "#fff",
            "&:hover": { backgroundColor: "#f5f5f5" },
          }}
        >
          {isFavorite ? (
            <FavoriteIcon sx={{ color: "#f27244" }} />
          ) : (
            <FavoriteBorderIcon sx={{ color: "#f27244" }} />
          )}
        </IconButton>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "repeat(2, 1fr)",
          gap: "6px",
          height: "420px",
          borderRadius: "16px",
          overflow: "hidden",
          mb: 5,
        }}
      >
        <Box
          sx={{
            gridRow: "1 / span 2",
            gridColumn: "1 / 2",
          }}
        >
          <CardMedia
            component="img"
            image={images?.[0]}
            alt="main"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
            gap: "6px",
          }}
        >
          {images?.slice(1, 5).map((img, index) => (
            <CardMedia
              key={index}
              component="img"
              image={img}
              alt={`small-${index}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}