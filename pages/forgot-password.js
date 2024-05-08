import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ConnectedGuard from "../components/guards/connectedGuard";
import Layout from "../components/vitrine/Layout";
import styles from "../styles/vitrine/PasswordRecover.module.scss";
import { getError } from "../utils/shared/getError";

function ForgotPassword(props) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const { userInfo } = useSelector((state) => state.auth);

  const { enqueueSnackbar } = useSnackbar();

  const recoverPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/recoverPassword", {
        email: email,
      });
      enqueueSnackbar(data.message, { variant: "success" });
      setLoading(false);
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      router.push("/");
    }
  }, [userInfo]);

  return (
    <ConnectedGuard>
      <Layout
        title={"Mot de passe oublié"}
        description={
          "Vous avez oubliée votre mot de passe, ce n'est pas un problème, ont est là !."
        }
        image={"/images/forgot_password.svg"}
      >
        <div className={styles.row}>
          <div className={styles.container}>
            <form id="form" onSubmit={recoverPassword} className={styles.form}>
              <h1 data-aos="fade-up" data-aos-offset="100" data-aos-delay="100">
                récupérer votre mot de passe
              </h1>
              <div
                data-aos="fade-up"
                data-aos-offset="100"
                data-aos-delay="200"
                className="labeledInput"
              >
                <label>email</label>
                <input
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="defaultInput"
                  type="email"
                />
              </div>
              &nbsp;
              <div
                data-aos="fade-up"
                data-aos-offset="100"
                data-aos-delay="300"
              >
                <Button
                  disabled={loading}
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
                  {loading ? (
                    <CircularProgress style={{ color: "white" }} size={20} />
                  ) : (
                    "récupérer"
                  )}
                </Button>
              </div>
            </form>
            <p data-aos="fade-up" data-aos-offset="100" data-aos-delay="400">
              un lien de récupération vas être envoyer à votre email.
            </p>
            <p
              data-aos="fade-up"
              data-aos-offset="100"
              data-aos-delay="500"
              style={{ color: "red" }}
            >
              S&apos;il vous plaît vérifiez votre dossier spam si vous ne
              recevez pas le lien dans votre Inbox pour quelques raisons !
            </p>
          </div>

          <div className={styles.col40}>
            <img
              data-aos="fade-up"
              data-aos-offset="100"
              data-aos-delay="100"
              alt="cyber-mall-forgot-password"
              src="./images/forgot_password.svg"
            />
          </div>
        </div>
      </Layout>
    </ConnectedGuard>
  );
}

export default ForgotPassword;
