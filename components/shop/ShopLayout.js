import React from "react";
import ShopHeader from "./ShopHeader";
import ShopFooter from "./ShopFooter";

function ShopLayout({ shopInfo, ...props }) {
  return (
    <>
      <ShopHeader shopInfo={shopInfo} />
      <div>{props.children}</div>
      <ShopFooter shopInfo={shopInfo} />
    </>
  );
}

export default ShopLayout;
