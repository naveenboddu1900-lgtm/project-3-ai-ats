import '@fontsource/inter-tight/400.css';
import '@fontsource/inter-tight/600.css';
import '@fontsource/inter-tight/700.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import App from './App.jsx';
import './styles.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#2454c6' },
    secondary: { main: '#c05a1f' },
    background: { default: '#f8f4ee', paper: '#ffffff' },
    text: { primary: '#20242d', secondary: '#6d645c' }
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Inter Tight", Arial, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: 'none', fontWeight: 700 }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8 }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 8, boxShadow: '0 10px 30px rgba(24, 32, 51, 0.08)' }
      }
    }
  }
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  </React.StrictMode>
);
