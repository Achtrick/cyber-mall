import { Language, Palette } from "@mui/icons-material";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CategoryIcon from "@mui/icons-material/Category";
import InventoryIcon from "@mui/icons-material/Inventory";
import StorefrontIcon from "@mui/icons-material/Storefront";
import { useMediaQuery } from "@mui/material";
import React from "react";
import styles from "../../styles/vitrine/Steps.module.scss";

function Steps(props) {
  const isMobile = useMediaQuery("(max-width:800px)");
  return (
    <section className={styles.container}>
      <p>How it works</p>
      <div className={styles.steps}>
        <div className={styles.step} data-aos="fade-up" data-aos-delay="100">
          <div className={styles.icon}>
            <AppRegistrationIcon color="white" />
          </div>
          <p>Sign up</p>
          <p>
            create your account and choose a unique name for your business.
          </p>
        </div>
        <div align="center">
          <ArrowForwardIosIcon style={{ color: "#ccc" }} />
        </div>
        <div className={styles.step} data-aos="fade-up" data-aos-delay="200">
          <div className={styles.icon}>
            <CategoryIcon color="white" />
          </div>
          <p>create your categories</p>
          <p>
            organize your categories to group your shop&apos;s products.
          </p>
        </div>
        <div align="center">
          <ArrowForwardIosIcon style={{ color: "#ccc" }} />
        </div>
        <div className={styles.step} data-aos="fade-up" data-aos-delay="300">
          <div className={styles.icon}>
            <InventoryIcon color="white" />
          </div>
          <p>create your products</p>
          <p>Organize products under the matching categories.</p>
        </div>
        {isMobile ? (
          <div align="center">
            <ArrowForwardIosIcon style={{ color: "#ccc" }} />
          </div>
        ) : null}
        <div className={styles.step} data-aos="fade-up" data-aos-delay="400">
          <div className={styles.icon}>
            <Palette color="white" />
          </div>
          <p>theme and structure</p>
          <p>
            customize your shop to your taste and organize the structure of
            the blocks.
          </p>
        </div>
        <div align="center">
          <ArrowForwardIosIcon style={{ color: "#ccc" }} />
        </div>
        <div className={styles.step} data-aos="fade-up" data-aos-delay="500">
          <div className={styles.icon}>
            <Language color="white" />
          </div>
          <p>domain name</p>
          <p>
            Add your domain name to make it easier for your customers to
            access your services.
          </p>
        </div>
        <div align="center">
          <ArrowForwardIosIcon style={{ color: "#ccc" }} />
        </div>
        <div className={styles.step} data-aos="fade-up" data-aos-delay="600">
          <div className={styles.icon}>
            <StorefrontIcon color="white" />
          </div>
          <p>sales and invoicing</p>
          <p>
            You&apos;re all set. You can now start accepting orders and
            generating invoices for your customers.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Steps;
