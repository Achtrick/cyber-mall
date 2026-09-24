import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import styles from "../../styles/vitrine/Layout.module.scss";
import {
  DEFAULT_OG_IMAGE,
  SITE_HOST,
  SITE_ICON,
  SITE_URL,
  absoluteUrl,
} from "../../utils/config/site";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout({ children, title, description, tags, image }) {
  // og:url used to be hardcoded to SITE_URL + "/" here, so every vitrine page
  // (pricing, contact, login, ...) reported the homepage as its shared URL
  // instead of its own -- fixed by deriving it from the actual route.
  const router = useRouter();
  const path = router.asPath.split("?")[0].split("#")[0];
  // Link-preview crawlers (WhatsApp, Facebook, X) don't render SVG, and most
  // pages pass their SVG illustration here, so those get the default card.
  const customImage = image && !/\.svg(\?|$)/i.test(image) ? image : null;
  const ogImage = absoluteUrl(customImage || DEFAULT_OG_IMAGE.url);
  const ogTitle = title ? `${title} - Cyber-Mall` : "Cyber-Mall";
  return (
    <>
      <Head>
        <title>{title ? `${title} | Cyber-Mall` : "Cyber-Mall"}</title>
        {description && <meta name="description" content={description} />}
        {tags && (
          <meta
            name="keywords"
            content={
              tags.join(", ") +
              "Tunisia, e-commerce, free e-commerce website, website creation, shopify, online store, business, shopify in tunisia, digital marketplace"
            }
          />
        )}
        {/* Social media meta */}
        <meta property="og:title" content={ogTitle} />
        <meta property="og:url" content={`${SITE_URL}${path}`} />
        {description && (
          <meta property="og:description" content={description} />
        )}
        <meta property="og:image" content={ogImage} />
        {ogImage.startsWith("https://") && (
          <meta property="og:image:secure_url" content={ogImage} />
        )}
        {!customImage && (
          <>
            <meta property="og:image:type" content={DEFAULT_OG_IMAGE.type} />
            <meta
              property="og:image:width"
              content={String(DEFAULT_OG_IMAGE.width)}
            />
            <meta
              property="og:image:height"
              content={String(DEFAULT_OG_IMAGE.height)}
            />
            <meta property="og:image:alt" content={DEFAULT_OG_IMAGE.alt} />
          </>
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={ogTitle} />
        {description && (
          <meta name="twitter:description" content={description} />
        )}
        <meta name="twitter:image" content={ogImage} />
        <link
          key="site-icon"
          rel="icon"
          type="image/svg+xml"
          href={SITE_ICON}
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/cybermall-192.png"
        />
        <link rel="shortcut icon" href="/cybermall-192.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={SITE_HOST} />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="theme-color" content="#000" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <meta name="robots" content="index, follow" />
      </Head>
      <Navbar />
      <section className={styles.children}>{children}</section>
      <Footer />
    </>
  );
}

export default Layout;
