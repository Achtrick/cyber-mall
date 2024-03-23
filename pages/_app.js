import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { SnackbarProvider } from "notistack";
import PropTypes from "prop-types";
import React from "react";
import { Provider } from "react-redux";
import { store, wrapper } from "../redux/store";
import "../styles/globals.scss";
import createEmotionCache from "../utils/config/cahce";
import lightTheme from "../utils/theme/theme";

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <>
      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <SnackbarProvider
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                style={{ marginTop: "60px" }}
              >
                <Component {...pageProps} />
              </SnackbarProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </CacheProvider>
      </Provider>
    </>
  );
}

export default wrapper.withRedux(MyApp);

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
};
