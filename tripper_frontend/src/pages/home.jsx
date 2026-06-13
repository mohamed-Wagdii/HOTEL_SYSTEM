import React, { useState, useEffect } from "react";
import PopularHomesCarousel from "../components/sharedComponents/PopularHomesCarousel";
import hotelService from "../services/hotels.service";
import PriceFilter from "../components/sharedComponents/PriceFilter";
import SearchBar from "../components/sharedComponents/SearchBar";

import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";

const HomePage = () => {
  const [cityHotels, setCityHotels] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");

  const [searchQuery, setSearchQuery] = useState("");

  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    const fetchHotelsByCity = async () => {
      try {
        const allHotels = await hotelService.getAllHotels();

        const groupedByCity = allHotels.reduce((acc, hotel) => {
          let city = hotel.address?.city || "Other";
          city = city.trim().toLowerCase();
          const cityDisplay = city.charAt(0).toUpperCase() + city.slice(1);

          if (!acc[cityDisplay]) acc[cityDisplay] = [];

          let displayPrice = hotel.price;
          if (hotel.rooms && hotel.rooms.length > 0) {
            const roomPrices = hotel.rooms.map((r) => r.price);
            displayPrice = Math.min(...roomPrices);
          }

          acc[cityDisplay].push({
            image: hotel.images?.[0] || "https://via.placeholder.com/150",
            title: hotel.name,
            rating: hotel.starRating || 4.5,
            price: `${displayPrice} ج.م / night`,
            numericPrice: displayPrice,
            id: hotel._id,
            model: "hotel",
          });

          return acc;
        }, {});

        const allPrices = allHotels.map((h) => Number(h.price) || 0);
        const maxP = Math.max(...allPrices);
        const minP = Math.min(...allPrices);

        setMaxPrice(maxP);
        setPriceRange([minP, maxP]);
        setCityHotels(groupedByCity);
      } catch (err) {
        console.error("Error loading hotels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotelsByCity();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading hotels...</p>;

  const cities = ["All", ...Object.keys(cityHotels)];

  return (
    <Box sx={{ pb: 6 }}>
      {/* FILTERS SECTION */}
      <Box
        sx={{
          mt: 3,
          mb: 4,
          px: { xs: 2, md: 0 },
        }}
      >
        {/* Search Bar - Full Width */}
        <Box sx={{ mb: 3 }}>
          <SearchBar
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search hotels by name..."
          />
        </Box>

        {/* City Select and Price Filter - Side by Side */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {/* City Dropdown - Left side, Takes 40% on desktop */}
          <Box sx={{ flex: { xs: "1", md: "0 0 40%" } }}>
            <FormControl
              fullWidth
              sx={{
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
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                {cities.map((city, index) => (
                  <MenuItem key={index} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Price Filter - Right side, Takes 40% on desktop */}
          <Box sx={{ flex: { xs: "1", md: "0 0 40%" } }}>
            <PriceFilter
              value={priceRange}
              maxPrice={maxPrice}
              onChange={(newRange) => setPriceRange(newRange)}
            />
          </Box>
        </Box>
      </Box>

      {/* FILTERED HOTELS */}
      {Object.keys(cityHotels)
        .filter((city) => selectedCity === "All" || city === selectedCity)
        .map((city) => {
          const filteredHotels = cityHotels[city].filter((hotel) => {
            const matchesPrice =
              hotel.numericPrice >= priceRange[0] &&
              hotel.numericPrice <= priceRange[1];

            const matchesSearch = hotel.title
              .toLowerCase()
              .includes(searchQuery.toLowerCase());

            return matchesPrice && matchesSearch;
          });

          if (filteredHotels.length === 0) return null;

          return (
            <Box key={city} sx={{ mb: 6 }}>
              <PopularHomesCarousel
                homes={filteredHotels}
                title={`Popular Hotels in ${city}`}
              />
            </Box>
          );
        })}
    </Box>
  );
};

export default HomePage;
