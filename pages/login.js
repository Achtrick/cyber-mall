import { Button, CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ConnectedGuard from "../components/guards/connectedGuard";
import Layout from "../components/vitrine/Layout";
import styles from "../styles/vitrine/LoginShop.module.scss";
import { getError } from "../utils/shared/getError";
import { VisibilityIcon, VisibilityOffIcon } from "../utils/theme/icons";

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
      <Layout
        title={"Se connecter"}
        description={"Connecter-vous et bonne vente"}
        image={"/images/login.svg"}
      >
        <section className={styles.container}>
          <div className={styles.row}>
            <div className={styles.col}>
              <section className={styles.form}>
                <h1
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="100"
                >
                  Se connecter
                </h1>
                <form id="form" onSubmit={login}>
                  <input
                    className="defaultInput"
                    required
                    onChange={onChange}
                    type="email"
                    name="email"
                    placeholder="email"
                    data-aos="fade-up"
                    data-aos-offset="100"
                    data-aos-delay="300"
                  />
                  <div
                    data-aos="fade-up"
                    data-aos-offset="100"
                    data-aos-delay="500"
                    className={styles.passwordContainer}
                  >
                    <input
                      className="defaultInput"
                      required
                      onChange={onChange}
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      placeholder="mot de passe"
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
                  <div
                    data-aos="fade-up"
                    data-aos-offset="100"
                    data-aos-delay="700"
                  >
                    <Button
                      disabled={loading}
                      type="submit"
                      form="form"
                      style={{
                        background: "black",
                        color: "white",
                        height: "35px",
                        width: "160px",
                      }}
                      variant="contained"
                    >
                      {loading ? (
                        <CircularProgress
                          style={{ color: "white" }}
                          size={20}
                        />
                      ) : (
                        "se connecter"
                      )}
                    </Button>
                  </div>
                </form>
                <br />
                <p
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="900"
                >
                  Vous n&apos;avez pas de compte ?{" "}
                  <Link href={"/register"}>S&apos;inscrire !</Link>
                </p>
                <p
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="1100"
                >
                  Mot de passe oublié ?{" "}
                  <Link href={"/forgot-password"}>Récupérez-le !</Link>
                </p>
              </section>
            </div>
            <div className={styles.col}>
              <img
                data-aos="fade-up"
                data-aos-offset="100"
                data-aos-delay="500"
                alt="cyber-mall-login"
                src="images/login.svg"
              />
            </div>
          </div>
        </section>
      </Layout>
    </ConnectedGuard>
  );
}

export default Login;
