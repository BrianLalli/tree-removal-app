import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../src/theme/theme.js'; // Import your custom theme
import App from './App.jsx';
import './index.css';

const root = document.getElementById('root');

if (root) {
  ReactDOM.createRoot(root).render(
    // <React.StrictMode>
      <ThemeProvider theme={theme}> {/* Now using your custom theme */}
        <App />
      </ThemeProvider>
    // </React.StrictMode>,
  );
}
