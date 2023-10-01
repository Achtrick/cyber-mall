import React, { useEffect, useState } from "react";
import styles from "../../styles/vitrine/Navbar.module.scss";
import Image from "next/image";
import { Button, IconButton, Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          <IconButton onClick={toggleMenu}>
            <CloseIcon />
          </IconButton>
        </div>
      </Drawer>
      <section
        className={
          scrolled ? `${styles.navbar} + ${styles.scrolled}` : styles.navbar
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
          {/* <Image
            alt="logo"
            src="/images/logo.svg"
            width={"120"}
            height={"60"}
          /> */}
          <p
            style={{
              color: "var(--first-color)",
              fontWeight: "400",
              fontSize: "30px",
            }}
          >
            Logo
          </p>
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
          <Button className={styles.login}>login</Button>&nbsp;&nbsp;
          <Button className={styles.register}>register</Button>
        </div>
      </section>
    </>
  );
}

export default Navbar;
