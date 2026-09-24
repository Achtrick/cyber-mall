import { Download } from "@mui/icons-material";
import { useEffect, useState } from "react";

const InstallPWA = () => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);

  function isCookiePresent(cookieName) {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(cookieName + "=")) {
        return true;
      }
    }

    return false;
  }

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // `beforeinstallprompt` fires once, early in the page lifecycle -- usually
  // before the user has had a chance to accept the cookie-consent banner.
  // Re-derive visibility reactively instead of freezing the consent check
  // inside that one-shot handler, so the button appears as soon as both the
  // install prompt is available AND consent is granted, whichever comes last.
  useEffect(() => {
    if (!promptInstall) {
      return;
    }
    if (isCookiePresent("cyber-mall-cookies-consent")) {
      setSupportsPWA(true);
      return;
    }
    const interval = setInterval(() => {
      if (isCookiePresent("cyber-mall-cookies-consent")) {
        setSupportsPWA(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [promptInstall]);

  const onClick = (evt) => {
    evt.preventDefault();
    if (!promptInstall) {
      return;
    }
    promptInstall.prompt();
  };
  if (!supportsPWA) {
    return null;
  }
  return (
    <button
      style={{
        position: "fixed",
        bottom: "10px",
        right: "10px",
        zIndex: "1300",
        height: "30px",
        width: "30px",
      }}
      className="downloadBtn"
      id="setup_button"
      aria-label="Installer l'application"
      title="Installer l'application"
      onClick={onClick}
    >
      <Download />
    </button>
  );
};

export default InstallPWA;
