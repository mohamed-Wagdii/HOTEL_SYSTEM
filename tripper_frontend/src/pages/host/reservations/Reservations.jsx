import React, { useState } from "react";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Fade,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HotelReservationsList from "./HotelReservationsList";
import ExperienceReservationsList from "./ExperienceReservationsList";

const Reservations = () => {
  const [tab, setTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Fade in timeout={400}>
      <Box
        p={{ xs: 2, sm: 3, md: 4 }}
        maxWidth="1200px"
        mx="auto"
        width="100%"
      >
        {/* Title */}
        <Typography
          variant={isMobile ? "h5" : "h4"}
          fontWeight="bold"
          color="#034959"
          textAlign="center"
          mt={2}
          mb={isMobile ? 2 : 4}
        >
          My Reservations
        </Typography>

        {/* Tabs Container */}
        <Paper
          elevation={3}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <Tabs
            value={tab}
            onChange={handleChange}
            centered={!isMobile}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            textColor="inherit"
            TabIndicatorProps={{
              style: { backgroundColor: "#f27244", height: "3px" },
            }}
            sx={{
              backgroundColor: "#FFF8F8",
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: "bold",
                fontSize: isMobile ? "0.85rem" : "1rem",
                minWidth: isMobile ? "auto" : 160,
              },
              "& .Mui-selected": { color: "#f27244" },
            }}
          >
            <Tab label="🏨 Hotel Reservations" />
            <Tab label="🎯 Experience Reservations" />
          </Tabs>

          {/* Content */}
          <Box p={{ xs: 1, sm: 2, md: 3 }}>
            {tab === 0 && <HotelReservationsList />}
            {tab === 1 && <ExperienceReservationsList />}
          </Box>
        </Paper>
      </Box>
    </Fade>
  );
};

export default Reservations;
