import { Button, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Link from "next/link";
import React, { useState } from "react";
import styles from "../../styles/admin/AdminLayout.module.scss";
import { useDispatch } from "react-redux";

function AdminLayout(props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

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
        <IconButton color="primary" onClick={toggleDrawer}>
          <MenuIcon />
        </IconButton>
        <IconButton color="primary" onClick={toggleProfileMenu}>
          <AccountCircleIcon />
        </IconButton>
      </section>
      <Drawer open={drawerOpen} anchor={"left"} onClose={toggleDrawer}>
        <section className={styles.sidebar}>
          <Link href="/">
            <p>link</p>
          </Link>
        </section>
      </Drawer>
      <Drawer
        open={profileMenuOpen}
        anchor={"right"}
        onClose={toggleProfileMenu}
      >
        <section className={styles.sidebar}>
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
