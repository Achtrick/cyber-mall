import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";
import ConnectedGuard from "../components/guards/connectedGuard";
import XHr from "../components/ui-components/XHr";
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
          <div className={styles.packs}>
            <div
              data-aos="fade-right"
              data-aos-offset="100"
              className={styles.pack}
            >
              <div style={{ width: "100%" }}>
                <p>basique</p>
                <p>Gratuit</p>
                <XHr color={"#f2f2f2"} />
              </div>
              <ul>
                <li>création de shop</li>
                <li>ajouter un logo</li>
                <li>personnaliser le thème</li>
                <li>personnaliser la structure</li>
                <li>catégories : 5</li>
                <li>produits : 10</li>
                <li>images par produit : 1</li>
                <li>diapositives d&apos;accueil : 3</li>
              </ul>
              <Link href={"/register"}>
                <Button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    textTransform: "capitalize",
                  }}
                  variant="contained"
                >
                  S&apos;inscrire
                </Button>
              </Link>
            </div>
            <div
              data-aos="fade-up"
              data-aos-offset="100"
              className={styles.pack}
            >
              <div style={{ width: "100%" }}>
                <p>premium mensuelle</p>
                <p>49 DT</p>
                <XHr color={"#f2f2f2"} />
              </div>
              <ul>
                <li>création de shop</li>
                <li>ajouter un logo</li>
                <li>personnaliser le thème</li>
                <li>personnaliser la structure</li>
                <li>catégories : illimitées</li>
                <li>produits : illimité</li>
                <li>images par produit : 6</li>
                <li>diapositives d&apos;accueil : illimitées</li>
                <li>génération de facture</li>
                <li>Nom de domaine de votre choix</li>
              </ul>
              <Link href={"/register"}>
                <Button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    textTransform: "capitalize",
                  }}
                  variant="contained"
                >
                  S&apos;inscrire
                </Button>
              </Link>
            </div>
            <div
              data-aos="fade-left"
              data-aos-offset="100"
              className={styles.pack}
            >
              <div style={{ width: "100%" }}>
                <p>premium annuelle</p>
                <div className="row">
                  <p style={{ textDecoration: "line-through" }}>588 DT</p>&nbsp;
                  <p>499 DT</p>
                </div>
                <XHr color={"#f2f2f2"} />
              </div>
              <ul>
                <li>création de shop</li>
                <li>ajouter un logo</li>
                <li>personnaliser le thème</li>
                <li>personnaliser la structure</li>
                <li>catégories : illimitées</li>
                <li>produits : illimité</li>
                <li>images par produit : 6</li>
                <li>diapositives d&apos;accueil : illimitées</li>
                <li>génération de facture</li>
                <li>Nom de domaine de votre choix</li>
              </ul>
              <Link href={"/register"}>
                <Button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    textTransform: "capitalize",
                  }}
                  variant="contained"
                >
                  S&apos;inscrire
                </Button>
              </Link>
            </div>
          </div>
          <br />
          <div className="row">
            <XHr color="var(--second-color)" width="150px" />
          </div>
          <br />
          <p data-aos="fade-up" data-aos-offset="100">
            Choisissez un plan pour développer votre business
          </p>
          <p data-aos="fade-up" data-aos-offset="100">
            nous proposons différents packs flexibles pour répondre à vos
            besoins !
          </p>

          <br />
        </section>
      </Layout>
    </ConnectedGuard>
  );
}

export default Pricing;
