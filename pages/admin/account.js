import {
  Button,
  CircularProgress,
  IconButton,
  LinearProgress,
  Skeleton,
  Tooltip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminActions, ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import XModal from "../../components/ui-components/XModal";
import styles from "../../styles/admin/Dashboard.module.scss";
import Image from "next/image";
import {
  AccountCircleIcon,
  CheckCircleIcon,
  CloseIcon,
  SettingsIcon,
  VisibilityIcon,
  VisibilityOffIcon,
} from "../../utils/theme/icons";
import axios from "axios";
import { getError } from "../../utils/shared/getError";
import XButton from "../../components/ui-components/XButton";
import { Check } from "@mui/icons-material";

function Account(props) {
  const { userInfo } = useSelector((state) => state.auth);

  const { enqueueSnackbar } = useSnackbar();

  const dispatch = useDispatch();

  const pack = userInfo?.shop.pack;

  const offers = [
    { period: "1 MONTH", price: 30 },
    { period: "3 MONTHS", price: 85 },
    { period: "6 MONTHS", price: 160 },
    { period: "1 YEAR", price: 300 },
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
    setFormdata(userInfo);
    getUpgradeDemand();
  }, [userInfo]);

  const getUpgradeDemand = async () => {
    const { data } = await axios.post("/api/admin/shop/getUpgradeDemand", {
      shop: userInfo.shop._id,
    });
    setUpgradeDemand(data);
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
        enqueueSnackbar(getError(error), { variant: "error" });
        setLoadingSubscription(false);
        setOffer(null);
        setAction("");
      }
    } else {
      enqueueSnackbar("Select a plan first !", { variant: "warning" });
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
              ? "Extend your Subscription"
              : "Upgrade your Subscription"
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
            <p>after confrimation proceed to executing the transaction:</p>
            <br />
            {offer && (
              <span>
                <p>
                  Upgrading your plan, Send {offer.price}
                  &nbsp;DT to:
                </p>
                <ul>
                  <li>RIB: 17503000000268993518</li>
                  <li>D17 / E-DINAR: 4742000268993511</li>
                </ul>
              </span>
            )}
            <p>access dashboard on the go and break from restrictions !</p>
            <hr />
            <ul>
              <li>categories: unlimited</li>
              <li>products: unlimited</li>
              <li>images per product: up to 3</li>
              <li>home slides: unlimited</li>
              <li>mobile access: allowed</li>
              <li>invoice generation: allowed</li>
            </ul>
          </section>
        </XModal>
        <section className={styles.container}>
          <div className={styles.controls}>
            <h1>Account & Suscription</h1>
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
                  &nbsp;mobile dashboard
                </p>
                <p>
                  {pack.type === "FREE" ? <CloseIcon /> : <Check />}
                  &nbsp;printing receipts
                </p>
                <p>
                  {pack.type === "FREE" ? <CloseIcon /> : <Check />}
                  &nbsp;unlimited categories
                </p>
                <p>
                  {pack.type === "FREE" ? <CloseIcon /> : <Check />}
                  &nbsp;unlimited products
                </p>
                <hr />
                <h5>Pack: {pack.type}</h5>
                {pack.type !== "FREE" && <h5>Expires in: {pack.expiresIn}</h5>}
                {pack.type === "FREE" && !upgradeDemand && (
                  <>
                    <p>upgrade to premium and benefit from our services !</p>
                  </>
                )}
                {upgradeDemand ? (
                  <span>
                    <p>
                      Upgrading your plan, Send{" "}
                      {
                        offers.find((o) => o.period === upgradeDemand.period)
                          .price
                      }
                      &nbsp;DT to:
                    </p>
                    <ul>
                      <li>RIB: 17503000000268993518</li>
                      <li>D17 / E-DINAR: 4742000268993511</li>
                    </ul>
                    <LinearProgress />
                  </span>
                ) : (
                  <XButton
                    color={"#ffc800"}
                    text={
                      pack.type === "FREE"
                        ? "upgrade to premium"
                        : "extend subscription"
                    }
                    action={
                      pack.type === "FREE"
                        ? () => setAction("UPGRADE")
                        : () => setAction("EXTEND")
                    }
                  />
                )}
              </div>
              <div className={styles.row}>
                <div className="row" style={{ justifyContent: "flex-start" }}>
                  <AccountCircleIcon sx={{ width: "70px", height: "70px" }} />
                  {loadingAccount ? (
                    <CircularProgress color="black" size={30} />
                  ) : editAccount ? (
                    <div className="row">
                      <IconButton color="success" type="submit" form="account">
                        <Tooltip title="save">
                          <CheckCircleIcon />
                        </Tooltip>
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => setEditAccount(false)}
                      >
                        <Tooltip title="cancel">
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
                      <Tooltip title="edit">
                        <SettingsIcon />
                      </Tooltip>
                    </IconButton>
                  )}
                </div>
                <p>{firstName + " " + lastName}</p>
                <form id="account" onSubmit={updateAccount}>
                  <input
                    type="email"
                    className={
                      editAccount ? "defaultInput" : "transparentInput"
                    }
                    value={email}
                    name="email"
                    email="email"
                    onChange={onChange}
                  />
                  <input
                    type="phone"
                    className={
                      editAccount ? "defaultInput" : "transparentInput"
                    }
                    value={phone}
                    name="phone"
                    placeholder="phone"
                    onChange={onChange}
                  />
                  <input
                    type="text"
                    className={
                      editAccount ? "defaultInput" : "transparentInput"
                    }
                    value={address}
                    name="address"
                    placeholder="address"
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
                      placeholder="password"
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
                    placeholder="confirm password"
                    onChange={onChange}
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
