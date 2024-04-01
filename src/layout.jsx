// src/components/Layout.jsx
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Container component="main" sx={{ mt: 9, mb: 2, flexGrow: 1 }}>
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default Layout;
