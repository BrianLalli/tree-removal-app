import React from 'react';
import { Box, Container, Typography, Link, IconButton, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const FooterBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
  backgroundColor: theme.palette.grey[900], // Ensure this is set to a defined dark color
  color: theme.palette.getContrastText(theme.palette.grey[900]), // Adapting text color for better contrast
  padding: theme.spacing(1, 0), // Reduced vertical padding for a thinner footer
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const StyledLink = styled(Link)(({ theme }) => ({
  color: theme.palette.getContrastText(theme.palette.grey[900]),
  '&:hover': {
    textDecoration: 'none',
    color: theme.palette.primary.light,
  },
}));

const Footer = () => {
  return (
    <FooterBox>
      <Container maxWidth="lg">
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item>
            <Typography variant="body2" color="inherit">
              © {new Date().getFullYear()} Two Guys Tree Service. All rights reserved.
            </Typography>
          </Grid>
          <Grid item>
            <IconButton color="inherit" component="a" href="https://twitter.com">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit" component="a" href="https://facebook.com">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit" component="a" href="https://instagram.com">
              <InstagramIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Container>
    </FooterBox>
  );
};

export default Footer;
