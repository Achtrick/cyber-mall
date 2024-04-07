import Head from "next/head";
import React from "react";
import InstallPWA from "../installPwa";
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
        {description && <meta name="description" content={description}></meta>}
        {tags && (
          <meta
            name="keywords"
            content={
              tags.join(", ") +
              "Tunisia, e-commerce, free e-commerce website, website creation, online store, business, shopify in tunisia, digital marketplace"
            }
          ></meta>
        )}
        {/* social media meta */}
        <meta property="og:locale" content="fr_TN" />
        <meta
          property="og:title"
          content={title ? `${title} - ${shopInfo.name}` : `${shopInfo.name}`}
        />
        <meta property="og:url" content={`http://cyber-mall.tn/${url}`} />
        {description && (
          <meta property="og:description" content={description} />
        )}
        <meta
          property="og:image"
          content={
            image ?? `/api/images/fill/${shopInfo.logo.split("/").pop()}`
          }
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href={image ?? `/api/images/fill/${shopInfo.logo.split("/").pop()}`}
        />
        <link
          rel="icon"
          type="image/ico"
          sizes="32x32"
          href={image ?? `/api/images/fill/${shopInfo.logo.split("/").pop()}`}
        />
        <link
          rel="icon"
          type="image/ico"
          sizes="16x16"
          href={image ?? `/api/images/fill/${shopInfo.logo.split("/").pop()}`}
        />
        <link rel="manifest" href={`/manifests/${shopInfo.name}.webmanifest`} />
        <link
          rel="mask-icon"
          href={image ?? `/api/images/fill/${shopInfo.logo.split("/").pop()}`}
        />
        <link
          rel="shortcut icon"
          href={image ?? `/api/images/fill/${shopInfo.logo.split("/").pop()}`}
        />
        <meta name="author" content={shopInfo.name} />
        <meta name="geo.region" content="TN" />
        <meta name="geo.placename" content="Tunisia" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={`http://cyber-mall.tn/${url}`} />
        <meta
          name="msapplication-TileColor"
          content={shopInfo.settings.headerColor}
        />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content={shopInfo.settings.primaryColor} />
        <meta charSet="utf-8" />
        <link rel="canonical" href={`http://cyber-mall.tn/${url}`} />
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
