import React from "react";
import styles from "../../styles/vitrine/Layout.module.scss";
import Footer from "./Footer";
import Navbar from "./Navbar";

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
