import React from "react";
import styles from "../../styles/vitrine/HomeHedaer.module.scss";

function HomeHedaer(props) {
  return (
    <section className={styles.container}>
      <div className={styles.overlay}>
        <h1>Making Commerce Better for Everyone</h1>
        <p>
          Shopify is supporting the next generation of entrepreneurs, the
          world&apos;s biggest brands, and everyone in between
        </p>
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
