import React from "react";
import { Container, Typography, Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { styled } from "@mui/material/styles";

// Enhanced ToggleButton with responsive design adjustments
const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  "&.MuiToggleButton-root": {
    border: `2px solid ${theme.palette.primary.main}`,
    borderRadius: 12,
    margin: theme.spacing(0.5), // Adjusted for smaller screens
    color: theme.palette.primary.main,
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      boxShadow: `0 0 10px ${theme.palette.primary.main}`,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem', // Increase font size for better readability on smaller screens
      padding: theme.spacing(1, 2), // Increase padding to make the buttons larger
    },
  },
}));


const HomePage = () => {
  const [managementType, setManagementType] = React.useState(null);

  const handleManagementType = (event, newType) => {
    setManagementType(newType);
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", py: { xs: 4, sm: 8 } }}>
      <Typography
        component="h1"
        gutterBottom
        sx={{
          fontWeight: 700,
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, // Responsive font size
          lineHeight: 1.2,
          mt: 2,
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
          fontSize: { xs: '1rem', sm: '1.25rem', md: '1.5rem' }, // Responsive font size for subtext
          mb: 4,
        }}
      >
        Manage simple to complex jobs and everything in between
      </Typography>
      <Typography
        gutterBottom
        variant="subtitle1"
        sx={{
          fontSize: { xs: '0.875rem', sm: '1rem', md: '1.125rem' }, // Adjust font size for responsiveness
        }}
      >
        Select what you want to manage:
      </Typography>
      <ToggleButtonGroup
        value={managementType}
        exclusive
        onChange={handleManagementType}
        aria-label="management type"
        sx={{
          flexDirection: { xs: 'column', sm: 'row' }, // Stack buttons vertically on smaller screens
          '& .MuiToggleButtonGroup-grouped': {
            margin: theme => theme.spacing(0.5), // Adjust spacing around buttons for smaller screens
          },
        }}
      >
        <StyledToggleButton value="jobs">Jobs</StyledToggleButton>
        <StyledToggleButton value="opportunities">Opportunities</StyledToggleButton>
        <StyledToggleButton value="customers">Customers</StyledToggleButton>
        <StyledToggleButton value="invoices">Invoices</StyledToggleButton>
        <StyledToggleButton value="calendar">Calendar</StyledToggleButton>
        <StyledToggleButton value="dashboard">Dashboard</StyledToggleButton>
      </ToggleButtonGroup>
      <Box mt={2}></Box>
    </Container>
  );
};

export default HomePage;
