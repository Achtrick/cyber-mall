import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { CircularProgress } from "@mui/material";

function ConnectedGuard(props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo !== null) {
      switch (userInfo.role) {
        case "ADMIN":
          router.push("admin/categories");
          setLoading(false);
          break;
        case "CLIENT":
          router.pathname === "our-shops" ? null : router.push("/our-shops");
          setLoading(false);
          break;
        default:
          break;
      }
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

export default ConnectedGuard;
