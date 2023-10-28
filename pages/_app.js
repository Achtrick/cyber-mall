import "../styles/globals.scss";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import PropTypes from "prop-types";
import createEmotionCache from "../utils/config/cahce";
import lightTheme from "../utils/theme/theme";
import { SnackbarProvider } from "notistack";
import { wrapper, store } from "../redux/store";
import { Provider } from "react-redux";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import React from "react";
import "devextreme/dist/css/dx.light.css";

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  return (
    <>
      {/* <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GOOGLE_ANALYTICS}`}
      />

      <Script strategy="lazyOnload" id="google-analytics">
        {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${process.env.GOOGLE_ANALYTICS}', {
      page_path: window.location.pathname,
      });
  `}
      </Script> */}
      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <SnackbarProvider
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              >
                <Component className="dx-viewport" {...pageProps} />
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
