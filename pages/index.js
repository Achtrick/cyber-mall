import HomeHedaer from "../components/vitrine/HomeHedaer";
import Layout from "../components/vitrine/Layout";
import styles from "../styles/Home.module.scss";
import React from "react";

export default function Home() {
  return (
    <Layout>
      <HomeHedaer />
      <section>Home</section>
    </Layout>
  );
}
