import React, { useEffect, useState } from "react";
import styles from "../../styles/vitrine/Navbar.module.scss";
import Image from "next/image";
import { Button, IconButton, Drawer } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
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
          <Link href={"/services"}>
            <p>Services</p>
          </Link>
          <Link href={"/contact"}>
            <p>Contact</p>
          </Link>
          <Link href={"/login-shop"}>
            <p className={styles.login}>login</p>
          </Link>
          <Link href={"/register-shop"}>
            <p className={styles.register}>register</p>
          </Link>
          <IconButton onClick={toggleMenu}>
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
            <Link href="/">home</Link>
          </li>
          <li>
            <Link href="/services">services</Link>
          </li>
          <li>
            <Link href="/contact">contact</Link>
          </li>
        </ul>
        <div className={styles.buttons}>
          <Link href={"/login-shop"}>
            <Button className={styles.login}>login</Button>
          </Link>
          &nbsp;&nbsp;
          <Link href={"/register-shop"}>
            <Button className={styles.register}>register</Button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Navbar;
