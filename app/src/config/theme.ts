import { createTheme } from "@mui/material"

export const rotatedColorPool = ["#3EC1D3", "#faff5b", "#FF9A00", "#FF165D"]

const theme = createTheme({
  typography: {
    fontFamily: "Averta, Roboto, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: "bold",
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: "bold",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: "bold",
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: "bold",
    },
    button: {
      textTransform: "none",
      fontWeight: "bold",
    },
    subtitle1: {
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "16px",
      lineHeight: "24px",
      color: "#888888",
    },
    subtitle2: {
      fontStyle: "normal",
      fontWeight: 400,
      fontSize: "14px",
      lineHeight: "24px",
      color: "#888888",
    },
  },
  palette: {
    primary: {
      main: "#9A61BD",
      light: "#D1B7E1",
      dark: "#4E2A65",
      contrastText: "#EFFBF9",
    },
    secondary: {
      main: "#7CDECE",
      light: "#ADEBE0",
      dark: "#259381",
    },
    background: {
      default: "#CEF3ED",
      paper: "#EFFBF9",
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "white",
          color: "#162D45",
          fontSize: 12,
        },
        arrow: {
          color: "white",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        light: {
          borderColor: "#EEEFF0",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        sizeLarge: {
          padding: "10px 40px",
        },
      },
    },
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Averta';
          font-display: swap;
          font-weight: 400;
          src: url('/fonts/Averta-normal.woff2') format('woff2');
        }
        @font-face {
          font-family: 'Averta';
          font-display: swap;
          font-weight: bold;
          src: url('/fonts/Averta-ExtraBold.woff2') format('woff2');
        }`,
    },
  },
})

export default theme
