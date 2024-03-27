// src/theme-dark.js
import { createTheme } from '@mui/material/styles';

const themeDark = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#9c27b0', // Adjust the color for your dark theme
    },
    secondary: {
      main: '#673ab7', // Adjust the color for your dark theme
    },
    error: {
      main: '#f44336', // You might keep this the same or adjust for dark theme
    },
    background: {
      default: '#242424', // Darker background for dark mode
      paper: '#424242',
    },
    text: {
      primary: '#ffffff', // Brighter text for dark mode
      secondary: '#adb5bd', // Adjust as needed
    },
  },
  typography: {
    // Define typography for dark mode if needed; otherwise, keep it same as light theme
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
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Customize button border radius for dark mode if needed
        },
      },
    },
  },
});

export default themeDark;
