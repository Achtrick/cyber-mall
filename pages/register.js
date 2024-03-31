import { Button, CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import ConnectedGuard from "../components/guards/connectedGuard";
import Layout from "../components/vitrine/Layout";
import styles from "../styles/vitrine/RegisterShop.module.scss";
import { getError } from "../utils/shared/getError";
import { VisibilityIcon, VisibilityOffIcon } from "../utils/theme/icons";

function Register(props) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    shopName: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      return enqueueSnackbar("les mots de passe ne correspondent pas", {
        variant: "warning",
      });
    }
    try {
      await axios.post("api/auth/register", formData);
      enqueueSnackbar("vérifiez votre email pour vérifier votre compte.", {
        variant: "info",
      });
      setLoading(false);
      router.push("/login");
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  return (
    <ConnectedGuard>
      <Layout
        title={"S'inscrire"}
        description={"Inscrivez-vous et bonne vente"}
        image={"/images/register_animated.gif"}
      >
        <section className={styles.container}>
          <div className={styles.row}>
            <section className={styles.col}>
              <form id="form" onSubmit={register}>
                <h1>créez votre shop</h1>
                <input
                  className="defaultInput"
                  required
                  onChange={onChange}
                  type="text"
                  name="firstName"
                  placeholder="Prénom"
                />
                <input
                  className="defaultInput"
                  required
                  onChange={onChange}
                  type="text"
                  name="lastName"
                  placeholder="Nom"
                />
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
                <input
                  className="defaultInput"
                  required
                  onChange={onChange}
                  type={passwordVisible ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="confirmer mot de passe"
                />
                <input
                  className="defaultInput"
                  required
                  onChange={onChange}
                  type="text"
                  name="shopName"
                  placeholder="Nom de shop"
                />
                <br />
                <br />
                <Button
                  disabled={loading}
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
                    "S'inscrire"
                  )}
                </Button>
                <br />
                <br />
                <p>
                  Vous avez déjà un compte ?{" "}
                  <Link href={"/login"}>Se connecter !</Link>
                </p>
                <br />
              </form>
            </section>
            <div className={styles.col}>
              <img src="/images/register_animated.gif" />
            </div>
          </div>
        </section>
      </Layout>
    </ConnectedGuard>
  );
}

export default Register;
