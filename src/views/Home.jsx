import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { styled } from "@mui/material/styles";
import SearchBar from "../components/SearchBar";

const StyledButton = styled(Button)(({ theme }) => ({
  border: `2px solid ${theme.palette.primary.main}`,
  borderRadius: 12,
  margin: theme.spacing(1), // Slightly increased margin for better spacing around a larger button
  color: theme.palette.common.white,
  backgroundColor: theme.palette.primary.main, // Ensure the button has a background color by default
  transition: "all 0.3s ease",
  "&:hover": {
    transform: "scale(1.05)",
    backgroundColor: theme.palette.primary.dark, // Slightly darker on hover for better contrast
    color: theme.palette.common.white,
  },
  // Increase font size and padding for a bigger button on all screen sizes
  fontSize: '1.25rem', // Larger font size for better visibility
  padding: theme.spacing(2, 4), // Increased padding for a larger overall button size
  [theme.breakpoints.down('sm')]: {
    // Adjustments for small screens can remain or be further customized
    fontSize: '1rem', // You might keep this smaller on very small screens
    padding: theme.spacing(1.5, 3), // Slightly less padding on small screens
  },
}));


const HomePage = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: "center", py: { xs: 4, sm: 8 } }}>
      <Typography
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          fontSize: { xs: '2.5rem', sm: '2.5rem', md: '4rem' },
          lineHeight: 1.0,
          mt: 0,
        }}
      >
        Tree removal made easy
      </Typography>
      
      <Typography
        variant="h5"
        color="textSecondary"
        paragraph
        sx={{
          fontWeight: 500,
          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' },
          mb: 4,
        }}
      >
        Manage simple to complex jobs and everything in between
      </Typography>

      <StyledButton variant="contained">Get Started</StyledButton>
      <SearchBar />
    </Container>
  );
};

export default HomePage;
