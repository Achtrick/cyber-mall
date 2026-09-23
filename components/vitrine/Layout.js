import Head from "next/head";
import React from "react";
import styles from "../../styles/vitrine/Layout.module.scss";
import { SITE_HOST, SITE_URL } from "../../utils/config/site";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout({ children, title, description, tags, image }) {
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
        <meta
          property="og:title"
          content={title ? `${title} - Cyber-Mall` : "Cyber-Mall"}
        />
        <meta property="og:url" content={`${SITE_URL}/`} />
        {description && (
          <meta property="og:description" content={description} />
        )}
        <meta property="og:image" content={image || "/logo-512.png"} />
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
