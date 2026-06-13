import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Rating,
  Grid,
  useTheme,
  useMediaQuery,
  IconButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Pagination,
  TextField,
  InputAdornment
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SearchIcon from "@mui/icons-material/Search";
import axiosInstance from "../../axiousInstance/axoiusInstance";
import { useNavigate } from "react-router-dom";

const Places = () => {
  const [fav, setFav] = useState({});
  const [data, setData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const toggleFav = (id) => {
    setFav((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    axiosInstance.get("/places").then((res) => {
      setData(res.data.data);
      // عشان نشوف structure الـ data
      console.log("Places Data:", res.data.data);
      if (res.data.data.length > 0) {
        console.log("First Place:", res.data.data[0]);
      }
    }).catch(err => {
      console.error("Failed to fetch places:", err);
    });
  }, []);

  const handleCardClick = (id) => {
    navigate(`/places/details/${id}`);
  };

  // Get unique places/cities from data - جرب properties مختلفة
  const cities = [
    "All", 
    ...new Set(
      data.map(place => 
        place.location?.city || 
        place.address?.city || 
        place.city || 
        place.place || 
        place.location
      ).filter(Boolean)
    )
  ];

  console.log("Available Cities:", cities);

  // Filter by city and search query
  const filteredData = data.filter(place => {
    // جرب properties مختلفة للمدينة
    const placeCity = place.location?.city || 
                      place.address?.city || 
                      place.city || 
                      place.place || 
                      place.location;
    
    const cityMatch = selectedCity === "All" || placeCity === selectedCity;
    const searchMatch = !searchQuery || 
      (place.name && place.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (place.description && place.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return cityMatch && searchMatch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setCurrentPage(1);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Container sx={{ py: { xs: 2, sm: 3 } }}>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        fontWeight="bold"
        mb={{ xs: 2, sm: 3 }}
        textAlign={{ xs: "center", sm: "left" }}
      >
        Top Attractions in Egypt
      </Typography>

      {/* Search and Filter Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "center",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 4,
        }}
      >
        {/* Search Bar */}
        <TextField
          placeholder="Search places..."
          value={searchQuery}
          onChange={handleSearchChange}
          sx={{
            width: { xs: "100%", sm: "350px" },
            backgroundColor: "white",
            borderRadius: "8px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "&:hover fieldset": {
                borderColor: "#f27244",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#f27244",
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#034959" }} />
              </InputAdornment>
            ),
          }}
        />

        {/* City Filter */}
        <FormControl
          sx={{
            width: { xs: "100%", sm: "250px" },
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
          }}
        >
          <InputLabel id="city-select-label">Select City</InputLabel>
          <Select
            labelId="city-select-label"
            value={selectedCity}
            label="Select City"
            onChange={handleCityChange}
            sx={{
              borderRadius: "8px",
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "#f27244",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "#f27244",
              },
            }}
          >
            {cities.map((city, index) => (
              <MenuItem key={index} value={city}>
                {city}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Cards Grid */}
      <Grid container spacing={{ xs: 2, sm: 2, md: 2.5 }}>
        {currentData.map((place) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={4}
            key={place._id}
            sx={{ display: "flex", width: "30%", flexGrow: 0 }}
          >
            <Card
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                flexGrow: 1,
                borderRadius: 2,
                boxShadow: 2,
                position: "relative",
                transition: "0.25s",
                cursor: "pointer",
                "&:hover": {
                  boxShadow: 4,
                  transform: "translateY(-4px)",
                },
              }}
              onClick={() => handleCardClick(place._id)}
            >
              {/* Favorite Button */}
              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFav(place._id);
                }}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  zIndex: 2,
                  bgcolor: "rgba(255,255,255,0.9)",
                  "&:hover": { bgcolor: "rgba(255,255,255,1)" },
                }}
              >
                {fav[place._id] ? (
                  <FavoriteIcon color="error" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>

              {/* FIXED IMAGE AREA */}
              <Box
                sx={{
                  width: "100%",
                  height: { xs: 170, sm: 190, md: 210 }, 
                  minHeight: { xs: 170, sm: 190, md: 210 },
                  maxHeight: { xs: 170, sm: 190, md: 210 },
                  backgroundImage: `url(${place.images?.[0] || ""})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  bgcolor: place.images?.[0] ? "transparent" : "grey.200",
                }}
              />

              {/* Content */}
              <CardContent
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  flexDirection: "column",
                  p: 2,
                }}
              >
                {/* FIXED TITLE HEIGHT */}
                <Typography
                  fontWeight="bold"
                  fontSize={{ xs: "0.9rem", sm: "1rem" }}
                  mb={1}
                  sx={{
                    minHeight: "40px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {place.name}
                </Typography>

                <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                  <Rating
                    value={place.starRating}
                    readOnly
                    size="small"
                    precision={0.1}
                  />
                  <Typography variant="body2" color="text.secondary">
                    {place.starRating}
                  </Typography>
                </Box>

                {/* FIXED DESCRIPTION HEIGHT */}
                <Typography
                  variant="body2"
                  sx={{
                    color: "text.secondary",
                    mb: 2,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "40px",
                  }}
                >
                  {place.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 4,
            mb: 2,
          }}
        >
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            size={isMobile ? "small" : "medium"}
            sx={{
              "& .MuiPaginationItem-root": {
                fontWeight: 500,
              },
              "& .Mui-selected": {
                bgcolor: "#f27244 !important",
                color: "white",
                "&:hover": {
                  bgcolor: "#034959 !important",
                },
              },
            }}
          />
        </Box>
      )}

      {/* No Results Message */}
      {filteredData.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 6,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No places found{searchQuery && ` matching "${searchQuery}"`}
            {selectedCity !== "All" && ` in ${selectedCity}`}
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Places;