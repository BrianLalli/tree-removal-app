import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <Container
      maxWidth="md"
      sx={{ padding: 0, textAlign: "center", py: { xs: 6, sm: 10 } }}
    >
      <Box
        sx={{
          display: "inline-block",
          px: 1.5,
          py: 0.5,
          mb: 3,
          mt: { xs: 6, sm: 8 },
          borderRadius: 999,
          border: "1px solid rgba(58,182,73,0.35)",
          bgcolor: "rgba(58,182,73,0.1)",
          color: "#7fdc8a",
          fontSize: "0.8125rem",
          fontWeight: 600,
        }}
      >
        Two Guys Tree Service
      </Box>
      <Typography
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 800,
          fontSize: { xs: "2.5rem", sm: "3rem", md: "4.25rem" },
          lineHeight: 1.05,
          letterSpacing: "-0.035em",
          color: "#ffffff",
        }}
      >
        Tree removal made easy
      </Typography>

      <Typography
        variant="h5"
        paragraph
        sx={{
          fontWeight: 400,
          fontSize: { xs: "1.05rem", sm: "1.25rem", md: "1.375rem" },
          color: "rgba(255,255,255,0.65)",
          maxWidth: 560,
          mx: "auto",
          mb: 5,
        }}
      >
        Manage simple to complex jobs and everything in between
      </Typography>

      <Button
        component={Link}
        to="/working-board"
        variant="contained"
        size="large"
        endIcon={<ArrowForwardIcon />}
        sx={{
          px: 4,
          py: 1.5,
          fontSize: "1.0625rem",
          borderRadius: 999,
          boxShadow: "0 8px 24px rgba(58,182,73,0.35)",
          "&:hover": { bgcolor: "primary.dark", color: "#fff" },
        }}
      >
        Get Started
      </Button>
    </Container>
  );
};

export default HomePage;
