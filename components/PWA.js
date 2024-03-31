import { Download } from "@mui/icons-material";
import { useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";

const InstallPWA = ({ appName, accentColor }) => {
  const [supportsPWA, setSupportsPWA] = useState(false);
  const [promptInstall, setPromptInstall] = useState(null);
  const isMobile = useMediaQuery("(max-width:768px)");

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setSupportsPWA(true);
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
      style={
        isMobile
          ? {
              position: "fixed",
              bottom: "10px",
              right: "10px",
              zIndex: "10000",
              height: "40px",
              width: "40px",
              borderRadius: "4px",
              padding: "2px",
              backgroundColor: accentColor,
            }
          : {
              position: "fixed",
              top: "22.5px",
              right: "10px",
              zIndex: "10000",
              height: "30px",
              width: "30px",
              borderRadius: "4px",
              padding: "2px",
              backgroundColor: accentColor,
            }
      }
      id="setup_button"
      aria-label={`installer l'application : ${appName}`}
      title={`installer l'application : ${appName}`}
      onClick={onClick}
    >
      <Download />
    </button>
  );
};

export default InstallPWA;
