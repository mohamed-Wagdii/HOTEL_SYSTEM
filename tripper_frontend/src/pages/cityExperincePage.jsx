import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Grid } from "@mui/material";
import experienceService from "../services/experince.service";
import HomeCard from "../components/sharedComponents/HomeCard";
import SearchBar from "../components/sharedComponents/SearchBar";
import PaginationBar from "../components/sharedComponents/Pagination";
import PriceFilter from "../components/sharedComponents/PriceFilter";

export default function CityExperiencePage() {
  const { city } = useParams();
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(1);
  const limit = 6;

  // Search
  const [search, setSearch] = useState("");

  // Price filter
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [maxPrice, setMaxPrice] = useState(1000); // مؤقت

  useEffect(() => {
    const fetchCityExperiences = async () => {
      try {
        const data = await experienceService.getAllExperiences();

        const filteredByCity = data.filter(
          (exp) => exp.address?.city?.toLowerCase() === city.toLowerCase()
        );

        const formatted = filteredByCity.map((exp) => ({
          image: exp.images?.[0] || "https://via.placeholder.com/400",
          title: exp.name,
          rating: exp.starRating || 4.8,
          price: exp.price ? Number(exp.price) : 0, // احتفظ بالرقم للفلترة
          id: exp._id,
          model: "experience",
        }));

        // تحديد الحد الأقصى والأدنى للسعر
        const allPrices = formatted.map((exp) => exp.price);
        const maxP = Math.max(...allPrices);
        const minP = Math.min(...allPrices);
        setMaxPrice(maxP);
        setPriceRange([minP, maxP]);

        setExperiences(formatted);
      } catch (err) {
        console.error("Error fetching experiences for city:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCityExperiences();
  }, [city]);

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading experiences...</p>;

  // ----- Filter by price first -----
  const priceFiltered = experiences.filter(
    (exp) => exp.price >= priceRange[0] && exp.price <= priceRange[1]
  );

  // ----- Search filter after price filtering -----
  const filtered = priceFiltered.filter((exp) =>
    exp.title.toLowerCase().includes(search.toLowerCase())
  );

  // ----- Pagination -----
  const totalPages = Math.ceil(filtered.length / limit);
  const start = (page - 1) * limit;
  const paginatedExperiences = filtered.slice(start, start + limit);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        All Experiences in {city.charAt(0).toUpperCase() + city.slice(1)}
      </Typography>

      {/* Search & Price Filter */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap", mb: 4 }}>
        <SearchBar
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search experiences..."
        />

        <PriceFilter
          value={priceRange}
          maxPrice={maxPrice}
          onChange={(newRange) => setPriceRange(newRange)}
        />
      </Box>

      {/* Experiences Grid */}
      <Grid container spacing={3}>
        {paginatedExperiences.length > 0 ? (
          paginatedExperiences.map((exp, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <HomeCard {...exp} />
            </Grid>
          ))
        ) : (
          <Typography
            sx={{ textAlign: "center", width: "100%", mt: 4 }}
            color="text.secondary"
          >
            No experiences found.
          </Typography>
        )}
      </Grid>

      {/* Pagination */}
      <PaginationBar
        page={page}
        totalPages={totalPages}
        onChange={(value) => setPage(value)}
      />
    </Box>
  );
}
