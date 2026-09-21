import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ConnectedGuard from "../../components/guards/connectedGuard";
import Layout from "../../components/vitrine/Layout";
import styles from "../../styles/vitrine/PasswordRecover.module.scss";

function ResetPassword(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { token: token } = router.query;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [userId, setUserId] = useState("");

  const checkToken = async () => {
    try {
      const { data } = await axios.post("/api/auth/checkresettoken", {
        token: token,
      });
      setUserId(data.userId);
      setLoading(false);
    } catch (error) {
      router.push("/");
    }
  };

  useEffect(() => {
    router.query.token && checkToken();
  }, [router]);

  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, [userInfo]);

  const changePassword = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    if (password !== confirmPassword) {
      return (
        enqueueSnackbar("Passwords do not match!", {
          variant: "warning",
        }),
        setFormLoading(false)
      );
    }
    try {
      const { data } = await axios.put(`/api/auth/changePassword/${userId}`, {
        password: password,
        token: token,
      });
      enqueueSnackbar(data.message, { variant: "success" });
      router.push("/");
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
      setFormLoading(false);
    }
  };

  return (
    <ConnectedGuard>
      <Layout
        title={"Change password"}
        description={"Enter your new password"}
        image={"/images/forgot_password.svg"}
      >
        {loading ? (
          <div className="spinner">
            <CircularProgress />
          </div>
        ) : (
          <div className={styles.row}>
            <div className={styles.container}>
              <form id="form" onSubmit={changePassword} className={styles.form}>
                <h1>change your password</h1>
                <div className="labeledInput">
                  <label>password</label>
                  <input
                    required
                    minLength="8"
                    maxLength="20"
                    pattern="^[a-zA-Z0-9]{8,20}$"
                    title="Password must be between 8 and 20 characters and contain only letters and digits."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="defaultInput"
                    type="password"
                  />
                </div>
                <div className="labeledInput">
                  <label>confirm password</label>
                  <input
                    required
                    minLength="8"
                    maxLength="20"
                    pattern="^[a-zA-Z0-9]{8,20}$"
                    title="Password must be between 8 and 20 characters and contain only letters and digits."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="defaultInput"
                    type="password"
                  />
                </div>
                &nbsp;
                <Button
                  disabled={formLoading}
                  type="submit"
                  form="form"
                  style={{
                    background: "black",
                    color: "white",
                    height: "35px",
                    width: "100%",
                  }}
                  variant="contained"
                >
                  {formLoading ? (
                    <CircularProgress style={{ color: "white" }} size={20} />
                  ) : (
                    "confirm"
                  )}
                </Button>
              </form>
            </div>

            <div className={styles.col40}>
              <img
                alt="cyber-mall-login"
                src={"/" + "./images/forgot_password.svg"}
              />
            </div>
          </div>
        )}
      </Layout>
    </ConnectedGuard>
  );
}

export default ResetPassword;
