import React from "react";
import PWA from "../PWA";
import ShopFooter from "./ShopFooter";
import ShopHeader from "./ShopHeader";

function ShopLayout({ shopInfo, ...props }) {
  return (
    <>
      <PWA
        appName={shopInfo.name}
        accentColor={shopInfo.settings.secondaryColor}
      />
      <ShopHeader shopInfo={shopInfo} />
      <div style={{ marginTop: "80px", minHeight: "55vh" }}>
        {props.children}
      </div>
      <ShopFooter shopInfo={shopInfo} />
    </>
  );
}

export default ShopLayout;
