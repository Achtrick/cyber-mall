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
          <p>réseaux sociaux</p>
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
            <Link href={"/#customize"}>Personnalisez votre shop</Link>
          </p>
          <p>
            <Link href={"/#dashboard"}>Tableau de bord tout-en-un</Link>
          </p>
          <p>
            <Link href={"/#receipts"}>Générer des factures</Link>
          </p>
          <p>
            <Link href={"/#domain"}>Intégrer votre nom de domaine</Link>
          </p>
        </div>
        <div className={styles.col}>
          <p>Sécurité</p>
          <p>
            <Link href={"/condition-of-use"}>
              Conditions d&apos;utilisation
            </Link>
          </p>
          <p>
            <Link href={"/privacy-policy"}>Politique de confidentialité</Link>
          </p>
        </div>
      </div>
      <div className={styles.shoutout}>
        Développé par&nbsp;
        <Link rel="noreferrer" target="_blank" href="https://ashref-mtir.dev">
          Ashref-mtir
        </Link>
      </div>
    </section>
  );
}

export default Footer;
