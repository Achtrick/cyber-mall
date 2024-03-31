import React from "react";
import styles from "../../styles/vitrine/HomeHedaer.module.scss";

function HomeHedaer(props) {
  return (
    <section className={styles.container}>
      <div className={styles.overlay}>
        <h1>Rendre le commerce meilleur pour tous</h1>
        <p>
          Cyber-Mall accompagne la prochaine génération d&apos;entrepreneurs,
          les plus grandes marques du monde, et tout entre les deux.
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
