import React, { useEffect, useState } from "react";
import Layout from "../components/vitrine/Layout";
import styles from "../styles/vitrine/LoginShop.module.scss";
import { Button, CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { getError } from "../utils/shared/getError";
import { useDispatch } from "react-redux";
import ConnectedGuard from "../components/guards/connectedGuard";
import { VisibilityIcon, VisibilityOffIcon } from "../utils/theme/icons";
import Link from "next/link";

function Login(props) {
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("api/auth/login", formData);
      dispatch({ type: "USER_LOGIN", payload: data });
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  return (
    <ConnectedGuard>
      <Layout>
        <section className={styles.container}>
          <div className={styles.row}>
            <div className={styles.col}>
              {" "}
              <section className={styles.form}>
                <h1>login</h1>
                <form id="form" onSubmit={login}>
                  <input
                    className="defaultInput"
                    required
                    onChange={onChange}
                    type="email"
                    name="email"
                    placeholder="email"
                  />
                  <div className={styles.passwordContainer}>
                    <input
                      className="defaultInput"
                      required
                      onChange={onChange}
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      placeholder="password"
                    />

                    <IconButton
                      className={styles.passwordVisibilityIcon}
                      style={{ color: "black" }}
                      onClick={togglePasswordVisibility}
                    >
                      {passwordVisible ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </div>
                  <br />
                  <Button
                    type="submit"
                    form="form"
                    style={{
                      background: "black",
                      color: "white",
                      height: "35px",
                      width: "100px",
                    }}
                    variant="contained"
                  >
                    {loading ? (
                      <CircularProgress style={{ color: "white" }} size={20} />
                    ) : (
                      "login"
                    )}
                  </Button>
                </form>
                <br />
                <p>
                  don&apos;t have an account ?{" "}
                  <Link href={"/register"}>Register !</Link>
                </p>
                <p>
                  forgot your password ?{" "}
                  <Link href={"/forgot-password"}>Recover it !</Link>
                </p>
              </section>
            </div>
            <div className={styles.col}>
              <img src="images/login.svg" />
            </div>
          </div>
        </section>
      </Layout>
    </ConnectedGuard>
  );
}

export default Login;
