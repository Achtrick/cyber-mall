import React from "react";
import { isColorDark } from "../../utils/config/convertHelper";

function ShopFooter({ shopInfo }) {
  return (
    <div
      style={{
        backgroundColor: shopInfo.settings.footerColor,
        color: isColorDark(shopInfo.settings.headerColor) ? "white" : "black",
      }}
    >
      this is the footer
    </div>
  );
}

export default ShopFooter;
