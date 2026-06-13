import {
  Box,
  Typography,
  Grid,
} from "@mui/material";
import WifiIcon from "@mui/icons-material/Wifi";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import BeachAccessIcon from "@mui/icons-material/BeachAccess";
import PoolIcon from "@mui/icons-material/Pool";
import KitchenIcon from "@mui/icons-material/Kitchen";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";
import LandscapeIcon from "@mui/icons-material/Landscape";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";

export default function PlaceOffers({amenities=[]}) {
  const leftColumn = [
    { icon: <VisibilityIcon />, text: "Ocean view" },
    { icon: <BeachAccessIcon />, text: "Shared beach access – Beachfront" },
    { icon: <WifiIcon />, text: "Wi-Fi" },
    { icon: <DirectionsCarIcon />, text: "Free street parking" },
    {
      icon: <CameraAltIcon />,
      text: "Exterior security cameras on property",
    },
  ];

  const rightColumn = [
    { icon: <LandscapeIcon />, text: "Resort view" },
    { icon: <KitchenIcon />, text: "Kitchen" },
    { icon: <LaptopMacIcon />, text: "Dedicated workspace" },
    {
      icon: <PoolIcon />,
      text: "Shared outdoor pool – available all year, open specific hours, lap pool",
    },
    { icon: <BlockIcon />, text: "Carbon monoxide alarm", strike: true },
  ];

  return (
    <Box sx={{ mb: 5 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        What this place offers
      </Typography>

     <Grid container spacing={2}>
  <Grid item xs={6}>
    {amenities.map((item, i) => (
      <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
        <Typography color="text.secondary">{item}</Typography>
      </Box>
    ))}
  </Grid>

  
</Grid>

    </Box>
  );
}
