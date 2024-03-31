import { Button, Drawer, IconButton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "../../styles/vitrine/Navbar.module.scss";
import { CloseIcon, MenuIcon } from "../../utils/theme/icons";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 10;
      setScrolled(scrollCheck);
    });
  });
  const toggleMenu = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <Drawer
        anchor={"top"}
        open={drawerOpen}
        onClose={() => {
          toggleMenu();
        }}
      >
        <div className={styles.drawer}>
          <Link href={"/"}>
            <p>Home</p>
          </Link>
          <Link href={"/pricing"}>
            <p>Pricing</p>
          </Link>
          <Link href={"/contact"}>
            <p>Contact</p>
          </Link>
          <Link href={"/login"}>
            <p>login</p>
          </Link>
          <Link href={"/register"}>
            <p>register</p>
          </Link>
          <IconButton
            sx={{ padding: "20px" }}
            color="white"
            onClick={toggleMenu}
          >
            <CloseIcon />
          </IconButton>
        </div>
      </Drawer>
      <section
        className={
          scrolled || router?.pathname !== "/"
            ? `${styles.navbar} + ${styles.scrolled}`
            : styles.navbar
        }
      >
        <IconButton onClick={toggleMenu} className={styles.drawerbtn}>
          <MenuIcon style={{ color: "white" }} />
        </IconButton>
        <Link
          href={"/"}
          className={styles.logo}
          style={{ textDecoration: "none" }}
        >
          <Image
            alt="logo"
            src="/images/logo.svg"
            width={"180"}
            height={"60"}
            style={{ objectFit: "contain" }}
          />
        </Link>
        <ul>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/pricing">Pricing</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
        <div className={styles.buttons}>
          <Link href={"/login"}>
            <Button className={styles.login}>login</Button>
          </Link>
          &nbsp;&nbsp;
          <Link href={"/register"}>
            <Button className={styles.register}>register</Button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Navbar;
