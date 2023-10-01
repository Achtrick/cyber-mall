import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import styles from "../../styles/vitrine/Layout.module.scss";

function Layout(props) {
  return (
    <>
      <Navbar />
      <section className={styles.children}>{props.children}</section>
      <Footer />
    </>
  );
}

export default Layout;
