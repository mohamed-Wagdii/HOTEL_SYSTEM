import React, { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import HomeCard from "./HomeCard";
import { useNavigate } from "react-router-dom";

const PopularHomesCarousel = ({ homes = [], title = "Popular Homes in Cairo" }) => {
  const scrollRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const navigate = useNavigate();

  const handleScroll = () => {
    const { current } = scrollRef;
    if (current) {
      const tolerance = 30;
      const scrollLeft = current.scrollLeft;
      const maxScroll = current.scrollWidth - current.clientWidth;

      setShowLeft(scrollLeft > tolerance);
      setShowRight(scrollLeft < maxScroll - tolerance);
    }
  };

  const scroll = (direction) => {
    const { current } = scrollRef;
    if (current) {
      const scrollAmount = current.clientWidth * 0.9;
      const newScroll =
        direction === "left"
          ? current.scrollLeft - scrollAmount
          : current.scrollLeft + scrollAmount;
      current.scrollTo({ left: newScroll, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", handleScroll);
      handleScroll();
    }
    return () => ref && ref.removeEventListener("scroll", handleScroll);
  }, []);

  const cityName = title.split("in ")[1]?.trim()?.toLowerCase() || "city";

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4, md: 6 },
        py: 4,
        position: "relative",
        overflow: "hidden",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 1, md: 3 },
          mb: 2,
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            textAlign: { xs: "left", md: "left" },
          }}
        >
          {title}
        </Typography>

     <Button
  variant="outlined"
  size="small"
  sx={{
    borderColor: "#f27244",
    color: "#f27244",
    borderRadius: "20px",
    textTransform: "none",
    "&:hover": { bgcolor: "#f27244", color: "white" },
  }}
  onClick={() => {
    const isExperience = homes?.[0]?.model === "experiance";
    const basePath = isExperience ? "/experience-city" : "/city";
    navigate(`${basePath}/${cityName}`);
  }}
>
  View More
</Button>

      </Box>

      {showLeft && (
        <IconButton
          onClick={() => scroll("left")}
          sx={{
            position: "absolute",
            top: "50%",
            left: { xs: 0, sm: 10 },
            transform: "translateY(-50%)",
            zIndex: 3,
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            "&:hover": { backgroundColor: "#f5f5f5" },
            width: { xs: 30, sm: 40 },
            height: { xs: 30, sm: 40 },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
        </IconButton>
      )}

      {showRight && (
        <IconButton
          onClick={() => scroll("right")}
          sx={{
            position: "absolute",
            top: "50%",
            right: { xs: 0, sm: 10 },
            transform: "translateY(-50%)",
            zIndex: 3,
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            "&:hover": { backgroundColor: "#f5f5f5" },
            width: { xs: 30, sm: 40 },
            height: { xs: 30, sm: 40 },
          }}
        >
          <ArrowForwardIosIcon sx={{ fontSize: { xs: 16, sm: 20 } }} />
        </IconButton>
      )}

      <Box
        ref={scrollRef}
        sx={{
          p: 2,
          display: "flex",
          gap: 2,
          overflowX: "auto",
          scrollBehavior: "smooth",
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        {homes.map((home, i) => (
          <Box
            key={i}
            sx={{
              flex: "0 0 auto",
              scrollSnapAlign: "start",
              width: isMobile ? "90%" : isTablet ? "45%" : "23%",
              transition: "transform 0.3s ease",
              "&:hover": { transform: !isMobile && "scale(1.03)" },
            }}
          >
            <HomeCard {...home} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default PopularHomesCarousel;
