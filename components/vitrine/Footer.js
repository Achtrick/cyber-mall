import React from "react";
import styles from "../../styles/vitrine/Footer.module.scss";
import Link from "next/link";
function Footer(props) {
  return (
    <section className={styles.container}>
      <div className={styles.col}>
        <p>Socials</p>
      </div>
      <div className={styles.col}>
        <p>Services</p>
        <p>
          <Link href={"/#customize"}>Customize your shop</Link>
        </p>
        <p>
          <Link href={"/#dashboard"}>AIO Dashboard</Link>
        </p>
        <p>
          <Link href={"/#receipts"}>Generate Invoices</Link>
        </p>
      </div>
      <div className={styles.col}>
        <p>Security</p>
        <p>
          <Link href={"/#customize"}>Terms of service</Link>
        </p>
        <p>
          <Link href={"/#dashboard"}>Conditions</Link>
        </p>
      </div>
    </section>
  );
}

export default Footer;
