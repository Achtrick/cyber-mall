import { Language } from "@mui/icons-material";
import { Badge, Button, Drawer, IconButton } from "@mui/material";
import axios from "axios";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AiChatWidget from "./AiChatWidget";
import InstallPWA from "../../components/installPwa";
import styles from "../../styles/admin/AdminLayout.module.scss";
import {
  DEFAULT_OG_IMAGE,
  SITE_HOST,
  SITE_ICON,
  SITE_URL,
  absoluteUrl,
} from "../../utils/config/site";
import { useContrastBoxBackground } from "../../utils/shared/useContrastBoxBackground";
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

const NAV_GROUPS = [
  {
    label: "Catalog",
    links: [
      { href: "/admin/categories", label: "Categories", icon: CategoryIcon, color: "shop2" },
      { href: "/admin/inventory", label: "Products", icon: InventoryIcon, color: "shop3" },
    ],
  },
  {
    label: "Sales",
    links: [
      { href: "/admin/orders", label: "Orders", icon: LocalShippingIcon, color: "shop4", badge: true },
    ],
  },
  {
    label: "Storefront",
    links: [
      { href: "/admin/theme", label: "Theme", icon: PaletteIcon, color: "shop5" },
      { href: "/admin/architecture", label: "Configure my shop", icon: SettingsIcon, color: "shop6" },
      { href: "/admin/domain-name", label: "Domain name", icon: Language, color: "shop7" },
    ],
  },
];

function AdminLayout(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [ordersCount, setOrdersCount] = useState(0);

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const router = useRouter();

  const shopLogoBg = useContrastBoxBackground(
    userInfo?.shop?.logo
      ? `/api/images/${userInfo.shop.logo.split("/").pop()}`
      : null
  );

  useEffect(() => {
    userInfo && getOrdersCount();
  }, []);

  const getOrdersCount = async () => {
    const { data } = await axios.post("/api/admin/orders/count", {
      shop: userInfo.shop._id,
    });
    setOrdersCount(data);
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const logout = () => {
    dispatch({ type: "USER_LOGOUT" });
  };

  return (
    <>
      <InstallPWA color={"#ec008c"} />
      <AiChatWidget />
      <Head>
        <title>Cyber-Mall</title>
        <meta name="description" content="Cyber-Mall Dashboard"></meta>
        <meta property="og:locale" content="en_US" />
        <meta property="og:title" content="Cyber-Mall" />
        <meta property="og:description" content="Cyber-Mall Dashboard" />
        <meta property="og:url" content={`${SITE_URL}/`} />
        <meta
          property="og:image"
          content={absoluteUrl(DEFAULT_OG_IMAGE.url)}
        />
        <meta property="og:image:type" content={DEFAULT_OG_IMAGE.type} />
        <meta
          property="og:image:width"
          content={String(DEFAULT_OG_IMAGE.width)}
        />
        <meta
          property="og:image:height"
          content={String(DEFAULT_OG_IMAGE.height)}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/cybermall-192.png"
        />
        <link
          key="site-icon"
          rel="icon"
          type="image/svg+xml"
          href={SITE_ICON}
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
        <meta property="og:site_name" content={SITE_HOST} />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#000" />
        <meta charSet="utf-8" />
        <link rel="canonical" href={SITE_URL} />
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
        <IconButton style={{ width: "35px" }} disabled={true}></IconButton>
      </section>
      <Drawer open={drawerOpen} anchor={"left"} onClose={toggleDrawer}>
        <section className={styles.sidebar}>
          {userInfo?.shop && (
            <div className={styles.shopIdentity}>
              <img
                alt="shop logo"
                src={
                  userInfo.shop.logo
                    ? `/api/images/${userInfo.shop.logo.split("/").pop()}`
                    : "/images/default-store.png"
                }
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/images/default-store.png";
                }}
                style={{ background: shopLogoBg }}
              />
              <div>
                <p className={styles.shopName}>{userInfo.shop.name}</p>
                <span
                  className={`${styles.packPill} ${
                    userInfo.shop.pack?.type === "FREE" ? styles.packFree : styles.packPremium
                  }`}
                >
                  {userInfo.shop.pack?.type}
                </span>
              </div>
            </div>
          )}

          <Link
            onClick={toggleDrawer}
            href="/admin/account"
            className={router.pathname === "/admin/account" ? styles.linkActive : ""}
          >
            <div className={`${styles.link} hoverable`}>
              <Subscription color="primary" />
              <p>my account</p>
            </div>
          </Link>

          {NAV_GROUPS.map((group) => (
            <div className={styles.navGroup} key={group.label}>
              <p className={styles.groupLabel}>{group.label}</p>
              {group.links.map((link) => {
                const Icon = link.icon;
                const active = router.pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    onClick={toggleDrawer}
                    href={link.href}
                    className={active ? styles.linkActive : ""}
                  >
                    <div className={`${styles.link} hoverable`}>
                      {link.badge ? (
                        <Badge badgeContent={ordersCount} color="secondary">
                          <Icon color={link.color} />
                        </Badge>
                      ) : (
                        <Icon color={link.color} />
                      )}
                      <p>{link.label}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ))}

          <Link
            rel="noreferrer"
            target="_blank"
            onClick={toggleDrawer}
            href={
              userInfo?.shop?.domainName?.length
                ? `https://${userInfo?.shop?.domainName}`
                : `/${userInfo?.shop?.name}`
            }
          >
            <div className={`${styles.link} hoverable`}>
              <TravelExploreIcon />
              <p>visit my shop</p>
            </div>
          </Link>
          <span className={styles.logout}>
            <Button variant="contained" color="secondary" onClick={logout}>
              <ExitToAppIcon></ExitToAppIcon>&nbsp;log out
            </Button>
          </span>
        </section>
      </Drawer>
      <section className={styles.content}>{props.children}</section>
    </>
  );
}

export default AdminLayout;
