import { IconButton, Skeleton, Tooltip } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminActions, ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import XModal from "../../components/ui-components/XModal";
import styles from "../../styles/admin/Dashboard.module.scss";
import Image from "next/image";
import {
  AccountCircleIcon,
  CheckCircleIcon,
  SettingsIcon,
} from "../../utils/theme/icons";

function Account(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();
  const pack = userInfo?.shop.pack;

  const [loading, setLoading] = useState(false);
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
  const {
    firstName,
    lastName,
    email,
    address,
    phone,
    password,
    confirmPassword,
  } = formData;

  const onChange = (e) =>
    setFormdata({ ...formData, [e.target.name]: e.target.value });

  useEffect(() => {
    setFormdata(userInfo);
  }, []);

  return (
    <AdminLayout>
      <DisconnectedGuard>
        <section className={styles.container}>
          <div className={styles.controls}>
            <h1>My Account</h1>
          </div>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"calc(100vh - 200px)"}
            />
          ) : (
            userInfo && (
              <section className={styles.account}>
                <div
                  className={`${styles.col50} + ${
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
                        width={"60"}
                        height={"60"}
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
                  <hr />
                  <h5>Pack: {pack.type}</h5>
                  {pack.type !== "FREE" && (
                    <h5>Expires in: {pack.expiresIn}</h5>
                  )}
                </div>
                <br />
                <div className={styles.col50}>
                  <div
                    className="row"
                    style={{ justifyContent: "space-between" }}
                  >
                    <AccountCircleIcon sx={{ width: "70px", height: "70px" }} />
                    <IconButton
                      onClick={() => {
                        if (editAccount) {
                          setEditAccount(false);
                        } else {
                          setEditAccount(true);
                        }
                      }}
                    >
                      {editAccount ? (
                        <Tooltip title="save">
                          <CheckCircleIcon color="success" />
                        </Tooltip>
                      ) : (
                        <Tooltip title="edit">
                          <SettingsIcon color="warning" />
                        </Tooltip>
                      )}
                    </IconButton>
                  </div>
                  <p>{firstName + " " + lastName}</p>
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
                  <input
                    type="password"
                    className={
                      editAccount ? "defaultInput" : "transparentInput"
                    }
                    value={password}
                    name="password"
                    placeholder="password"
                    onChange={onChange}
                  />
                  <input
                    type="password"
                    className={
                      editAccount ? "defaultInput" : "transparentInput"
                    }
                    value={confirmPassword}
                    name="confirm password"
                    placeholder="confirm password"
                    onChange={onChange}
                  />
                </div>
              </section>
            )
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Account;
