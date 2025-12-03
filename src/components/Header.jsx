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
import logo from "../assets/images/logo-with-letters-2.png";
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

const HIGHLIGHTS_URL =
  "https://www.hudl.com/video/3/79017/5721ae5c4df6124b70e5735b";

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
                  alt="Company Logo"
                  style={{
                    height: "50px",
                    width: "auto",
                  }}
                />
              </Link>
            </Box>

            {/* Desktop nav (right side) */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                justifyContent: "space-around",
                padding: "0 10px",
                gap: "10px",
              }}
            >
              {/* Highlights – external link */}
              <a
                href={HIGHLIGHTS_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Button color="primary" variant="contained">
                  Highlights
                </Button>
              </a>

              <Link to="/calendar" style={{ textDecoration: "none" }}>
                <Button color="primary" variant="contained">
                  Calendar
                </Button>
              </Link>

              <Link to="/working-board" style={{ textDecoration: "none" }}>
                <Button color="primary" variant="contained">
                  Dashboard
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

            {/* Mobile Menu Icon */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <Button onClick={toggleDrawer(true)} color="primary">
                <MenuIcon />
              </Button>
            </Box>

            {/* Mobile Drawer */}
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
                {/* Highlights – external link */}
                <a
                  href={HIGHLIGHTS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "black", textDecoration: "none" }}
                >
                  <MenuItem>Highlights</MenuItem>
                </a>

                <Link to="/calendar" style={{ color: "black" }}>
                  <MenuItem>Calendar</MenuItem>
                </Link>

                <Link to="/working-board" style={{ color: "black" }}>
                  <MenuItem>Dashboard</MenuItem>
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