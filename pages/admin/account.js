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
import XModal from "../../components/ui-components/XModal";
import styles from "../../styles/admin/Dashboard.module.scss";
import { checkExpirity } from "../../utils/shared/checkExpirity";
import { getError } from "../../utils/shared/getError";
import {
  AccountCircleIcon,
  VisibilityIcon,
  VisibilityOffIcon,
} from "../../utils/theme/icons";

// payment instructions shown both while proposing an upgrade and while one
// is pending confirmation
function PaymentInstructions({ price, requestNumber }) {
  return (
    <div className={styles.calloutBox}>
      <p className={styles.calloutTitle}>Send {price} DT to:</p>
      <ul className={styles.calloutList}>
        <li>RIB: 17503000000268993518</li>
        <li className={styles.paypalRow}>
          <span>PAYPAL: ashref.mtir@gmail.com</span>
          <img alt="qrcode" width="72" height="72" src="/paypal.png" />
        </li>
        <li>
          Then contact us on WhatsApp{" "}
          <a style={{ textDecoration: "underline" }}>47 010 114</a>
          {requestNumber ? (
            <>
              {" "}
              with the request number{" "}
              <a style={{ textDecoration: "underline" }}>{requestNumber}</a>
            </>
          ) : null}{" "}
          with proof of payment.
        </li>
      </ul>
    </div>
  );
}

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
                        ? `${styles.offer} ${styles.activeOffer}`
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
            <p className={styles.modalHint}>
              Select a plan above, then confirm to see the payment details.
            </p>
            {offer && <PaymentInstructions price={offer.price} />}
            <ul className={styles.premiumPerks}>
              <li>Unlimited categories</li>
              <li>Unlimited products</li>
              <li>Up to 6 images per product</li>
              <li>Unlimited home page slides</li>
              <li>Invoice generation</li>
              <li>Custom domain name</li>
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
                className={`${styles.planCard} ${
                  pack.type === "FREE" ? styles.planFree : styles.planPremium
                }`}
              >
                <div className={styles.planHeader}>
                  <div className={styles.planHeaderInfo}>
                    <h2>{userInfo.shop.name}</h2>
                    <span
                      className={`${styles.packPill} ${
                        pack.type === "FREE" ? styles.packFree : styles.packPremium
                      }`}
                    >
                      {pack.type}
                    </span>
                  </div>
                  {userInfo?.shop.logo ? (
                    <img
                      alt="logo"
                      src={`/api/images/${userInfo.shop.logo.split("/").pop()}`}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/images/default-store.png";
                      }}
                      width={"64"}
                      height={"64"}
                      style={{ objectFit: "contain" }}
                    />
                  ) : (
                    <img
                      alt="logo"
                      src={"/images/default-store.png"}
                      width={"56"}
                      height={"56"}
                      style={{ objectFit: "contain" }}
                    />
                  )}
                </div>

                <ul className={styles.featureList}>
                  {pack.type !== "FREE" && (
                    <li>
                      <Check />
                      invoice printing
                    </li>
                  )}
                  <li>
                    <Check />
                    categories {pack.type === "FREE" ? "limited to 5" : "unlimited"}
                  </li>
                  <li>
                    <Check />
                    products {pack.type === "FREE" ? "limited to 10" : "unlimited"}
                  </li>
                  <li>
                    <Check />
                    {pack.type === "FREE"
                      ? "1 image per product"
                      : "up to 6 images per product"}
                  </li>
                  <li>
                    <Check />
                    {pack.type === "FREE" ? "slides limited to 3" : "unlimited slides"}
                  </li>
                  {pack.type !== "FREE" && (
                    <li>
                      <Check />
                      custom domain name
                    </li>
                  )}
                </ul>

                <div className={styles.planFooter}>
                  {pack.type !== "FREE" && (
                    <p className={styles.expiryNote}>
                      Expires on {moment(pack.expiresIn).format("DD-MM-YYYY")}
                    </p>
                  )}
                  {upgradeDemand ? (
                    <div>
                      <p className={styles.pendingLabel}>
                        Upgrade request #{upgradeDemand.orderNumber} awaiting confirmation
                      </p>
                      <PaymentInstructions
                        price={
                          offers.find((o) => o.period === upgradeDemand.period).price
                        }
                        requestNumber={upgradeDemand.orderNumber}
                      />
                    </div>
                  ) : (
                    <>
                      {pack.type === "FREE" && (
                        <p className={styles.planFooterHint}>
                          Upgrade to premium for unlimited categories &amp;
                          products, invoice printing and a custom domain name.
                        </p>
                      )}
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={
                          pack.type === "FREE"
                            ? () => setAction("UPGRADE")
                            : () => setAction("EXTEND")
                        }
                      >
                        {pack.type === "FREE"
                          ? "Upgrade to premium"
                          : "Extend subscription"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                  <AccountCircleIcon
                    sx={{ width: 52, height: 52, color: "var(--ink-soft)" }}
                  />
                  <div className={styles.profileHeaderInfo}>
                    <p className={styles.profileName}>
                      {firstName + " " + lastName}
                    </p>
                    <span className={styles.profileSub}>Personal details</span>
                  </div>
                  {loadingAccount ? (
                    <CircularProgress color="black" size={26} />
                  ) : editAccount ? (
                    <div className="btn-group">
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
                <form
                  autoComplete="off"
                  id="account"
                  onSubmit={updateAccount}
                  className={styles.profileForm}
                >
                  <div className="labeledInput">
                    <label>email</label>
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
                  </div>
                  <div className="labeledInput">
                    <label>phone</label>
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
                  </div>
                  <div className="labeledInput">
                    <label>address</label>
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
                  </div>
                  {editAccount && (
                    <>
                      <div className="labeledInput">
                        <label>new password</label>
                        <div className={styles.passwordContainer}>
                          <input
                            className="defaultInput"
                            onChange={onChange}
                            type={passwordVisible ? "text" : "password"}
                            name="password"
                            placeholder="leave blank to keep current password"
                            autoComplete="off"
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
                      </div>
                      <div className="labeledInput">
                        <label>confirm password</label>
                        <input
                          type={passwordVisible ? "text" : "password"}
                          className="defaultInput"
                          value={confirmPassword}
                          name="confirmPassword"
                          placeholder="confirm password"
                          onChange={onChange}
                          autoComplete="off"
                        />
                      </div>
                    </>
                  )}
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
