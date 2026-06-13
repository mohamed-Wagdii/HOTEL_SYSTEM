import React from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Container,
} from "@mui/material";

const activities = [
  {
    img: "https://via.placeholder.com/80x80?text=Old+Cairo",
    title: "Wander old Cairo",
    description:
      "Bask in old Cairo alleys and hidden gems and experience the local culture",
  },
  {
    img: "https://via.placeholder.com/80x80?text=Hangout",
    title: "Hangout spots",
    description: "Hang out in Egyptian vibes and dance",
  },
  {
    img: "https://via.placeholder.com/80x80?text=Architecture",
    title: "Admire architecture",
    description: "Step into the gorgeous Al-Hakem Mosque.",
  },
  {
    img: "https://via.placeholder.com/80x80?text=Bazaar",
    title: "Roam Khan El Khalili",
    description: "Shop souvenirs and enjoy the colorful bazaar atmosphere.",
  },
];

const WhatYoullDo = ({activities=[]}) => {

    console.log(activities+'55555');
    
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
        sx={{ mb: 3 }}
      >
        What you’ll do
      </Typography>

      <Grid container direction="column" spacing={2}>
        {activities.map((item, index) => (
          <Grid item key={index}>
            <Card
              variant="outlined"
              sx={{
                display: "flex",
                alignItems: "center",
                borderRadius: 3,
                p: 1.5,
                boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
                "&:hover": { boxShadow: "0 4px 10px rgba(0,0,0,0.1)" },
              }}
            >
              <CardMedia
                component="img"
                image={item.image}
                alt={item.title}
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: 2,
                  objectFit: "cover",
                  mr: 2,
                }}
              />
              <CardContent sx={{ p: 0 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default WhatYoullDo;
