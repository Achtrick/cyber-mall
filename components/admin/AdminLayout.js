import { Button, Drawer, IconButton } from "@mui/material";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import InstallPWA from "../../components/installPwa";
import styles from "../../styles/admin/AdminLayout.module.scss";
import {
  CategoryIcon,
  CloseIcon,
  ExitToAppIcon,
  InventoryIcon,
  LocalShippingIcon,
  MenuIcon,
  PaletteIcon,
  SettingsIcon,
  Subscription,
  TravelExploreIcon,
} from "../../utils/theme/icons";

function AdminLayout(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const logout = () => {
    dispatch({ type: "USER_LOGOUT" });
  };

  return (
    <>
      <InstallPWA top="15px" color={"#ec008c"} />
      <Head>
        <title>Cyber-Mall</title>
        <meta name="description" content="Cyber-Mall Dashboard"></meta>
        <meta property="og:locale" content="fr_TN" />
        <meta property="og:title" content="Cyber-Mall" />
        <meta property="og:description" content="Cyber-Mall Dashboard" />
        <meta property="og:url" content="http://cyber-mall.tn/" />
        <meta property="og:image" content="/logo-512.png" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/cybermall-192.png"
        />
        <link rel="icon" type="image/ico" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/ico" sizes="16x16" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="mask-icon" href="/cybermall-192.png" />
        <link rel="shortcut icon" href="/cybermall-192.png" />
        <meta name="author" content="Cyber-Mall" />
        <meta name="geo.region" content="TN" />
        <meta name="geo.placename" content="Tunisia" />
        <meta name="geo.position" content="35°50′N;10°38′E" />
        <meta name="ICBM" content="35°50′N , 10°38′E" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="cyber-mall.tn" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#000" />
        <meta charSet="utf-8" />
        <link rel="canonical" href="https://cyber-mall.tn" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="robots" content="index, follow" />
      </Head>
      <section className={styles.navbar}>
        <IconButton color="white" onClick={toggleDrawer}>
          {drawerOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <Image
          alt="logo"
          src="/images/logo.svg"
          width={"150"}
          height={"60"}
          style={{ objectFit: "contain" }}
        />
        <IconButton />
      </section>
      <Drawer open={drawerOpen} anchor={"left"} onClose={toggleDrawer}>
        <section className={styles.sidebar}>
          <Link onClick={toggleDrawer} href="/admin/account">
            <div className={`${styles.link} + hoverable`}>
              <Subscription color="primary" />
              <p>mon compte</p>
            </div>
          </Link>
          <Link onClick={toggleDrawer} href="/admin/categories">
            <div className={`${styles.link} + hoverable`}>
              <CategoryIcon color="shop2" />
              <p>catégories</p>
            </div>
          </Link>
          <Link onClick={toggleDrawer} href="/admin/inventory">
            <div className={`${styles.link} + hoverable`}>
              <InventoryIcon color="shop3" />
              <p>inventaire</p>
            </div>
          </Link>
          <Link onClick={toggleDrawer} href="/admin/orders">
            <div className={`${styles.link} + hoverable`}>
              <LocalShippingIcon color="shop4" />
              <p>commandes</p>
            </div>
          </Link>
          <Link onClick={toggleDrawer} href="/admin/theme">
            <div className={`${styles.link} + hoverable`}>
              <PaletteIcon color="shop5" />
              <p>Thème</p>
            </div>
          </Link>
          <Link onClick={toggleDrawer} href="/admin/architecture">
            <div className={`${styles.link} + hoverable`}>
              <SettingsIcon color="shop6" />
              <p>configurer ma shop</p>
            </div>
          </Link>
          <Link
            rel="noreferrer"
            target="_blank"
            onClick={toggleDrawer}
            href={`/${userInfo?.shop?.name}`}
          >
            <div className={`${styles.link} + hoverable`}>
              <TravelExploreIcon />
              <p>visitez ma shop</p>
            </div>
          </Link>
          <span className={styles.logout}>
            <Button variant="contained" color="secondary" onClick={logout}>
              <ExitToAppIcon></ExitToAppIcon>&nbsp;déconnecter
            </Button>
          </span>
        </section>
      </Drawer>
      <section className={styles.content}>{props.children}</section>
    </>
  );
}

export default AdminLayout;
