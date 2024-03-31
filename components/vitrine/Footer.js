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
      <div className={styles.col}>
        <p>réseaux sociaux</p>
        <Link href={"https://facebook.com/"}>
          <FacebookIcon />
        </Link>
        &nbsp;&nbsp;
        <Link href={"https://instagram.com/"}>
          <InstagramIcon />
        </Link>
        &nbsp;&nbsp;
        <Link href={"https://tiktok.com/"}>
          <TiktokIcon />
        </Link>
      </div>
      <div className={styles.col}>
        <p>Services</p>
        <p>
          <Link href={"/#customize"}>Personnalisez votre shop</Link>
        </p>
        <p>
          <Link href={"/#dashboard"}>Tableau de bord tout-en-un</Link>
        </p>
        <p>
          <Link href={"/#receipts"}>Générer des factures</Link>
        </p>
      </div>
      <div className={styles.col}>
        <p>Sécurité</p>
        <p>
          <Link href={"/condition-of-use"}>Conditions d&apos;utilisation</Link>
        </p>
        <p>
          <Link href={"/privacy-policy"}>Politique de confidentialité</Link>
        </p>
      </div>
    </section>
  );
}

export default Footer;
