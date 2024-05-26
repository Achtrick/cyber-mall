import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: { minWidth: 0 },
      },
    },
  },
  palette: {
    mode: "light",
    white: { main: "#FFFFFF" },
    black: { main: "#000000" },
    primary: { main: "#bb84e8" },
    secondary: { main: "#ec008c" },
    third: { main: "#9F0404" },
    error: { main: "#df4646" },
    success: { main: "#50fb39" },
    warning: { main: "#fba239" },
    shop1: { main: "#F2AFEF" },
    shop2: { main: "#C499F3" },
    shop3: { main: "#7360DF" },
    shop4: { main: "#33186B" },
    shop5: { main: "#11235A" },
    shop6: { main: "#11105B" },
    shop7: { main: "#10008B" },
  },
});

export default lightTheme;
