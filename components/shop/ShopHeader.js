import React from "react";
import { isColorDark } from "../../utils/config/convertHelper";

function ShopHeader({ shopSettings }) {
  return (
    <div
      style={{
        backgroundColor: shopSettings.headerColor,
        color: isColorDark(shopSettings.headerColor) ? "white" : "black",
      }}
    >
      this is the header
    </div>
  );
}

export default ShopHeader;
