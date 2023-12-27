import React from "react";
import { deduceColor } from "../../utils/config/convertHelper";

function ShopFooter({ shopInfo }) {
  return (
    <div
      style={{
        backgroundColor: shopInfo.settings.footerColor,
        color: deduceColor(shopInfo.settings.footerColor),
        borderTop: `1px solid ${deduceColor(shopInfo.settings.footerColor)}`,
      }}
    >
      this is the footer
    </div>
  );
}

export default ShopFooter;
