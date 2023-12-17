import React, { useEffect, useState } from "react";
import ShopHeader from "./ShopHeader";
import ShopFooter from "./ShopFooter";
import { isColorDark } from "../../utils/config/convertHelper";

function ShopLayout({ shopInfo, ...props }) {
  const [deducedHeaderColor, setDeducedHeaderColor] = useState("white");
  const [deducedHeaderColorInverse, setDeducedHeaderColorInverse] =
    useState("black");
  const [deducedFooterColor, setDeducedFooterColor] = useState("white");
  const [deducedFooterColorInverse, setDeducedFooterColorInverse] =
    useState("black");
  const [deducedPimaryColor, setDeducedPrimaryColor] = useState("white");

  useEffect(() => {
    setDeducedHeaderColor(
      isColorDark(shopInfo.settings.headerColor) ? "white" : "black"
    );
    setDeducedHeaderColorInverse(
      isColorDark(shopInfo.settings.headerColor) ? "black" : "white"
    );
    setDeducedFooterColor(
      isColorDark(shopInfo.settings.footerColor) ? "white" : "black"
    );
    setDeducedFooterColorInverse(
      isColorDark(shopInfo.settings.footerColor) ? "black" : "white"
    );
    setDeducedPrimaryColor(
      isColorDark(shopInfo.settings.primaryColor) ? "white" : "black"
    );
  }, []);

  return (
    <>
      <ShopHeader
        shopInfo={shopInfo}
        deducedColor={deducedHeaderColor}
        deducedColorInverse={deducedHeaderColorInverse}
      />
      <div>
        {React.Children.map(props.children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                deducedPimaryColor: deducedPimaryColor,
              })
            : child
        )}
      </div>
      <ShopFooter
        shopInfo={shopInfo}
        deducedColor={deducedFooterColor}
        deducedColorInverse={deducedFooterColorInverse}
      />
    </>
  );
}

export default ShopLayout;
