import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Popover,
  IconButton,
  Divider,
  useMediaQuery,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import SearchIcon from "@mui/icons-material/Search";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const SearchBarFields = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeField, setActiveField] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [guests, setGuests] = useState({ adults: 1, children: 0 });
  const isMobile = useMediaQuery("(max-width:768px)");

  const handleOpen = (event, field) => {
    setAnchorEl(event.currentTarget);
    setActiveField(field);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setActiveField(null);
  };

  const open = Boolean(anchorEl);

  const updateGuestCount = (type, delta) => {
    setGuests((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + delta),
    }));
  };

  const popoverContent = {
    where: (
      <Box sx={{ p: 2, width: isMobile ? "90vw" : 250 }}>
        <Typography fontWeight="bold">Search destination</Typography>
        <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
          Try “Cairo”, “Giza”, or “Alexandria”
        </Typography>
      </Box>
    ),
    when: (
      <Box sx={{ p: 2, width: isMobile ? "90vw" : "auto" }}>
        <Typography fontWeight="bold" sx={{ mb: 1 }}>
          Select your stay dates
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              gap: 2,
            }}
          >
            <DatePicker
              label="Check-in"
              value={dateRange[0]}
              onChange={(newValue) => setDateRange([newValue, dateRange[1]])}
            />
            <DatePicker
              label="Check-out"
              value={dateRange[1]}
              onChange={(newValue) => setDateRange([dateRange[0], newValue])}
            />
          </Box>
        </LocalizationProvider>
      </Box>
    ),
    who: (
      <Box sx={{ p: 2, width: isMobile ? "90vw" : 280 }}>
        <Typography fontWeight="bold" sx={{ mb: 1 }}>
          Choose guests
        </Typography>
        {["adults", "children"].map((type) => (
          <React.Fragment key={type}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                py: 1,
              }}
            >
              <Box>
                <Typography fontWeight="bold">
                  {type === "adults" ? "Adults" : "Children"}
                </Typography>
                <Typography variant="body2" color="gray">
                  {type === "adults" ? "Ages 13 or above" : "Ages 2–12"}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton
                  onClick={() => updateGuestCount(type, -1)}
                  disabled={guests[type] === 0}
                  size="small"
                  sx={{
                    border: "1px solid #ccc",
                    color: guests[type] === 0 ? "gray" : "black",
                  }}
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
                <Typography sx={{ width: 20, textAlign: "center" }}>
                  {guests[type]}
                </Typography>
                <IconButton
                  onClick={() => updateGuestCount(type, 1)}
                  size="small"
                  sx={{ border: "1px solid #ccc", color: "black" }}
                >
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
            {type === "adults" && <Divider />}
          </React.Fragment>
        ))}
      </Box>
    ),
  };

  const DesktopSearchBar = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        borderRadius: "50px",
        border: "1px solid #ddd",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        overflow: "hidden",
        bgcolor: "white",
      }}
    >
      <Button
        variant="text"
        onClick={(e) => handleOpen(e, "where")}
        sx={{
          flex: 1,
          justifyContent: "flex-start",
          textTransform: "none",
          px: 3,
          py: 2,
          borderRight: "1px solid #ddd",
          color: "inherit",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
        }}
      >
        <Box sx={{ textAlign: "left" }}>
          <Typography fontWeight="bold" fontSize={14}>
            Where
          </Typography>
          <Typography variant="body2" sx={{ color: "gray", fontSize: 13 }}>
            Search destinations
          </Typography>
        </Box>
      </Button>

      <Button
        variant="text"
        onClick={(e) => handleOpen(e, "when")}
        sx={{
          flex: 1,
          justifyContent: "flex-start",
          textTransform: "none",
          px: 3,
          py: 2,
          borderRight: "1px solid #ddd",
          color: "inherit",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
        }}
      >
        <Box sx={{ textAlign: "left" }}>
          <Typography fontWeight="bold" fontSize={14}>
            When
          </Typography>
          <Typography variant="body2" sx={{ color: "gray", fontSize: 13 }}>
            {dateRange[0] && dateRange[1]
              ? `${dayjs(dateRange[0]).format("MMM D")} - ${dayjs(
                  dateRange[1]
                ).format("MMM D")}`
              : "Add dates"}
          </Typography>
        </Box>
      </Button>

      <Box
        onClick={(e) => handleOpen(e, "who")}
        sx={{
          flex: 1.2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 3,
          py: 2,
          cursor: "pointer",
          "&:hover": { backgroundColor: "rgba(0,0,0,0.04)" },
        }}
      >
        <Box sx={{ textAlign: "left" }}>
          <Typography fontWeight="bold" fontSize={14}>
            Who
          </Typography>
          <Typography variant="body2" sx={{ color: "gray", fontSize: 13 }}>
            {guests.adults + guests.children > 0
              ? `${guests.adults + guests.children} guest${
                  guests.adults + guests.children > 1 ? "s" : ""
                }`
              : "Add guests"}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#f27244",
            color: "white",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            "&:hover": { backgroundColor: "#034959" },
          }}
        >
          <SearchIcon />
        </Box>
      </Box>
    </Box>
  );

  const MobileSearchBar = (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        borderRadius: "50px",
        px: 2,
        py: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "white",
      }}
    >
      <Box>
        <Typography fontWeight="bold" fontSize={13}>
          Anywhere
        </Typography>
        <Typography fontSize={12} color="gray">
          Any week • Add guests
        </Typography>
      </Box>
      <Box
        sx={{
          backgroundColor: "#f27244",
          color: "white",
          borderRadius: "50%",
          width: 36,
          height: 36,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <SearchIcon fontSize="small" />
      </Box>
    </Paper>
  );

  return (
    <>
      {isMobile ? MobileSearchBar : DesktopSearchBar}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        transformOrigin={{ vertical: "top", horizontal: "center" }}
        PaperProps={{
          sx: { borderRadius: 3, width: isMobile ? "95vw" : "auto" },
        }}
      >
        {activeField && popoverContent[activeField]}
      </Popover>
    </>
  );
};

export default SearchBarFields;
