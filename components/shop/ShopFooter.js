import React from "react";
import { isColorDark } from "../../utils/config/convertHelper";

function ShopFooter({ shopSettings }) {
  return (
    <div
      style={{
        backgroundColor: shopSettings.footerColor,
        color: isColorDark(shopSettings.headerColor) ? "white" : "black",
      }}
    >
      this is the footer
    </div>
  );
}

export default ShopFooter;
