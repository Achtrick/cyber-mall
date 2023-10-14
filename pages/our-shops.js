import React from "react";
import Layout from "../components/vitrine/Layout";
import ConnectedGuard from "../components/guards/connectedGuard";

function OurShops(props) {
  return (
    <ConnectedGuard>
      <Layout>
        <div>all shops list</div>
      </Layout>
    </ConnectedGuard>
  );
}

export default OurShops;
