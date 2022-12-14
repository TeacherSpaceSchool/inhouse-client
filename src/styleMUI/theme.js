import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  palette: {
    primary: {
      main: '#183B37',
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
