import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      main: '#10183D',
    },
      secondary: {
          main: '#ff0000',
      },
      disable: {
          main: '#e1e1e1',
      },
      green: {
          main: 'green',
      },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
