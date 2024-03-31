import React from "react";
import ConnectedGuard from "../components/guards/connectedGuard";
import XHr from "../components/ui-components/XHr";
import BecomeMember from "../components/vitrine/BecomeMember";
import Control from "../components/vitrine/Control";
import Customize from "../components/vitrine/Customize";
import HomeHedaer from "../components/vitrine/HomeHedaer";
import Layout from "../components/vitrine/Layout";
import Receipts from "../components/vitrine/Receipts";

export default function Home() {
  return (
    <ConnectedGuard>
      <Layout>
        <HomeHedaer />
        <br />
        <XHr width="20%" marginLeft="40%" color={"var(--second-color)"} />
        <span id="customize" />
        <br />
        <Customize />
        <br />
        <XHr width="20%" marginLeft="40%" color={"var(--second-color)"} />
        <span id="dashboard" />
        <br />
        <Control />
        <br />
        <XHr width="20%" marginLeft="40%" color={"var(--second-color)"} />
        <span id="receipts" />
        <br />
        <Receipts />
        <br />
        <BecomeMember />
      </Layout>
    </ConnectedGuard>
  );
}
