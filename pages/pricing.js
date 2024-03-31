import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";
import ConnectedGuard from "../components/guards/connectedGuard";
import Layout from "../components/vitrine/Layout";
import styles from "../styles/vitrine/Pricing.module.scss";

function Pricing(props) {
  return (
    <ConnectedGuard>
      <Layout>
        <section className={styles.container}>
          <p data-aos="fade-up" data-aos-offset="100">
            Choose a plan to grow your business
          </p>
          <p data-aos="fade-up" data-aos-offset="100">
            we provide different flexible packs to suit your needs !
          </p>
          <hr />
          <br />
          <div className={styles.packs}>
            <div
              data-aos="fade-right"
              data-aos-offset="100"
              className={styles.pack}
            >
              <p>basic</p>
              <br />
              <p>
                create your website for free and start selling your products !
              </p>
              <hr />
              <ul>
                <li>website creation</li>
                <li>add logo</li>
                <li>customize website theme</li>
                <li>customize website structure</li>
                <li>categories: 5</li>
                <li>products: 10</li>
                <li>images per product: 1</li>
                <li>home slides: 3</li>
                <li>mobile access: restricted</li>
                <li>invoice generation: restricted</li>
              </ul>
              <hr />
              <p>Free</p>
              <Link href={"/register"}>
                <Button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    textTransform: "capitalize",
                  }}
                  variant="contained"
                >
                  get started
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
              <p>access dashboard on the go and break from restrictions !</p>
              <hr />
              <ul>
                <li>website creation</li>
                <li>add logo</li>
                <li>customize website theme</li>
                <li>customize website structure</li>
                <li>categories: unlimited</li>
                <li>products: unlimited</li>
                <li>images per product: 3</li>
                <li>home slides: unlimited</li>
                <li>mobile access: allowed</li>
                <li>invoice generation: allowed</li>
              </ul>
              <hr />
              <p>30 DT / Month</p>
              <Link href={"/register"}>
                <Button
                  style={{
                    backgroundColor: "black",
                    color: "white",
                    textTransform: "capitalize",
                  }}
                  variant="contained"
                >
                  get started
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
