import { Typography, Box,Grid} from "@mui/material";


export default function ServicesSection() {
        const services = [
    {
      img: "https://cdn-icons-png.flaticon.com/512/201/201623.png",
      title: "Experiences",
      desc: "Discover unique experiences designed by local hosts to make your journey unforgettable.",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/854/854894.png",
      title: "Services",
      desc: "Access a wide range of services, including transportation, accommodations, and more.",
    },
    {
      img: "https://cdn-icons-png.flaticon.com/512/942/942748.png",
      title: "Local Events",
      desc: "Get insider access to the best local festivals, concerts, and community events.",
    },
  ];
    return (
           <Box
        sx={{
          textAlign: "center",
          py: 8,
          px: 2,
          backgroundColor: "#fff",
        }}
      >
       

      <Box sx={{ textAlign: "center", mb: { xs: 3, sm: 4 }, width: "100%" }}>
  <Typography
    component="h3"
    sx={{
      fontWeight: 800,
      color: "#f27244",
      fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
      lineHeight: 1.2,
      display: "block", 
      textAlign: "center",
    }}
  >
    We Offer Best Services
  </Typography>
</Box>

        <Typography
          variant="body2"
          sx={{ color: "#5E6282", maxWidth: 600, mx: "auto" }}
        >
          Explore a range of unique services designed to make your travel
          experience smoother, smarter, and more enjoyable.
        </Typography>
        <Grid container spacing={6} justifyContent="center">
          {services.map((service, index) => (
            <Grid
              item
              key={index}
              xs={12}
              sm={6}
              md={3}
              sx={{
                textAlign: "center",
                px: 3,
                cursor: "pointer",
                py: 4,
                transition: "transform 0.3s ease",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <Box
                component="img"
                src={service.img}
                alt={service.title}
                sx={{
                  width: 80,
                  height: 80,
                  mb: 2,
                  objectFit: "contain",
                  borderRadius: "0",
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  color: "#034959",
                }}
              >
                {service.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#5E6282",
                  maxWidth: 240,
                  mx: "auto",
                  lineHeight: 1.5,
                }}
              >
                {service.desc}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    )
}