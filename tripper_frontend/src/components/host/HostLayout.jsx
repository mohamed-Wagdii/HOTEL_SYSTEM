import React from "react";
import { Box, CssBaseline } from "@mui/material";
import HostNavbar from "./HostNavbar";

const HostLayout = ({ children }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <CssBaseline />

      <HostNavbar />

      {/*  Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: 3,
          p: { xs: 2, md: 3 },
          backgroundColor: "#f5f5f5",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default HostLayout;
