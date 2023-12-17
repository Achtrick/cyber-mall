import React from "react";

function ShopFooter({ deducedColor, deducedColorInverse, shopInfo }) {
  return (
    <div
      style={{
        backgroundColor: shopInfo.settings.footerColor,
        color: deducedColor,
        borderTop: `1px solid ${deducedColor}`,
      }}
    >
      this is the footer
    </div>
  );
}

export default ShopFooter;
