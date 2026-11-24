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
  Divider,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import supabase from "../utils/supabaseClient";
import logo from "../assets/images/logo-with-letters-2.png";
import { Link, useLocation } from "react-router-dom";

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
  const { pathname } = useLocation();

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

  const navItems = [
    { label: "Dashboard", to: "/working-board" },
    { label: "Calendar", to: "/calendar" },
  ];

  const navButtonSx = (active) => ({
    color: active ? "#ffffff" : "rgba(255,255,255,0.72)",
    bgcolor: active ? "rgba(58,182,73,0.22)" : "transparent",
    px: 1.75,
    "&:hover": {
      bgcolor: active ? "rgba(58,182,73,0.3)" : "rgba(255,255,255,0.08)",
      color: "#ffffff",
    },
  });

  return (
    <HideOnScroll>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "rgba(14, 20, 17, 0.78)",
          backdropFilter: "saturate(160%) blur(12px)",
          backgroundImage: "none",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ display: "flex", justifyContent: "space-between", minHeight: { xs: 60, sm: 68 } }}
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
              <Link to="/" style={{ textDecoration: "none", display: "flex" }}>
                <img
                  src={logo}
                  alt="Company Logo"
                  style={{
                    height: "44px",
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
                gap: 0.5,
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.to}
                  component={Link}
                  to={item.to}
                  sx={navButtonSx(pathname === item.to)}
                >
                  {item.label}
                </Button>
              ))}

              {/* Highlights – external link */}
              <Button
                component="a"
                href={HIGHLIGHTS_URL}
                target="_blank"
                rel="noopener noreferrer"
                sx={navButtonSx(false)}
              >
                Highlights
              </Button>

              <Button
                variant="outlined"
                onClick={handleLogout}
                sx={{
                  ml: 1.5,
                  color: "rgba(255,255,255,0.85)",
                  borderColor: "rgba(255,255,255,0.2)",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.45)",
                    bgcolor: "rgba(255,255,255,0.06)",
                  },
                }}
              >
                Logout
              </Button>
            </Box>

            {/* Mobile Menu Icon */}
            <Box sx={{ display: { xs: "block", md: "none" } }}>
              <IconButton
                onClick={toggleDrawer(true)}
                aria-label="Open menu"
                sx={{ color: "#ffffff" }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Mobile Drawer */}
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={toggleDrawer(false)}
              PaperProps={{ sx: { borderRadius: "16px 0 0 16px" } }}
            >
              <Box
                sx={{ width: 260, py: 2 }}
                role="presentation"
                onClick={toggleDrawer(false)}
                onKeyDown={toggleDrawer(false)}
              >
                {navItems.map((item) => (
                  <MenuItem
                    key={item.to}
                    component={Link}
                    to={item.to}
                    selected={pathname === item.to}
                    sx={{ py: 1.5, px: 3, fontWeight: 500, color: "text.primary" }}
                  >
                    {item.label}
                  </MenuItem>
                ))}

                {/* Highlights – external link */}
                <MenuItem
                  component="a"
                  href={HIGHLIGHTS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ py: 1.5, px: 3, fontWeight: 500, color: "text.primary" }}
                >
                  Highlights
                </MenuItem>

                <Divider sx={{ my: 1 }} />
                <MenuItem
                  onClick={handleLogout}
                  sx={{ py: 1.5, px: 3, fontWeight: 500, color: "text.secondary" }}
                >
                  Logout
                </MenuItem>
              </Box>
            </Drawer>
          </Toolbar>
        </Container>
      </AppBar>
    </HideOnScroll>
  );
};

export default Header;