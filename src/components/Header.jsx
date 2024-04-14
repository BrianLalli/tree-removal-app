import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  MenuItem,
  Slide,
  useScrollTrigger,
  Drawer,
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
          boxShadow: 'none',
          bgcolor: 'transparent',
          backgroundImage: 'none',
          zIndex: theme => theme.zIndex.drawer + 1, // Ensure AppBar is above other content
          padding: '10px 0', // More vertical padding to elevate design
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
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
                  alt="Company Logo"
                  style={{
                    height: "50px",
                    width: "auto",
                  }}
                />
              </Link>
            </Box>
            <Box
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              <Link to="/calendar" style={{ textDecoration: "none", marginRight: "10px" }}>
                <Button color="primary" variant="contained">
                  Calendar
                </Button>
              </Link>
              <Button
                color="primary"
                variant="contained"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
            { !drawerOpen && // This line ensures the button is hidden when the drawer is open
              <Box sx={{ display: { xs: "block", md: "none" } }}>
                <Button onClick={toggleDrawer(true)} color="primary">
                  <MenuIcon />
                </Button>
              </Box>
            }
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
                <Link to="/calendar" style={{ color: "black" }}>
                  <MenuItem>Calendar</MenuItem>
                </Link>
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
