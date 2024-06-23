import { Download } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

const InstallPWA = ({ top }) => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const isMobile = useMediaQuery("(max-width:800px)");

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
      setSupportsPWA(isCookiePresent("cyber-mall-cookies-consent") && true);
      setPromptInstall(e);
    };
    window.addEventListener("beforeinstallprompt", handler);

    return () => window.removeEventListener("transitionend", handler);
  }, []);

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
