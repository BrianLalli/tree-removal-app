// src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3ab649', // Your primary brand color
    },
    secondary: {
      main: '#3FA646', // Your secondary brand color
    },
    error: {
      main: '#f44336', // Example error color
    },
    background: {
      default: '#F2F2F2', // Light background color
      paper: '#ffffff', // Background for paper-like elements
    },
    text: {
      primary: '#0D0000', // Primary text color
      secondary: '#5BA660', // Secondary text color for less prominence
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h1: {
      fontSize: '2.25rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
    },
    // Define other styles as needed
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Example of customizing the border radius
        },
      },
    },
    // Add more component customizations as needed
  },
  // You can also add custom utilities, mixins, or functions to use across your app
});

export default theme;

