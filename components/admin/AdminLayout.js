import { Button, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Link from "next/link";
import React, { useState } from "react";
import styles from "../../styles/admin/AdminLayout.module.scss";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import InventoryIcon from "@mui/icons-material/Inventory";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import PaletteIcon from "@mui/icons-material/Palette";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";

function AdminLayout(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const disptach = useDispatch();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const logout = () => {
    disptach({ type: "USER_LOGOUT" });
  };

  return (
    <>
      <section className={styles.navbar}>
        <IconButton color="white" onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
        <IconButton color="white" onClick={toggleProfileMenu}>
          <AccountCircleIcon />
        </IconButton>
      </section>
      <Drawer open={drawerOpen} anchor={"left"} onClose={toggleDrawer}>
        <section className={styles.sidebar}>
          {userInfo?.shop?.logo ? (
            <Link href="/admin/dashboard">
              <div className={styles.header}>
                <Image
                  alt="logo"
                  src={userInfo?.shop.logo}
                  width={"30"}
                  height={"30"}
                  style={{ objectFit: "contain" }}
                />
              </div>
            </Link>
          ) : (
            <Link href="/admin/dashboard">
              <div className={styles.header}>
                <Image
                  alt="logo"
                  src={"/images/default-store.png"}
                  width={"30"}
                  height={"30"}
                  style={{ objectFit: "contain" }}
                />
                <p>{userInfo?.shop.name}</p>
              </div>
            </Link>
          )}

          <Link href="/admin/inventory">
            <div className={`${styles.link} + hoverable`}>
              <InventoryIcon color="shop1" />
              <p>inventory</p>
            </div>
          </Link>
          <Link href="/admin/clients">
            <div className={`${styles.link} + hoverable`}>
              <PeopleAltIcon color="shop2" />
              <p>clients</p>
            </div>
          </Link>
          <Link href="/admin/orders">
            <div className={`${styles.link} + hoverable`}>
              <LocalShippingIcon color="shop3" />
              <p>orders</p>
            </div>
          </Link>
          <Link href="/admin/boost">
            <div className={`${styles.link} + hoverable`}>
              <RocketLaunchIcon color="shop4" />
              <p>boost sales</p>
            </div>
          </Link>
          {/* <Link href="/">
            <div className={`${styles.link} + hoverable`}>
              <Inventory2Icon color="shop5" />
              <p>link</p>
            </div>
          </Link>
          <Link href="/">
            <div className={`${styles.link} + hoverable`}>
              <Inventory2Icon color="shop6" />
              <p>link</p>
            </div>
          </Link>
          <Link href="/">
            <div className={`${styles.link} + hoverable`}>
              <Inventory2Icon color="shop7" />
              <p>link</p>
            </div>
          </Link>
          <Link href="/">
            <div className={`${styles.link} + hoverable`}>
              <Inventory2Icon color="shop8" />
              <p>link</p>
            </div>
          </Link> */}
        </section>
      </Drawer>
      <Drawer
        open={profileMenuOpen}
        anchor={"right"}
        onClose={toggleProfileMenu}
      >
        <section className={styles.sidebar}>
          <Link href="/admin/theme">
            <div className={`${styles.link} + hoverable`}>
              <PaletteIcon color="shop5" />
              <p>theme</p>
            </div>
          </Link>
          <Link href="/admin/settings">
            <div className={`${styles.link} + hoverable`}>
              <SettingsSuggestIcon color="shop6" />
              <p>settings</p>
            </div>
          </Link>
          <span className={styles.logout}>
            <Button onClick={logout} color="error">
              <ExitToAppIcon></ExitToAppIcon>logout
            </Button>
          </span>
        </section>
      </Drawer>
      <section className={styles.content}>{props.children}</section>
    </>
  );
}

export default AdminLayout;
