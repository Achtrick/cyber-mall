import { Logout } from "@mui/icons-material";
import AddCardIcon from "@mui/icons-material/AddCard";
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
        <div
          className={
            router.pathname === "/super-admin/shops"
              ? `${styles.navItem} + ${styles.activeNavItem}`
              : styles.navItem
          }
        >
          <Link href="/super-admin/shops">
            <StoreIcon />
          </Link>
        </div>
        <div
          className={
            router.pathname === "/super-admin/demands"
              ? `${styles.navItem} + ${styles.activeNavItem}`
              : styles.navItem
          }
        >
          <Link href="/super-admin/demands">
            <AddCardIcon />
          </Link>
        </div>
        <div className={styles.navItem}>
          <Logout onClick={() => dispatch({ type: "USER_LOGOUT" })} />
        </div>
      </div>
    </>
  );
}

export default SuperAdminLayout;
