import ConnectedGuard from "../components/guards/connectedGuard";
import HomeHedaer from "../components/vitrine/HomeHedaer";
import Layout from "../components/vitrine/Layout";
import Services from "../components/vitrine/Services";
import React from "react";

export default function Home() {
  return (
    <ConnectedGuard>
      <Layout>
        <HomeHedaer />
        <Services />
      </Layout>
    </ConnectedGuard>
  );
}
