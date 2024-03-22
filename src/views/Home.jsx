import React from "react";
import {
  Container,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  "&.MuiToggleButton-root": {
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: 8,
    margin: theme.spacing(1),
    color: theme.palette.primary.main,
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
      color: theme.palette.common.white,
    },
    "&.Mui-selected": {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      "&:hover": {
        backgroundColor: theme.palette.primary.dark,
      },
    },
  },
}));

const HomePage = () => {
  // state and functions to handle toggle logic
  const [managementType, setManagementType] = React.useState(null);

  const handleManagementType = (event, newType) => {
    setManagementType(newType);
  };

  return (
    <Container maxWidth="md" sx={{ textAlign: "center", py: 8 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Tree removal made easy
      </Typography>
      <Typography variant="h5" color="textSecondary" paragraph>
        Manage simple to complex jobs and everything in between
      </Typography>
      <Typography gutterBottom>Select what you want to manage:</Typography>
      <ToggleButtonGroup
        value={managementType}
        exclusive
        onChange={handleManagementType}
        aria-label="management type"
      >
        <StyledToggleButton value="jobs">Jobs</StyledToggleButton>
        <StyledToggleButton value="opportunities">
          Opportunities
        </StyledToggleButton>
        <StyledToggleButton value="customers">Customers</StyledToggleButton>
        <StyledToggleButton value="invoices">Invoices</StyledToggleButton>
        <StyledToggleButton value="calendar">Calendar</StyledToggleButton>
        {/* Add other management type buttons here */}
      </ToggleButtonGroup>
      <Box mt={2}></Box>
    </Container>
  );
};

export default HomePage;
