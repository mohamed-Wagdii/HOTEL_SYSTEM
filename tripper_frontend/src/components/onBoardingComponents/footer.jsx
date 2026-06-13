import React from "react";
import { Box, Typography, Link, Stack, IconButton } from "@mui/material";
import { Facebook, Instagram, Twitter } from "@mui/icons-material";

export default function FooterComponent() {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        py: 6,
        px: { xs: 2, md: 8 },
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderTop: "1px solid #eee",
      }}
    >
      <Box sx={{ width: { xs: "100%", md: "20%" }, mb: { xs: 4, md: 0 } }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1a1a3c" }}>
          Tripper<span style={{ color: "#4a6cf7" }}>.</span>
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={1}>
          Tripper is an online Discovery platform that allows users to Discover unique experiences, services, and local events.
                  </Typography>
      </Box>

      <Box>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "#1a1a3c" }}
        >
          Company
        </Typography>
        <Stack spacing={0.5}>
          <Link href="#" color="inherit" underline="none">About</Link>
        </Stack>
      </Box>

      <Box>
        <Typography
          variant="subtitle1"
          sx={{ fontWeight: "bold", mb: 1, color: "#1a1a3c" }}
        >
          Contact
        </Typography>
        <Stack spacing={0.5}>
          <Link href="#" color="inherit" underline="none">Help/FAQ</Link>
        </Stack>
      </Box>

      <Box sx={{ textAlign: { xs: "left", md: "right" } }}>
        <Stack direction="row" spacing={1} justifyContent={{ xs: "flex-start", md: "flex-end" }}>
          <IconButton><Facebook /></IconButton>
          <IconButton><Instagram /></IconButton>
          <IconButton><Twitter /></IconButton>
        </Stack>
      </Box>

      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          mt: 4,
          borderTop: "1px solid #eee",
          pt: 2,
        }}
      >
        <Typography variant="body2" color="#5E6282">
          All rights reserved © Tripper.com
        </Typography>
      </Box>
    </Box>
  );
}
