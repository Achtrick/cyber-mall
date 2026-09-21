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
        title={"Pricing and subscriptions"}
        description={
          "we offer different flexible packs to meet your needs!"
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
                <p>basic</p>
                <p>Free</p>
                <XHr color={"#f2f2f2"} />
              </div>
              <ul>
                <li>shop creation</li>
                <li>add a logo</li>
                <li>customize the theme</li>
                <li>customize the structure</li>
                <li>categories: 5</li>
                <li>products: 10</li>
                <li>images per product: 1</li>
                <li>home slides: 3</li>
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
                  Sign up
                </Button>
              </Link>
            </div>
            <div
              data-aos="fade-up"
              data-aos-offset="100"
              className={styles.pack}
            >
              <div style={{ width: "100%" }}>
                <p>premium monthly</p>
                <p>49 DT</p>
                <XHr color={"#f2f2f2"} />
              </div>
              <ul>
                <li>shop creation</li>
                <li>add a logo</li>
                <li>customize the theme</li>
                <li>customize the structure</li>
                <li>categories: unlimited</li>
                <li>products: unlimited</li>
                <li>images per product: 6</li>
                <li>home slides: unlimited</li>
                <li>invoice generation</li>
                <li>Domain name of your choice</li>
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
                  Sign up
                </Button>
              </Link>
            </div>
            <div
              data-aos="fade-left"
              data-aos-offset="100"
              className={styles.pack}
            >
              <div style={{ width: "100%" }}>
                <p>premium yearly</p>
                <div className="row">
                  <p style={{ textDecoration: "line-through" }}>588 DT</p>&nbsp;
                  <p>499 DT</p>
                </div>
                <XHr color={"#f2f2f2"} />
              </div>
              <ul>
                <li>shop creation</li>
                <li>add a logo</li>
                <li>customize the theme</li>
                <li>customize the structure</li>
                <li>categories: unlimited</li>
                <li>products: unlimited</li>
                <li>images per product: 6</li>
                <li>home slides: unlimited</li>
                <li>invoice generation</li>
                <li>Domain name of your choice</li>
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
                  Sign up
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
            Choose a plan to grow your business
          </p>
          <p data-aos="fade-up" data-aos-offset="100">
            we offer different flexible packs to meet your
            needs!
          </p>

          <br />
        </section>
      </Layout>
    </ConnectedGuard>
  );
}

export default Pricing;
