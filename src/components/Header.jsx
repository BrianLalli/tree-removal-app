import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  MenuItem,
  Typography,
  Drawer,
  Slide,
  useScrollTrigger,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import supabase from "../utils/supabaseClient";
import logo from "../assets/images/logo-with-letters.png";
import { Link } from "react-router-dom";

function HideOnScroll(props) {
  const { children } = props;
  const trigger = useScrollTrigger();

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error("Error signing out", error.message);
    setDrawerOpen(false); // Close the drawer on logout
  };

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        sx={{
          boxShadow: 0,
          bgcolor: "transparent",
          backgroundImage: "none",
          mt: 2,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            {/* Logo aligned to the left */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
                flexGrow: 1,
              }}
            >
              <Link to="/" style={{ textDecoration: "none" }}>
                <img
                  src={logo}
                  alt="Two Guys Tree Service"
                  style={{
                    height: "50px", // Adjust as needed
                    width: "auto",
                  }}
                />
              </Link>
              {/* The rest of your items (if any) would go here */}
            </Box>
            {/* Logout Button aligned to the right */}
            <Box
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              <Button
                color="primary"
                variant="contained"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
            {/* Mobile Menu Icon Here */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <Button onClick={toggleDrawer(true)} color="primary">
                <MenuIcon />
              </Button>
            </Box>
            {/* Mobile Drawer Here */}
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
            >
              <Box
                sx={{ width: 250 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Box>
            </Drawer>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;
