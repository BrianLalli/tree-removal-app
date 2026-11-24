// src/theme.js
import { createTheme } from '@mui/material/styles';

const fontFamily = [
  'Inter',
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
].join(',');

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3ab649',
      dark: '#2a8f38',
      light: '#6fd27b',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3FA646',
    },
    success: {
      main: '#2E9E44',
    },
    error: {
      main: '#e5484d',
    },
    warning: {
      main: '#f59e0b',
    },
    white: {
      main: '#ffffff',
    },
    background: {
      default: '#F6F8F7',
      paper: '#ffffff',
    },
    text: {
      primary: '#14201a',
      secondary: '#5b6b62',
    },
    divider: '#e3e8e5',
    grey: {
      50: '#f7f9f8',
    },
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily,
    h1: {
      fontSize: '2.25rem',
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600, letterSpacing: '-0.01em' },
    body1: {
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: 0,
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 16,
        },
        sizeLarge: {
          paddingBlock: 10,
          fontSize: '1rem',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: '#ffffff',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: 14 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 16 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
  },
});

export default theme;
