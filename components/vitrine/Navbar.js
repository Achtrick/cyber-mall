import { Button, Drawer, IconButton } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styles from "../../styles/vitrine/Navbar.module.scss";
import useHideOnScroll from "../../utils/shared/useHideOnScroll";
import { CloseIcon, MenuIcon } from "../../utils/theme/icons";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const hidden = useHideOnScroll({ disabled: drawerOpen });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
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
            <p>Home</p>
          </Link>
          <Link
            onClick={() => {
              toggleMenu();
            }}
            href={"/#how-to"}
          >
            <p>How it works</p>
          </Link>
          <Link
            onClick={() => {
              toggleMenu();
            }}
            href={"/pricing"}
          >
            <p>Pricing</p>
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
            <p>log in</p>
          </Link>
          <Link
            onClick={() => {
              toggleMenu();
            }}
            href={"/register"}
          >
            <p>sign up</p>
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
        className={[
          styles.navbar,
          scrolled || router?.pathname !== "/" ? styles.scrolled : "",
          hidden ? styles.hidden : "",
        ]
          .filter(Boolean)
          .join(" ")}
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
            <Link href={"/#how-to"}>How it works</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
        <div className={styles.buttons}>
          <Link href={"/login"}>
            <Button className={styles.login}>log&nbsp;in</Button>
          </Link>
          &nbsp;&nbsp;
          <Link href={"/register"}>
            <Button className={styles.register}>sign up</Button>
          </Link>
        </div>
      </section>
    </>
  );
}

export default Navbar;
