import { createTheme } from "@mui/material/styles";

const bodyFont = "var(--font-body), system-ui, sans-serif";
const headingFont = "var(--font-heading), var(--font-body), sans-serif";

const lightTheme = createTheme({
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: bodyFont,
    h1: { fontFamily: headingFont, fontWeight: 700 },
    h2: { fontFamily: headingFont, fontWeight: 700 },
    h3: { fontFamily: headingFont, fontWeight: 600 },
    h4: { fontFamily: headingFont, fontWeight: 600 },
    h5: { fontFamily: headingFont, fontWeight: 600 },
    h6: { fontFamily: headingFont, fontWeight: 600 },
    button: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minWidth: 0,
          borderRadius: 10,
          transition: "all 0.25s ease",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { transition: "box-shadow 0.3s ease, transform 0.3s ease" },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: "#fff",
          fontSize: 14,
          transition: "box-shadow 0.2s ease",
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#cfc7dc",
            transition: "border-color 0.2s ease",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#bb84e8",
          },
          "&.Mui-focused": { boxShadow: "0 0 0 3px #bb84e83d" },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#bb84e8",
            borderWidth: 1,
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: { root: { maxWidth: "100%" } },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          marginTop: 6,
          boxShadow: "0 12px 32px rgba(27, 22, 34, 0.16)",
          border: "1px solid #e6e1ee",
        },
        option: { fontSize: 14 },
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
