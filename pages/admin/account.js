import { Check } from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import axios from "axios";
import moment from "moment";
import Image from "next/image";
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

  const pack = userInfo?.shop.pack;

  const offers = [
    { period: "1 Mois", price: 30 },
    { period: "3 Mois", price: 85 },
    { period: "6 Mois", price: 160 },
    { period: "12 Mois", price: 300 },
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
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
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
          size={ModalSizes.MEDIUM}
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
              après confirmation, procéder à l&apos;exécution de la transaction
              :
            </p>
            <br />
            {offer && (
              <span>
                <p>
                  Mettre à niveau votre forfait, Envoyer {offer.price}
                  &nbsp;DT à:
                </p>
                <ul>
                  <li>RIB: 17503000000268993518</li>
                  <li>D17 / E-DINAR: 4742000268993511</li>
                </ul>
              </span>
            )}
            <p>
              accédez au tableau de bord en déplacement et brisez les
              restrictions !
            </p>
            <hr />
            <ul>
              <li>catégories: illimité</li>
              <li>produits: illimité</li>
              <li>images par produit: jusqu&apos;à 3</li>
              <li>diapositives de la page d'accueil: illimité</li>
              <li>génération des factures: permise</li>
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
                    <Image
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
                    <Image
                      alt="logo"
                      src={"/images/default-store.png"}
                      width={"60"}
                      height={"60"}
                      style={{ objectFit: "contain" }}
                    />
                  )}
                </div>
                <p>
                  {pack.type === "FREE" ? <CloseIcon /> : <Check />}
                  &nbsp;impression de factures
                </p>
                <p>
                  {pack.type === "FREE" ? <CloseIcon /> : <Check />}
                  &nbsp;catégories illimité
                </p>
                <p>
                  {pack.type === "FREE" ? <CloseIcon /> : <Check />}
                  &nbsp;produits illimité
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
                  </>
                )}
                {upgradeDemand ? (
                  <span>
                    <p>
                      Mettre à niveau votre forfait, Envoyer{" "}
                      {
                        offers.find((o) => o.period === upgradeDemand.period)
                          .price
                      }
                      &nbsp;DT à:
                    </p>
                    <ul>
                      <li>RIB: 17503000000268993518</li>
                      <li>D17 / E-DINAR: 4742000268993511</li>
                    </ul>
                    <LinearProgress color="secondary" />
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
                    type="phone"
                    className={
                      editAccount ? "defaultInput" : "transparentInput"
                    }
                    value={phone}
                    name="phone"
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
