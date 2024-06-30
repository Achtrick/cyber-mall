import { Check } from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
  Tooltip,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import XButton from "../../components/ui-components/XButton";
import XModal from "../../components/ui-components/XModal";
import styles from "../../styles/admin/Dashboard.module.scss";
import { checkExpirity } from "../../utils/shared/checkExpirity";
import { getError } from "../../utils/shared/getError";
import {
  AccountCircleIcon,
  CheckCircleIcon,
  CloseIcon,
  SettingsIcon,
  VisibilityIcon,
  VisibilityOffIcon,
} from "../../utils/theme/icons";

function Account(props) {
  const { userInfo } = useSelector((state) => state.auth);

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const isMobile = useMediaQuery("(max-width:800px)");

  const pack = userInfo?.shop.pack;

  const offers = [
    { period: "1 Mois", price: 49 },
    { period: "3 Mois", price: 139 },
    { period: "6 Mois", price: 259 },
    { period: "12 Mois", price: 499 },
  ];

  const [upgradeDemand, setUpgradeDemand] = useState(null);
  const [action, setAction] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(false);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [editAccount, setEditAccount] = useState(false);
  const [formData, setFormdata] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [offer, setOffer] = useState(null);

  if (formData) {
    var {
      firstName,
      lastName,
      email,
      address,
      phone,
      password,
      confirmPassword,
    } = formData;
  }

  useEffect(() => {
    setFormdata({ ...formData, ...userInfo });
    userInfo && getUpgradeDemand();
  }, [userInfo]);

  const getUpgradeDemand = async () => {
    try {
      const { data } = await axios.post("/api/admin/shop/getUpgradeDemand", {
        shop: userInfo.shop._id,
      });
      setUpgradeDemand(data);
    } catch (error) {
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const onChange = (e) =>
    setFormdata({ ...formData, [e.target.name]: e.target.value });

  const updateAccount = async (e) => {
    setLoadingAccount(true);
    e.preventDefault();
    if (password !== confirmPassword) {
      setLoadingAccount(false);

      return enqueueSnackbar("Les mots de passe ne correspond pas !", {
        variant: "error",
      });
    }
    try {
      const { data } = await axios.put(
        `/api/auth/updateAccount/${userInfo._id}`,
        formData
      );
      dispatch({
        type: "USER_LOGIN",
        payload: {
          ...userInfo,
          email: data.userInfo.email,
          phone: data.userInfo.phone,
          address: data.userInfo.address,
        },
      });
      setFormdata({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      enqueueSnackbar(data.message, { variant: "success" });
      setEditAccount(false);
      setLoadingAccount(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "success" });
      setLoadingAccount(false);
    }
  };

  const cancelAction = () => {
    setAction("");
    setOffer(null);
  };

  const confirmAction = async () => {
    if (userInfo.phone && userInfo.phone.length) {
      if (offer) {
        setLoadingSubscription(true);
        try {
          const { data } = await axios.post(
            "/api/admin/shop/update-subscription",
            {
              orderNumber:
                userInfo.shop.name +
                Math.floor(100000 + Math.random() * 900000),
              userName: userInfo.firstName + " " + userInfo.lastName,
              email: userInfo.email,
              phone: userInfo.phone,
              shop: userInfo.shop._id,
              period: offer.period,
            }
          );
          await getUpgradeDemand();
          enqueueSnackbar(data.message, { variant: "success" });
          setLoadingSubscription(false);
          setOffer(null);
          setAction("");
        } catch (error) {
          checkExpirity(error, dispatch);
          enqueueSnackbar(getError(error), { variant: "error" });
          setLoadingSubscription(false);
          setOffer(null);
          setAction("");
        }
      } else {
        enqueueSnackbar("Sélectionnez d'abord un forfait !", {
          variant: "warning",
        });
      }
    } else {
      enqueueSnackbar(
        "Remplir Vos Coordonnées D'abord pour qu'ont peut vous contactez !",
        { variant: "warning" }
      );
      setOffer(null);
      setAction("");
      setEditAccount(true);

      setTimeout(() => {
        document.getElementById("phone").focus();
      }, 100);
    }
  };

  return (
    <AdminLayout>
      <DisconnectedGuard>
        <XModal
          open={action !== ""}
          cancelAction={cancelAction}
          confirmAction={confirmAction}
          onClose={cancelAction}
          loading={loadingSubscription}
          title={
            action === "EXTEND"
              ? "Prolongez votre abonnement"
              : "Mettez à niveau votre abonnement"
          }
          size={isMobile ? ModalSizes.BIG : ModalSizes.MEDIUM}
        >
          <section className={styles.modal}>
            <div className="grid-4">
              {offers.map((o, index) => {
                return (
                  <div
                    className={
                      o.price === offer?.price
                        ? `${styles.offer} + ${styles.activeOffer}`
                        : styles.offer
                    }
                    key={index}
                    onClick={() => setOffer(o)}
                  >
                    <h1>PREMIUM</h1>
                    <p>{o.period}</p>
                    <span className={styles.price}>{o.price} DT</span>
                  </div>
                );
              })}
            </div>
            <p>
              sélectionner une offre et procéder à l&apos;exécution de la
              transaction :
            </p>
            <br />
            {offer && (
              <span>
                <p style={{ color: "blue" }}>
                  Après confirmation, Envoyer {offer.price}
                  &nbsp;DT à:
                </p>
                <ul style={{ color: "blue" }}>
                  <li>RIB: 17503000000268993518</li>{" "}
                  <li>
                    Après contactez nous sur whatsapp{" "}
                    <a style={{ textDecoration: "underline" }}>47 010 114</a>{" "}
                    avec une preuve de paiement.
                  </li>
                </ul>{" "}
              </span>
            )}
            <p>
              accédez au tableau de bord en déplacement et brisez les
              restrictions !
            </p>
            <hr />
            <ul style={{ listStyle: "none", marginLeft: "-20px" }}>
              <li>- catégories: illimité ✓</li>
              <li>- produits: illimité ✓</li>
              <li>- images par produit: jusqu&apos;à 6 ✓</li>
              <li>- diapositives de la page d&apos;accueil: illimité ✓</li>
              <li>- génération des factures: permise ✓</li>
              <li>- nom de domaine de votre choix: permise ✓</li>
            </ul>
          </section>
        </XModal>
        <section className={styles.container}>
          <div className={styles.controls}>
            <h1>Compte et abonnement</h1>
          </div>
          {userInfo && (
            <section className={styles.account}>
              <div
                className={`${styles.row} + ${
                  pack.type === "FREE" ? styles.silver : styles.gold
                }`}
              >
                <div
                  className="row"
                  style={{ justifyContent: "space-between" }}
                >
                  <h1>{userInfo.shop.name}</h1>
                  {userInfo?.shop.logo ? (
                    <img
                      alt="logo"
                      src={userInfo?.shop.logo}
                      onError={(e) => {
                        setLogo("/images/default-store.png");
                      }}
                      width={"80"}
                      height={"80"}
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <img
                      alt="logo"
                      src={"/images/default-store.png"}
                      width={"60"}
                      height={"60"}
                      style={{ objectFit: "contain" }}
                    />
                  )}
                </div>
                <p>
                  {pack.type !== "FREE" ? (
                    <>
                      <Check />
                      &nbsp;impression de factures
                    </>
                  ) : null}
                </p>
                <p>
                  <Check />
                  &nbsp;catégories{" "}
                  {pack.type === "FREE" ? "limité à 5" : "illimitées"}
                </p>
                <p>
                  <Check />
                  &nbsp;produits{" "}
                  {pack.type === "FREE" ? "limité à 10" : "illimités"}
                </p>
                <p>
                  <Check />
                  &nbsp;
                  {pack.type === "FREE"
                    ? "1 seule image par produit"
                    : "jusqu'à 6 images par produit"}
                </p>
                <p>
                  <Check />
                  &nbsp;
                  {pack.type === "FREE"
                    ? "diapositives limitées à 3"
                    : "diapositives illimitées"}
                </p>
                <p>
                  {pack.type !== "FREE" ? (
                    <>
                      <Check />
                      &nbsp;nom de domaine de votre choix
                    </>
                  ) : null}
                </p>
                <hr />
                <h5>Pack: {pack.type}</h5>
                {pack.type !== "FREE" && (
                  <h5>
                    Expire dans: {moment(pack.expiresIn).format("DD-MM-YYYY")}
                  </h5>
                )}
                {pack.type === "FREE" && !upgradeDemand && (
                  <>
                    <p>passez à premium et bénéficiez de nos services !</p>
                    <ul>
                      <li>Impression de facture</li>
                      <li>Intégration de Nom de domaine de votre choix</li>
                      <li>Catégories illimitées</li>
                      <li>Produits illimités</li>
                      <li>Jusqu&apos;à 6 images par produits</li>
                      <li>Diapositifs illimitées</li>
                      <li>Intégration de Nom de domaine de votre choix</li>
                    </ul>
                  </>
                )}
                {upgradeDemand ? (
                  <span>
                    <h4 style={{ color: "blue" }}>
                      Transférez{" "}
                      {
                        offers.find((o) => o.period === upgradeDemand.period)
                          .price
                      }
                      &nbsp;DT à:
                    </h4>
                    <ul style={{ color: "blue" }}>
                      <li>
                        <h4>RIB: 17503000000268993518</h4>
                      </li>
                      <li>
                        <h4>
                          après contactez nous sur whatsapp{" "}
                          <a style={{ textDecoration: "underline" }}>
                            47 010 114
                          </a>{" "}
                          avec le numéro de demande{" "}
                          <a style={{ textDecoration: "underline" }}>
                            {upgradeDemand.orderNumber}
                          </a>{" "}
                          et une preuve de paiement.
                        </h4>
                      </li>
                    </ul>
                  </span>
                ) : (
                  <XButton
                    color={"#ffc800"}
                    text={
                      pack.type === "FREE"
                        ? "passer à premium"
                        : "prolonger l'abonnement"
                    }
                    action={
                      pack.type === "FREE"
                        ? () => setAction("UPGRADE")
                        : () => setAction("EXTEND")
                    }
                  />
                )}
              </div>
              <br />
              <div className={styles.row}>
                <div className="row" style={{ justifyContent: "flex-start" }}>
                  <AccountCircleIcon sx={{ width: "70px", height: "70px" }} />
                  {loadingAccount ? (
                    <CircularProgress color="black" size={30} />
                  ) : editAccount ? (
                    <div className="row">
                      <IconButton color="success" type="submit" form="account">
                        <Tooltip title="sauvegarder">
                          <CheckCircleIcon />
                        </Tooltip>
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => setEditAccount(false)}
                      >
                        <Tooltip title="annuler">
                          <CloseIcon />
                        </Tooltip>
                      </IconButton>
                    </div>
                  ) : (
                    <IconButton
                      color="warning"
                      onClick={() => {
                        setTimeout(() => {
                          setEditAccount(true);
                        }, 100);
                      }}
                    >
                      <Tooltip title="modifier">
                        <SettingsIcon />
                      </Tooltip>
                    </IconButton>
                  )}
                </div>
                <p>{firstName + " " + lastName}</p>
                <form autoComplete="off" id="account" onSubmit={updateAccount}>
                  <input
                    type="email"
                    className={
                      editAccount ? "defaultInput" : "transparentInput"
                    }
                    value={email}
                    name="email"
                    placeholder="email"
                    onChange={onChange}
                  />
                  <input
                    type="number"
                    className={
                      editAccount ? "defaultInput" : "transparentInput"
                    }
                    value={phone}
                    name="phone"
                    id="phone"
                    placeholder="téléphone"
                    onChange={onChange}
                  />
                  <input
                    type="text"
                    className={
                      editAccount ? "defaultInput" : "transparentInput"
                    }
                    value={address}
                    name="address"
                    placeholder="adresse"
                    onChange={onChange}
                  />
                  <div className={styles.passwordContainer}>
                    <input
                      className={
                        editAccount ? "defaultInput" : "transparentInput"
                      }
                      onChange={onChange}
                      type={passwordVisible ? "text" : "password"}
                      name="password"
                      placeholder="mot de passe"
                      autoComplete="off"
                    />

                    {editAccount && (
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
                    )}
                  </div>
                  <input
                    type={passwordVisible ? "text" : "password"}
                    className={
                      editAccount ? "defaultInput" : "transparentInput"
                    }
                    value={confirmPassword}
                    name="confirmPassword"
                    placeholder="confirmer mot de passe"
                    onChange={onChange}
                    autoComplete="off"
                  />
                </form>
              </div>
            </section>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Account;
