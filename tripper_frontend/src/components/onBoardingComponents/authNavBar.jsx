import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Select,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/navImage.png";
import { Message } from "@mui/icons-material";
import { AccountCircle } from "@mui/icons-material";
const HostNavbar = () => {
  const navigate = useNavigate();

    const token = localStorage.getItem("token");
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfile = () => {
    handleMenuClose();
    navigate("/guest/profile");
  };

  const handleLogout = () => {
    handleMenuClose();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("plan");
    navigate("/login");
    console.log("Logout clicked");
  };

  

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backgroundColor: "white",
        color: "black",
        borderBottom: "1px solid #eee",
        boxShadow: "0px 1px 4px rgba(0,0,0,0.05)",
        transition: "none",
        zIndex: 1201,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: { xs: 2, sm: 4, md: 6 },
          height: "64px",
          minHeight: "64px",
          position: "relative",
        }}
      >
        {/* ✅ Left - Logo */}
        <Box
          component="img"
          src={logo}
          alt="Tripper logo with slogan"
          sx={{
            height: 40,
            width: 200,
            objectFit: "cover",
            mb: 1,
          }}
        />

        {/*  Center - Navigation (desktop only) */}
      

        {/*  Right - Switch + Avatar + Menu Icon */}

        {
          token==null?
                  <Button
                    variant="contained"
                    size="medium"
                    sx={{
                      backgroundColor: "#f27244",
                      borderRadius: "15px",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { backgroundColor: "#034959" },
                    }}
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </Button>
                :<Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Message sx={{ color: "#f27244", fontSize: 28 }} onClick={() => navigate("/chat")} cursor="pointer"/>
                  
          

       

             <IconButton
                          color="inherit"
                          onClick={handleProfile}
                        >
                          <AccountCircle sx={{ color: "#333" }} />
                        </IconButton>

          {/* Menu Icon */}
          <IconButton
            onClick={handleMenuOpen}
            sx={{
              border: "1px solid #ddd",
              borderRadius: "50%",
              "&:hover": { backgroundColor: "#f7f7f7" },
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            disableScrollLock
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1.2,
                borderRadius: 2,
                boxShadow: "0px 4px 15px rgba(0,0,0,0.1)",
                minWidth: 170,
              },
            }}
          >
            <MenuItem onClick={handleProfile}>Profile</MenuItem>
            <Divider />
          
            <Divider />
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Box>
        }
        
      </Toolbar>
    </AppBar>
  );
};

export default HostNavbar;
