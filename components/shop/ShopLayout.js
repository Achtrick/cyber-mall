import React from "react";
import ShopFooter from "./ShopFooter";
import ShopHeader from "./ShopHeader";

function ShopLayout({ shopInfo, ...props }) {
  return (
    <>
      <ShopHeader shopInfo={shopInfo} />
      <div style={{ marginTop: "80px" }}>{props.children}</div>
      <ShopFooter shopInfo={shopInfo} />
    </>
  );
}

export default ShopLayout;
