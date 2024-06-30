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
          <h1>Rendre le commerce meilleur pour tous</h1>
          <p>
            Cyber-Mall accompagne la prochaine génération d&apos;entrepreneurs,
            les plus grandes marques du monde, et tout entre les deux.
          </p>
        </div>
        <Link href={"/register"}>
          <Button style={{ backgroundColor: "white", color: "black" }}>
            s&apos;inscrire
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
