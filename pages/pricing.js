import Link from "next/link";
import React from "react";
import ConnectedGuard from "../components/guards/connectedGuard";
import Layout from "../components/vitrine/Layout";
import styles from "../styles/vitrine/Pricing.module.scss";
import { CheckCircleIcon } from "../utils/theme/icons";

const PREMIUM_FEATURES = [
  "Unlimited categories",
  "Unlimited products",
  "Up to 6 images per product",
  "Unlimited home page slides",
  "Invoice generation",
  "Domain name of your choice",
  "AI assistant",
];

const PLANS = [
  {
    name: "Basic",
    price: "Free",
    period: null,
    features: [
      "Shop creation",
      "Add a logo",
      "Customize the theme",
      "Customize the structure",
      "Categories: 5",
      "Products: 10",
      "Images per product: 1",
      "Home slides: 3",
    ],
    cta: "Sign up",
    accent: "basic",
  },
  {
    name: "Premium monthly",
    price: "49 DT",
    period: "/ month",
    features: PREMIUM_FEATURES,
    cta: "Sign up",
    accent: "monthly",
  },
  {
    name: "Premium yearly",
    price: "499 DT",
    oldPrice: "588 DT",
    period: "/ year",
    features: PREMIUM_FEATURES,
    cta: "Sign up",
    accent: "yearly",
    badge: "Best value",
    highlighted: true,
  },
];

function Pricing(props) {
  return (
    <ConnectedGuard>
      <Layout
        title={"Pricing and subscriptions"}
        description={"we offer different flexible packs to meet your needs!"}
        image={"/images/pricing.svg"}
      >
        <section className={styles.container}>
          <p className={styles.eyebrow} data-aos="fade-up" data-aos-offset="100">
            Choose a plan to grow your business
          </p>
          <p className={styles.lede} data-aos="fade-up" data-aos-offset="100">
            we offer different flexible packs to meet your needs!
          </p>

          <div className={styles.packs}>
            {PLANS.map((plan, i) => (
              <div
                key={plan.name}
                data-aos={i === 0 ? "fade-right" : i === 2 ? "fade-left" : "fade-up"}
                data-aos-offset="100"
                className={`${styles.pack} ${styles[plan.accent]} ${
                  plan.highlighted ? styles.highlighted : ""
                }`}
              >
                {plan.badge ? <span className={styles.badge}>{plan.badge}</span> : null}
                <div className={styles.packHeader}>
                  <p className={styles.planName}>{plan.name}</p>
                  <div className={styles.priceRow}>
                    {plan.oldPrice ? (
                      <span className={styles.oldPrice}>{plan.oldPrice}</span>
                    ) : null}
                    <span className={styles.price}>{plan.price}</span>
                    {plan.period ? (
                      <span className={styles.period}>{plan.period}</span>
                    ) : null}
                  </div>
                </div>
                <ul className={styles.featureList}>
                  {plan.features.map((f) => (
                    <li key={f}>
                      <CheckCircleIcon />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link href={"/register"} className={styles.cta}>
                  <span
                    className={
                      plan.accent === "basic" ? "btn" : "btn btn-primary"
                    }
                  >
                    {plan.cta}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    </ConnectedGuard>
  );
}

export default Pricing;
