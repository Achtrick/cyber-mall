import { Check } from "@mui/icons-material";
import {
  CircularProgress,
  IconButton,
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
    { period: "1 Month", price: 49 },
    { period: "3 Months", price: 139 },
    { period: "6 Months", price: 259 },
    { period: "12 Months", price: 499 },
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

      return enqueueSnackbar("Passwords do not match!", {
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
        enqueueSnackbar("Select a plan first!", {
          variant: "warning",
        });
      }
    } else {
      enqueueSnackbar(
        "Please fill in your contact details first so we can reach you!",
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
              ? "Extend your subscription"
              : "Upgrade your subscription"
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
              select an offer and proceed with the
              transaction:
            </p>
            <br />
            {offer && (
              <span>
                <p style={{ color: "blue" }}>
                  After confirmation, send {offer.price}
                  &nbsp;DT to:
                </p>
                <ul style={{ color: "blue" }}>
                  <li>RIB: 17503000000268993518</li>{" "}
                  <li>
                    <a
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      PAYPAL: ashref.mtir@gmail.com |{" "}
                      <img
                        alt="qrcode"
                        width="100px"
                        height="100px"
                        src="/paypal.png"
                      />
                    </a>
                  </li>{" "}
                  <li>
                    Then contact us on WhatsApp{" "}
                    <a style={{ textDecoration: "underline" }}>47 010 114</a>{" "}
                    with proof of payment.
                  </li>
                </ul>{" "}
              </span>
            )}
            <p>
              access the dashboard on the go and break the
              restrictions!
            </p>
            <hr />
            <ul style={{ listStyle: "none", marginLeft: "-20px" }}>
              <li>- categories: unlimited ✓</li>
              <li>- products: unlimited ✓</li>
              <li>- images per product: up to 6 ✓</li>
              <li>- home page slides: unlimited ✓</li>
              <li>- invoice generation: allowed ✓</li>
              <li>- custom domain name: allowed ✓</li>
            </ul>
          </section>
        </XModal>
        <section className={styles.container}>
          <div className={styles.controls}>
            <h1>Account and subscription</h1>
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
                      src={`/api/images/${userInfo.shop.logo.split("/").pop()}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/default-store.png";
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
                      &nbsp;invoice printing
                    </>
                  ) : null}
                </p>
                <p>
                  <Check />
                  &nbsp;categories{" "}
                  {pack.type === "FREE" ? "limited to 5" : "unlimited"}
                </p>
                <p>
                  <Check />
                  &nbsp;products{" "}
                  {pack.type === "FREE" ? "limited to 10" : "unlimited"}
                </p>
                <p>
                  <Check />
                  &nbsp;
                  {pack.type === "FREE"
                    ? "1 image per product"
                    : "up to 6 images per product"}
                </p>
                <p>
                  <Check />
                  &nbsp;
                  {pack.type === "FREE"
                    ? "slides limited to 3"
                    : "unlimited slides"}
                </p>
                <p>
                  {pack.type !== "FREE" ? (
                    <>
                      <Check />
                      &nbsp;custom domain name
                    </>
                  ) : null}
                </p>
                <hr />
                <h5>Pack: {pack.type}</h5>
                {pack.type !== "FREE" && (
                  <h5>
                    Expires on: {moment(pack.expiresIn).format("DD-MM-YYYY")}
                  </h5>
                )}
                {pack.type === "FREE" && !upgradeDemand && (
                  <>
                    <p>upgrade to premium and enjoy our services!</p>
                    <ul>
                      <li>Invoice printing</li>
                      <li>Custom domain name integration</li>
                      <li>Unlimited categories</li>
                      <li>Unlimited products</li>
                      <li>Up to 6 images per product</li>
                      <li>Unlimited slides</li>
                      <li>Custom domain name integration</li>
                    </ul>
                  </>
                )}
                {upgradeDemand ? (
                  <span>
                    <h4 style={{ color: "blue" }}>
                      Transfer{" "}
                      {
                        offers.find((o) => o.period === upgradeDemand.period)
                          .price
                      }
                      &nbsp;DT to:
                    </h4>
                    <ul style={{ color: "blue" }}>
                      <li>
                        <h4>RIB: 17503000000268993518</h4>
                      </li>
                      <li>
                        <h4 style={{ display: "flex", alignItems: "center" }}>
                          PAYPAL: ashref.mtir@gmail.com |{" "}
                          <img
                            width="100px"
                            height="100px"
                            alt="qrcode"
                            src="/paypal.png"
                          />
                        </h4>{" "}
                      </li>
                      <li>
                        <h4>
                          then contact us on WhatsApp{" "}
                          <a style={{ textDecoration: "underline" }}>
                            47 010 114
                          </a>{" "}
                          with the request number{" "}
                          <a style={{ textDecoration: "underline" }}>
                            {upgradeDemand.orderNumber}
                          </a>{" "}
                          and proof of payment.
                        </h4>
                      </li>
                    </ul>
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
              <br />
              <div className={styles.row}>
                <div className="row" style={{ justifyContent: "flex-start" }}>
                  <AccountCircleIcon sx={{ width: "70px", height: "70px" }} />
                  {loadingAccount ? (
                    <CircularProgress color="black" size={30} />
                  ) : editAccount ? (
                    <div className="btn-group" style={{ marginLeft: "10px" }}>
                      <button
                        className="btn btn-sm btn-success"
                        type="submit"
                        form="account"
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-sm"
                        type="button"
                        onClick={() => setEditAccount(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-sm"
                      style={{ marginLeft: "10px" }}
                      onClick={() => {
                        setTimeout(() => {
                          setEditAccount(true);
                        }, 100);
                      }}
                    >
                      Edit account
                    </button>
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
                    placeholder="confirm password"
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
