import React, { useEffect, useState } from "react";
import styles from "../../styles/vitrine/Navbar.module.scss";
import Image from "next/image";
import { Button } from "@mui/material";
import Link from "next/link";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 10;
      setScrolled(scrollCheck);
    });
  });

  return (
    <section
      className={
        scrolled ? `${styles.navbar} + ${styles.scrolled}` : styles.navbar
      }
    >
      <Link href={"/"} className={styles.logo}>
        <Image alt="logo" src="/images/logo.svg" width={"120"} height={"60"} />
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
  );
}

export default Navbar;
