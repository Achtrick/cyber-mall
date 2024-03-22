import AddCardIcon from "@mui/icons-material/AddCard";
import StoreIcon from "@mui/icons-material/Store";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import styles from "../../styles/SuperAdmin.module.scss";

function SuperAdminLayout(props) {
  const router = useRouter();

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
            <StoreIcon sx={{ width: "100%", height: "100%" }} />
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
            <AddCardIcon sx={{ width: "100%", height: "100%" }} />
          </Link>
        </div>
      </div>
    </>
  );
}

export default SuperAdminLayout;
