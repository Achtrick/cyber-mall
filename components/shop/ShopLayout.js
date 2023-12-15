import React from "react";
import ShopHeader from "./shopHeader";
import ShopFooter from "./ShopFooter";

function ShopLayout({ shopSettings, ...props }) {
  return (
    <>
      <ShopHeader shopSettings={shopSettings} />
      <div>{props.children}</div>
      <ShopFooter shopSettings={shopSettings} />
    </>
  );
}

export default ShopLayout;
