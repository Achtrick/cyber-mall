import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from "next/router";
import { SnackbarProvider } from "notistack";
import PropTypes from "prop-types";
import React, { useEffect } from "react";
import CookieConsent from "react-cookie-consent";
import { Provider } from "react-redux";
import { store, wrapper } from "../redux/store";
import "../styles/globals.scss";
import createEmotionCache from "../utils/config/cahce";
import lightTheme from "../utils/theme/theme";

const clientSideEmotionCache = createEmotionCache();

function MyApp(props) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  const isSa = router.pathname.includes("super-admin");

  useEffect(() => {
    AOS.init({
      once: true,
      duration: 1500,
      delay: 500,
    });
  }, []);

  return (
    <>
      <CookieConsent
        location="bottom"
        buttonText="Je Comprend"
        cookieName="cyber-mall-cookies-consent"
        style={{ background: "#000", borderTop: "1px solid #ccc" }}
        buttonStyle={{ backgroundColor: "#fff", fontSize: "15px" }}
        expires={150}
      >
        Ce site utilise des cookies pour améliorer l&apos;expérience
        utilisateur.
      </CookieConsent>
      <Provider store={store}>
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <SnackbarProvider
                anchorOrigin={
                  isSa
                    ? { vertical: "top", horizontal: "center" }
                    : { vertical: "bottom", horizontal: "center" }
                }
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
