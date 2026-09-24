import Head from "next/head";
import React from "react";
import InstallPWA from "../installPwa";
import { SITE_HOST, SITE_URL, absoluteUrl } from "../../utils/config/site";
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
        <meta
          property="og:title"
          content={title ? `${title} - ${shopInfo.name}` : `${shopInfo.name}`}
        />
        <meta property="og:url" content={`${SITE_URL}/${url}`} />
        {description && (
          <meta property="og:description" content={description} />
        )}
        <meta
          property="og:image"
          content={absoluteUrl(
            image ?? `/api/images/fill/${shopInfo.logo.split("/").pop()}`
          )}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={image ?? `/api/images/fill/${shopInfo.logo.split("/").pop()}`}
        />
        <link
          rel="shortcut icon"
          href={image ?? `/api/images/fill/${shopInfo.logo.split("/").pop()}`}
        />
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
