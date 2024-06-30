import { Language, Palette } from "@mui/icons-material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useMediaQuery } from "@mui/material";
import React from "react";
import styles from "../../styles/vitrine/Steps.module.scss";

function Steps(props) {
  const isMobile = useMediaQuery("(max-width:800px)");
  return (
    <section className={styles.container}>
      <p>Comment ça marche</p>
      <div className={styles.steps}>
        <div className={styles.step} data-aos="fade-up" data-aos-delay="100">
          <div className={styles.icon}>
            <AppRegistrationIcon color="white" />
          </div>
          <p>S&apos;inscrire</p>
          <p>
            créez votre compte et choisissez un nom unique pour votre business.
          </p>
        </div>
        <div align="center">
          <ArrowForwardIosIcon style={{ color: "#ccc" }} />
        </div>
        <div className={styles.step} data-aos="fade-up" data-aos-delay="200">
          <div className={styles.icon}>
            <CategoryIcon color="white" />
          </div>
          <p>créez vos catégories</p>
          <p>
            organisez vos catégories pour grouper les produits de votre shop.
          </p>
        </div>
        <div align="center">
          <ArrowForwardIosIcon style={{ color: "#ccc" }} />
        </div>
        <div className={styles.step} data-aos="fade-up" data-aos-delay="300">
          <div className={styles.icon}>
            <InventoryIcon color="white" />
          </div>
          <p>créez vos produits</p>
          <p>Organisez les produits sous les catégories qui correspondent.</p>
        </div>
        {isMobile ? (
          <div align="center">
            <ArrowForwardIosIcon style={{ color: "#ccc" }} />
          </div>
        ) : null}
        <div className={styles.step} data-aos="fade-up" data-aos-delay="400">
          <div className={styles.icon}>
            <Palette color="white" />
          </div>
          <p>thème et structure</p>
          <p>
            personnalisez votre shop à votre goût et organisez la structure des
            blocs.
          </p>
        </div>
        <div align="center">
          <ArrowForwardIosIcon style={{ color: "#ccc" }} />
        </div>
        <div className={styles.step} data-aos="fade-up" data-aos-delay="500">
          <div className={styles.icon}>
            <Language color="white" />
          </div>
          <p>nom de domaine</p>
          <p>
            Ajoutez votre nom de domaine afin de rendre l&apos;accès à vos
            services plus facile. clients.
          </p>
        </div>
        <div align="center">
          <ArrowForwardIosIcon style={{ color: "#ccc" }} />
        </div>
        <div className={styles.step} data-aos="fade-up" data-aos-delay="600">
          <div className={styles.icon}>
            <StorefrontIcon color="white" />
          </div>
          <p>vente et facturation</p>
          <p>
            Tout est fait. Vous pouvez maintenant commencer à accepter des
            commandes et générer des factures pour vos clients.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Steps;
