import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Layout from "../../components/vitrine/Layout";
import styles from "../../styles/vitrine/LoginShop.module.scss";
import ConnectedGuard from "../../components/guards/connectedGuard";

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
    checkToken();
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
        enqueueSnackbar("les mots de passes ne correspond pas !", {
          variant: "warning",
        }),
        setFormLoading(false)
      );
    }
    try {
      const { data } = await axios.put(`/api/auth/changePassword/${userId}`, {
        password: password,
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
      <Layout>
        {loading ? (
          <div className="spinner">
            <CircularProgress />
          </div>
        ) : (
          <div className={styles.row}>
            <div className={styles.container}>
              <form onSubmit={changePassword} className={styles.form}>
                <h1>changer votre mot de passe</h1>
                <div className="labeledInput">
                  <label>mot de passe</label>
                  <input
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="defaultInput"
                    type="password"
                  />
                </div>
                <div className="labeledInput">
                  <label>confirmer le mot de passe</label>
                  <input
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="defaultInput"
                    type="password"
                  />
                </div>
                &nbsp;
                <button style={{ width: "100%" }} className="defaultBtn">
                  {formLoading ? (
                    <CircularProgress size={"30px"} sx={{ color: "white" }} />
                  ) : (
                    "confirmer"
                  )}
                </button>
              </form>
            </div>

            <div className={styles.col40}>
              <img
                alt="transportini-login"
                src={"/" + "./images/register.webp"}
              />
            </div>
          </div>
        )}
      </Layout>
    </ConnectedGuard>
  );
}

export default ResetPassword;
