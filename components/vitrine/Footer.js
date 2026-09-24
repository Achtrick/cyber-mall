import Link from "next/link";
import React from "react";
import styles from "../../styles/vitrine/Footer.module.scss";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
} from "../../utils/theme/icons";
function Footer(props) {
  return (
    <section className={styles.container}>
      <div className={styles.row}>
        <div className={styles.col}>
          <p>social media</p>
          <Link
            rel="noreferrer"
            target="_blank"
            href={"https://www.facebook.com/profile.php?id=61558042931219"}
          >
            <FacebookIcon />
          </Link>
          &nbsp;&nbsp;
          <Link
            rel="noreferrer"
            target="_blank"
            href={"https://www.instagram.com/cyber_mall_tn"}
          >
            <InstagramIcon />
          </Link>
          &nbsp;&nbsp;
          <Link
            rel="noreferrer"
            target="_blank"
            href={"https://www.tiktok.com/@cybermall.tn"}
          >
            <TiktokIcon />
          </Link>
        </div>
        <div className={styles.col}>
          <p>Services</p>
          <p>
            <Link href={"/#customize"}>Customize your shop</Link>
          </p>
          <p>
            <Link href={"/#dashboard"}>All-in-one dashboard</Link>
          </p>
          <p>
            <Link href={"/#receipts"}>Generate invoices</Link>
          </p>
          <p>
            <Link href={"/#domain"}>Integrate your domain name</Link>
          </p>
        </div>
        <div className={styles.col}>
          <p>Security</p>
          <p>
            <Link href={"/condition-of-use"}>
              Terms of use
            </Link>
          </p>
          <p>
            <Link href={"/privacy-policy"}>Privacy policy</Link>
          </p>
        </div>
      </div>
      <div className={styles.shoutout}>
        Developed by&nbsp;
        <Link rel="noreferrer" target="_blank" href="https://www.achraf-mtir.dev">
          Achraf Mtir
        </Link>
      </div>
    </section>
  );
}

export default Footer;
