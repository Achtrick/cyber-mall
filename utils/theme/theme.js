import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#bb84e8" },
    secondary: { main: "#ec008c" },
    third: { main: "#9F0404" },
    error: { main: "#df4646" },
    success: { main: "#50fb39" },
    warning: { main: "#fba239" },
  },
});

export default lightTheme;
