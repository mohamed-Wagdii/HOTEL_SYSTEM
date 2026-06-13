import React, { useState, useEffect } from "react";
import PopularHomesCarousel from "../components/sharedComponents/PopularHomesCarousel";
import experienceService from "../services/experince.service";
import PriceFilter from "../components/sharedComponents/PriceFilter";
import SearchBar from "../components/sharedComponents/SearchBar";
import {
  Box,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";


export default function ExperiencePage() {
  const [cityExperiences, setCityExperiences] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(5000);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const all = await experienceService.getAllExperiences();

        const groupedByCity = all.reduce((acc, exp) => {
          const city = exp.address?.city
            ? exp.address.city.trim().toLowerCase()
            : "Other";

          const cityDisplay = city.charAt(0).toUpperCase() + city.slice(1);

          if (!acc[cityDisplay]) acc[cityDisplay] = [];

          acc[cityDisplay].push({
            image: exp.images?.[0] || "https://via.placeholder.com/400",
            title: exp.name,
            rating: exp.starRating || 4.8,
            price: Number(exp.price) || 0,
            id: exp._id,
            model: "experiance",
          });
          return acc;
        }, {});

        // Prices
        const allPrices = all.map((e) => Number(e.price) || 0);
        const minP = Math.min(...allPrices);
        const maxP = Math.max(...allPrices);

        setMaxPrice(maxP);
        setPriceRange([minP, maxP]);

        setCityExperiences(groupedByCity);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading experiences...</p>;

  const cities = ["All", ...Object.keys(cityExperiences)];

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
            placeholder="Search experiences by name..."
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

      {/* Filtered Experiences */}
      {Object.keys(cityExperiences)
        .filter((city) => selectedCity === "All" || city === selectedCity)
        .map((city) => {
          const filtered = cityExperiences[city].filter((exp) => {
            const matchesPrice =
              exp.price >= priceRange[0] && exp.price <= priceRange[1];

            const matchesSearch = exp.title
              .toLowerCase()
              .includes(searchQuery.toLowerCase());

            return matchesPrice && matchesSearch;
          });

          if (filtered.length === 0) return null;

          return (
            <Box key={city} sx={{ mb: 6 }}>
              <PopularHomesCarousel
                homes={filtered}
                title={`Popular Experiences in ${city}`}
              />
            </Box>
          );
        })}
    </Box>
  );
}