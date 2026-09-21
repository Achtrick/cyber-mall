import { Button, useMediaQuery } from "@mui/material";
import Link from "next/link";
import React from "react";
import styles from "../../styles/vitrine/HomeHedaer.module.scss";

function HomeHedaer(props) {
  const isMobile = useMediaQuery("(max-width:800px)");
  return (
    <section
      className={styles.container}
      style={{ height: isMobile ? "calc(100vh - 55px)" : "100vh" }}
    >
      <div className={styles.overlay}>
        <div className={styles.text}>
          <h1>Making commerce better for everyone</h1>
          <p>
            Cyber-Mall supports the next generation of entrepreneurs, the
            world&apos;s biggest brands, and everything in between.
          </p>
        </div>
        <Link href={"/register"}>
          <Button className={styles.cta}>
            sign up
          </Button>
        </Link>
      </div>
      <video
        className={styles.video}
        width="100%"
        height="100%"
        autoPlay
        loop
        muted
      >
        <source src="/videos/home-header.mp4" type="video/mp4" />
      </video>
    </section>
  );
}

export default HomeHedaer;
