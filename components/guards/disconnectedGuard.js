import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function DisconnectedGuard(props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const { userInfo } = useSelector((state) => state.auth);

  axios.defaults.headers.common["Authorization"] = userInfo?.token;

  useEffect(() => {
    if (userInfo === null) {
      router.push("/");
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [userInfo, router]);

  return loading ? (
    <div className="auth-guard-loader">
      <div className="loaderContainer">
        <img
          width="60px"
          style={{ opacity: "0.8" }}
          alt="cyber-mall"
          src="/images/icon.svg"
        />
        <CircularProgress
          size={100}
          color="secondary"
          sx={{
            opacity: 0.3,
            position: "absolute",
            top: "calc(50% - 50px)",
            left: "calc(50% - 50px)",
            zIndex: 1,
          }}
        />
      </div>
    </div>
  ) : (
    <div>{props.children}</div>
  );
}

export default DisconnectedGuard;
