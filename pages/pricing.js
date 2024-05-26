import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";
import ConnectedGuard from "../components/guards/connectedGuard";
import Layout from "../components/vitrine/Layout";
import styles from "../styles/vitrine/Pricing.module.scss";

function Pricing(props) {
  return (
    <ConnectedGuard>
      <Layout
        title={"Tarifs et abonnements"}
        description={
          "nous proposons différents packs flexibles pour répondre à vos besoins !"
        }
        image={"/images/pricing.svg"}
      >
        <section className={styles.container}>
          <p data-aos="fade-up" data-aos-offset="100">
            Choisissez un plan pour développer votre entreprise
          </p>
          <p data-aos="fade-up" data-aos-offset="100">
            nous proposons différents packs flexibles pour répondre à vos
            besoins !
          </p>
          <hr />
          <br />
          <div className={styles.packs}>
            <div
              data-aos="fade-right"
              data-aos-offset="100"
              className={styles.pack}
            >
              <p>basique</p>
              <br />
              <p>
                créez votre shop gratuitement et commencez à vendre vos produits
                !
              </p>
              <hr />
              <ul>
                <li>création de shop</li>
                <li>ajouter un logo</li>
                <li>personnaliser le thème</li>
                <li>personnaliser la structure</li>
                <li>catégories : 5</li>
                <li>produits : 10</li>
                <li>images par produit : 1</li>
                <li>diapositives d&apos;accueil : 3</li>
                <li>Génération de facture : restreinte</li>
                <li>Nom de domaine de votre choix : restreinte</li>
              </ul>
              <hr />
              <p>Gratuit</p>
              <Link href={"/register"}>
                <Button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    textTransform: "capitalize",
                  }}
                  variant="contained"
                >
                  Commencer
                </Button>
              </Link>
            </div>
            <div
              data-aos="fade-left"
              data-aos-offset="100"
              className={styles.pack}
            >
              <p>premium</p>
              <br />
              <p>
                accédez au tableau de bord en déplacement et brisez les
                restrictions !
              </p>
              <hr />
              <ul>
                <li>création de shop</li>
                <li>ajouter un logo</li>
                <li>personnaliser le thème</li>
                <li>personnaliser la structure</li>
                <li>catégories : illimitées</li>
                <li>produits : illimité</li>
                <li>images par produit : 6</li>
                <li>diapositives d&apos;accueil : illimitées</li>
                <li>génération de facture : autorisée</li>
                <li>Nom de domaine de votre choix : autorisée</li>
              </ul>
              <hr />
              <p>30 DT / Mois</p>
              <Link href={"/register"}>
                <Button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    textTransform: "capitalize",
                  }}
                  variant="contained"
                >
                  Commencer
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </Layout>
    </ConnectedGuard>
  );
}

export default Pricing;
