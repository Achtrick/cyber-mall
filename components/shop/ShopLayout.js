import Head from "next/head";
import React from "react";
import InstallPWA from "../installPwa";
import { SITE_HOST, SITE_URL, absoluteUrl } from "../../utils/config/site";
import {
  isDrawableLogo,
  shopImageUrl,
  shopLogoFile,
} from "../../utils/shared/shopBrandImages";
import ShopFooter from "./ShopFooter";
import ShopHeader from "./ShopHeader";

function ShopLayout({
  shopInfo,
  title,
  description,
  tags,
  image,
  url,
  ...props
}) {
  const shopNameCap =
    shopInfo.name.charAt(0).toUpperCase() + shopInfo.name.slice(1);

  // The shop's link-preview card and tab icon are generated from its logo on
  // its header color (pages/api/og/shop/[variant].js): the raw logo is at most
  // 198px wide and often white on transparent, which crawlers either ignore
  // (too small) or show as a blank white card, and which is unreadable as a
  // favicon. A shop without a logo gets its name / initial instead.
  const logoFile = shopLogoFile(shopInfo);
  // an older WebP/AVIF logo can't be drawn: use it as the tab icon directly
  const shopIcon =
    logoFile && !isDrawableLogo(logoFile)
      ? `/api/images/${logoFile}`
      : shopImageUrl(shopInfo, "icon.png");
  // product pages pass the product photo; every other shop page uses the card
  const ogImage = absoluteUrl(image || shopImageUrl(shopInfo, "card.png"));
  const ogTitle = title ? `${title} - ${shopInfo.name}` : `${shopInfo.name}`;
  return (
    <>
      <InstallPWA top="90px" color={shopInfo.settings.secondaryColor} />
      <Head>
        <title>{title ? `${title} | ${shopNameCap}` : `${shopNameCap}`}</title>
        {description && <meta name="description" content={description} />}
        {tags && (
          <meta
            name="keywords"
            content={
              tags.join(", ") +
              "Tunisia, e-commerce, free e-commerce website, website creation, online store, business, shopify in tunisia, digital marketplace"
            }
          />
        )}
        {/* Social media meta */}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:url" content={`${SITE_URL}/${url}`} />
        {description && (
          <meta property="og:description" content={description} />
        )}
        <meta property="og:image" content={ogImage} />
        {ogImage.startsWith("https://") && (
          <meta property="og:image:secure_url" content={ogImage} />
        )}
        {!image && (
          <>
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
          </>
        )}
        <meta
          property="og:image:alt"
          content={image && title ? title : shopNameCap}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        {description && (
          <meta name="twitter:description" content={description} />
        )}
        <meta name="twitter:image" content={ogImage} />
        {/* always the shop's own icon (it used to be the product photo on
            product pages), and no platform icon anywhere on shop pages */}
        <link rel="icon" type="image/png" sizes="192x192" href={shopIcon} />
        <link rel="apple-touch-icon" href={shopIcon} />
        <link rel="manifest" href={`/manifests/${shopInfo.name}.webmanifest`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_HOST} />
        <meta
          name="msapplication-TileColor"
          content={shopInfo.settings.headerColor}
        />
        <meta name="theme-color" content={shopInfo.settings.primaryColor} />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="robots" content="index, follow" />
      </Head>
      <ShopHeader shopInfo={shopInfo} />
      <div style={{ marginTop: "80px", minHeight: "55vh" }}>
        {props.children}
      </div>
      <ShopFooter shopInfo={shopInfo} />
    </>
  );
}

export default ShopLayout;
