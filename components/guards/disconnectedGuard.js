import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

function DisconnectedGuard(props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const { userInfo } = useSelector((state) => state.auth);

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
      <CircularProgress color="primary" />
    </div>
  ) : (
    <div>{props.children}</div>
  );
}

export default DisconnectedGuard;
