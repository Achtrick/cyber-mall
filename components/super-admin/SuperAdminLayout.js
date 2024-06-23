import { Logout } from "@mui/icons-material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import LanguageIcon from "@mui/icons-material/Language";
import StoreIcon from "@mui/icons-material/Store";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useDispatch } from "react-redux";
import styles from "../../styles/SuperAdmin.module.scss";

function SuperAdminLayout(props) {
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <>
      <div className={styles.content}>{props.children}</div>
      <div className={styles.navbar}>
        <Link
          className={
            router.pathname === "/super-admin/shops"
              ? `${styles.navItem} + ${styles.activeNavItem}`
              : styles.navItem
          }
          href="/super-admin/shops"
        >
          <StoreIcon />
        </Link>

        <Link
          className={
            router.pathname === "/super-admin/premium-demands"
              ? `${styles.navItem} + ${styles.activeNavItem}`
              : styles.navItem
          }
          href="/super-admin/premium-demands"
        >
          <AddShoppingCartIcon />
        </Link>

        <Link
          className={
            router.pathname === "/super-admin/domain-demands"
              ? `${styles.navItem} + ${styles.activeNavItem}`
              : styles.navItem
          }
          href="/super-admin/domain-demands"
        >
          <LanguageIcon />
        </Link>

        <div
          onClick={() => dispatch({ type: "USER_LOGOUT" })}
          className={styles.navItem}
        >
          <Logout />
        </div>
      </div>
    </>
  );
}

export default SuperAdminLayout;
