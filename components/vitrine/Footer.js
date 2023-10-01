import React from "react";
import styles from "../../styles/vitrine/Footer.module.scss";
function Footer(props) {
  return (
    <section className={styles.container}>
      <div className={styles.col}>
        <p>Support</p>
      </div>
      <div className={styles.col}>
        <p>Services</p>
      </div>
      <div className={styles.col}>
        <p>NewsLetter</p>
      </div>
    </section>
  );
}

export default Footer;
