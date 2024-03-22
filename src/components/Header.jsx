import * as React from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Container,
  MenuItem,
  Typography,
  Drawer,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import supabase from "../utils/supabaseClient";

const Header = () => {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

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
    if (error) console.error("Error signing out", error);
    setDrawerOpen(false); // Close the drawer on logout
  };

  return (
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
            <Typography variant="h6" component="div" sx={{ color: "white" }}>
              Two Guys Tree Service
            </Typography>
            {/* The rest of your items (if any) would go here */}
          </Box>
          {/* Logout Button aligned to the right */}
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            <Button color="primary" variant="contained" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
          {/* Mobile Menu Icon Here */}
          <Box sx={{ display: { xs: "block", md: "none" } }}>
            <Button onClick={toggleDrawer(true)} color="inherit">
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
  );
};

export default Header;
