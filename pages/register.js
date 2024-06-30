import { Button, CircularProgress, IconButton } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { ModalSizes } from "../components/admin/ModalSettings";
import ConnectedGuard from "../components/guards/connectedGuard";
import XAutoComplete from "../components/ui-components/XAutoComplete";
import XModal from "../components/ui-components/XModal";
import Layout from "../components/vitrine/Layout";
import styles from "../styles/vitrine/RegisterShop.module.scss";
import { ActivityDomains } from "../utils/shared/activityDomains";
import { getError } from "../utils/shared/getError";
import { VisibilityIcon, VisibilityOffIcon } from "../utils/theme/icons";
import { conditionOfUse } from "./condition-of-use";

function Register(props) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: null,
    email: "",
    password: "",
    confirmPassword: "",
    shopName: "",
    activityDomain: "",
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [conditions, setConditions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [labelColor, setLabelColor] = useState("blue");

  const { enqueueSnackbar } = useSnackbar();

  const onChange = (e) => {
    if (e.target.name === "shopName") {
      if (/^[a-zA-Z0-9_-]+$/.test(e.target.value)) {
        setLabelColor("green");
      } else {
        setLabelColor("red");
      }
    }
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleConditions = () => {
    setConditions(!conditions);
  };

  const register = async (e) => {
    e.preventDefault();
    if (!/^[a-zA-Z0-9_-]+$/.test(formData.shopName)) {
      return document.getElementById("shopName").focus();
    }
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
      <XModal
        open={conditions}
        onClose={toggleConditions}
        title={"condition d'utilisation"}
        size={ModalSizes.BIG}
        hideControls={true}
      >
        {conditionOfUse}
      </XModal>
      <Layout
        title={"S'inscrire"}
        description={"Inscrivez-vous et bonne vente"}
        image={"/images/register.svg"}
      >
        <section className={styles.container}>
          <div className={styles.row}>
            <section className={styles.col}>
              <form id="form" onSubmit={register}>
                <h1
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="100"
                >
                  créez votre shop
                </h1>
                <input
                  className="defaultInput"
                  required
                  onChange={onChange}
                  type="text"
                  name="firstName"
                  placeholder="Prénom"
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="200"
                />
                <input
                  className="defaultInput"
                  required
                  onChange={onChange}
                  type="text"
                  name="lastName"
                  placeholder="Nom"
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="300"
                />
                <input
                  className="defaultInput"
                  required
                  onChange={onChange}
                  type="number"
                  name="phone"
                  placeholder="téléphone"
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="400"
                />
                <input
                  className="defaultInput"
                  required
                  onChange={onChange}
                  type="email"
                  name="email"
                  placeholder="email"
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="500"
                />
                <div
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="600"
                  className={styles.passwordContainer}
                >
                  <input
                    className="defaultInput"
                    minLength="8"
                    maxLength="16"
                    pattern="^[a-zA-Z0-9]{8,16}$"
                    title="Le mot de passe doit comporter entre 8 et 16 caractères et contenir uniquement des lettres et des chiffres."
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
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="700"
                />
                <div
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="800"
                >
                  <XAutoComplete
                    options={ActivityDomains}
                    value={formData.activityDomain}
                    optionDisplayExpr="name"
                    optionValueExpr="name"
                    formData={formData}
                    setFormData={setFormData}
                    required={true}
                    placeholder="domaine d'activité"
                    attributeKey="activityDomain"
                  />
                </div>
                <div
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="900"
                  className="labeledInput"
                >
                  <label style={{ color: labelColor }}>
                    Choisissez un nom unique qui ne contient pas de caractères
                    spéciaux et pas d&apos;espaces.
                  </label>
                  <input
                    id="shopName"
                    className="defaultInput"
                    required
                    onChange={onChange}
                    type="text"
                    name="shopName"
                    placeholder="Nom de shop"
                  />
                </div>
                <div
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="1000"
                  className={styles.conditions}
                >
                  <input value={conditions} required type="checkbox" />
                  <label onClick={toggleConditions}>
                    Condition d&apos;utilisation.
                  </label>
                </div>
                <br />
                <div
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="1100"
                >
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
                </div>
                <br />
                <br />
                <p
                  data-aos="fade-up"
                  data-aos-offset="100"
                  data-aos-delay="1200"
                >
                  Vous avez déjà un compte ?{" "}
                  <Link href={"/login"}>Se connecter !</Link>
                </p>
                <br />
              </form>
            </section>
            <div className={styles.col}>
              <img
                data-aos="fade-up"
                data-aos-offset="100"
                data-aos-delay="100"
                src="/images/signup.svg"
                alt="cyber-mall-signup"
              />
            </div>
          </div>
        </section>
      </Layout>
    </ConnectedGuard>
  );
}

export default Register;
