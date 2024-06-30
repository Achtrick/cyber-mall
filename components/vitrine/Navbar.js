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
          <Link
            onClick={() => {
              toggleMenu();
            }}
            href={"/"}
          >
            <p>Accueil</p>
          </Link>
          <Link
            onClick={() => {
              toggleMenu();
            }}
            href={"/#how-to"}
          >
            <p>Comment ça marche</p>
          </Link>
          <Link
            onClick={() => {
              toggleMenu();
            }}
            href={"/pricing"}
          >
            <p>Tarifs</p>
          </Link>
          <Link
            onClick={() => {
              toggleMenu();
            }}
            href={"/contact"}
          >
            <p>Contact</p>
          </Link>
          <Link
            onClick={() => {
              toggleMenu();
            }}
            href={"/login"}
          >
            <p>se connecter</p>
          </Link>
          <Link
            onClick={() => {
              toggleMenu();
            }}
            href={"/register"}
          >
            <p>s&apos;inscrire</p>
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
            <Link href="/">Accueil</Link>
          </li>
          <li>
            <Link href="/pricing">Tarifs</Link>
          </li>
          <Link href={"/#how-to"}>Comment ça marche</Link>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
        <div className={styles.buttons}>
          <Link href={"/login"}>
            <Button className={styles.login}>se&nbsp;connecter</Button>
          </Link>
          &nbsp;&nbsp;
          <Link href={"/register"}>
            <Button className={styles.register}>s&apos;inscrire</Button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Navbar;
