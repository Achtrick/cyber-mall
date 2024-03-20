import { Button, Drawer, IconButton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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

  const disptach = useDispatch();

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const logout = () => {
    disptach({ type: "USER_LOGOUT" });
  };

  return (
    <>
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
          <Link onClick={toggleDrawer} href="/admin/categories">
            <div className={`${styles.link} + hoverable`}>
              <CategoryIcon color="primary" />
              <p>categories</p>
            </div>
          </Link>
          <Link onClick={toggleDrawer} href="/admin/inventory">
            <div className={`${styles.link} + hoverable`}>
              <InventoryIcon color="shop2" />
              <p>inventory</p>
            </div>
          </Link>
          <Link onClick={toggleDrawer} href="/admin/orders">
            <div className={`${styles.link} + hoverable`}>
              <LocalShippingIcon color="shop3" />
              <p>orders</p>
            </div>
          </Link>
          <Link onClick={toggleDrawer} href="/admin/theme">
            <div className={`${styles.link} + hoverable`}>
              <PaletteIcon color="shop4" />
              <p>my shop theme</p>
            </div>
          </Link>
          <Link onClick={toggleDrawer} href="/admin/architecture">
            <div className={`${styles.link} + hoverable`}>
              <SettingsIcon color="shop5" />
              <p>configure my shop</p>
            </div>
          </Link>
          <Link onClick={toggleDrawer} href="/admin/account">
            <div className={`${styles.link} + hoverable`}>
              <Subscription color="shop6" />
              <p>my account</p>
            </div>
          </Link>
          <Link
            rel="noreferrer"
            target="_blank"
            onClick={toggleDrawer}
            href={`/shop?shop=${userInfo?.shop?.name}`}
          >
            <div className={`${styles.link} + hoverable`}>
              <TravelExploreIcon />
              <p>visit my shop</p>
            </div>
          </Link>
          <span className={styles.logout}>
            <Button variant="contained" color="secondary" onClick={logout}>
              <ExitToAppIcon></ExitToAppIcon>&nbsp;logout
            </Button>
          </span>
        </section>
      </Drawer>
      <section className={styles.content}>{props.children}</section>
    </>
  );
}

export default AdminLayout;
