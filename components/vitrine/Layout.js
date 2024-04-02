import Head from "next/head";
import React from "react";
import styles from "../../styles/vitrine/Layout.module.scss";
import Footer from "./Footer";
import Navbar from "./Navbar";

function Layout({ children, title, description, tags, image }) {
  return (
    <>
      <Head>
        <title>{title ? `${title} | Cyber-Mall` : "Cyber-Mall"}</title>
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
          content={title ? `${title} - Cyber-Mall` : "Cyber-Mall"}
        />
        <meta property="og:url" content="http://cyber-mall.tn/" />
        {description && (
          <meta property="og:description" content={description} />
        )}
        {image !== "" ? (
          <meta property="og:image" content={image} />
        ) : (
          <meta property="og:image" content="/logo-512.png" />
        )}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/cybermall-192.png"
        />
        <link rel="icon" type="image/ico" sizes="32x32" href="/favicon.ico" />
        <link rel="icon" type="image/ico" sizes="16x16" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="mask-icon" href="/cybermall-192.png" />
        <link rel="shortcut icon" href="/cybermall-192.png" />
        <meta name="author" content="Cyber-Mall" />
        <meta name="geo.region" content="TN" />
        <meta name="geo.placename" content="Tunisia" />
        <meta name="geo.position" content="35°50′N;10°38′E" />
        <meta name="ICBM" content="35°50′N , 10°38′E" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="cyber-mall.tn" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="theme-color" content="#000" />
        <meta charSet="utf-8" />
        <link rel="canonical" href="https://cyber-mall.tn" />
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
