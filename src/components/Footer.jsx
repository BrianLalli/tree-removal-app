import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, IconButton, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';

const FooterBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  left: 0,
  bottom: 0,
  width: '100%',
  backgroundColor: 'rgba(14, 20, 17, 0.9)',
  backdropFilter: 'blur(12px)',
  color: 'rgba(255, 255, 255, 0.7)',
  padding: theme.spacing(1, 0),
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  display: 'none', // Initially hide footer
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(1, 2), // Increase side padding on smaller screens
  },
}));

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <FooterBox style={{ display: isVisible ? 'block' : 'none' }}>
      <Container maxWidth="lg">
        <Grid container alignItems="center" justifyContent="space-between" spacing={1}>
          <Grid item xs={12} sm={6} textAlign={{ xs: 'center', sm: 'left' }}>
            <Typography variant="body2" color="inherit">
              © {new Date().getFullYear()} Two Guys Tree Service. All rights reserved.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} textAlign={{ xs: 'center', sm: 'right' }}>
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
