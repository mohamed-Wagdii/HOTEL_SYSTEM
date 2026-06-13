import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, CardMedia, Button, Grid } from "@mui/material";

const PlanPage = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const savedPlans = JSON.parse(localStorage.getItem("plan")) || [];
    setPlans(savedPlans);
  }, []);

  const handleRemove = (name) => {
    const updated = plans.filter((p) => p.name !== name);
    setPlans(updated);
    localStorage.setItem("plan", JSON.stringify(updated));
  };

  return (
    <Box sx={{ px: 6, py: 6 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          mb: 4,
          textAlign: "center",
          color: "#14183E",
        }}
      >
        Your Travel Plans
      </Typography>

      {plans.length === 0 ? (
        <Typography sx={{ textAlign: "center", color: "#5E6282", mt: 6 }}>
          You haven't added any destinations yet. Go explore and add some!
        </Typography>
      ) : (
        <Grid container spacing={4}>
          {plans.map((plan) => (
            <Grid item xs={12} md={6} lg={4} key={plan._id}>
              <Card
                sx={{
                  borderRadius: "16px",
                  boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                  transition: "0.3s",
                  "&:hover": { transform: "translateY(-5px)" },
                }}
              >
                <CardMedia component="img" height="220" image={plan.images?.[0]} alt={plan.name} />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, color: "#14183E" }}>
                    {plan.name}
                  </Typography>

                  {plan.days.map((d, index) => (
                    <Box key={index} sx={{ mb: 1.5 }}>
                      <Typography sx={{ fontWeight: 600 }}>{d.day}</Typography>
                      <Typography sx={{ color: "#666" }}>{d.desc}</Typography>
                    </Box>
                  ))}

                  <Button
                    variant="contained"
                    color="error"
                    sx={{
                      mt: 2,
                      borderRadius: "12px",
                      px: 3,
                      textTransform: "none",
                      fontWeight: 600,
                    }}
                    onClick={() => handleRemove(plan.name)}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PlanPage;
