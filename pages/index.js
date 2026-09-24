import React from "react";
import ConnectedGuard from "../components/guards/connectedGuard";
import XHr from "../components/ui-components/XHr";
import BecomeMember from "../components/vitrine/BecomeMember";
import BrowseShops from "../components/vitrine/BrowseShops";
import Control from "../components/vitrine/Control";
import Customize from "../components/vitrine/Customize";
import Domain from "../components/vitrine/Domain";
import HomeHedaer from "../components/vitrine/HomeHedaer";
import Layout from "../components/vitrine/Layout";
import Receipts from "../components/vitrine/Receipts";
import Steps from "../components/vitrine/Steps";

export default function Home() {
  return (
    <ConnectedGuard>
      <Layout description={"Making commerce better for everyone"}>
        <HomeHedaer />
        <br />
        <XHr width="10%" marginLeft="45%" color={"var(--second-color)"} />
        <span id="customize" />
        <br />
        <Customize />
        <br />
        <XHr width="10%" marginLeft="45%" color={"var(--second-color)"} />
        <span id="dashboard" />
        <br />
        <Control />
        <br />
        <XHr width="10%" marginLeft="45%" color={"var(--second-color)"} />
        <span id="receipts" />
        <br />
        <Receipts />
        <br />
        <XHr width="10%" marginLeft="45%" color={"var(--second-color)"} />
        <span id="domain" />
        <br />
        <Domain />
        <br />
        <XHr width="10%" marginLeft="45%" color={"var(--second-color)"} />
        <span id="how-to" />
        <br />
        <br />
        <Steps />
        <br />
        <BecomeMember />
        <br />
        <BrowseShops />
      </Layout>
    </ConnectedGuard>
  );
}
