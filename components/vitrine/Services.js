import React from "react";
import styles from "../../styles/vitrine/Services.module.scss";
import { Button } from "@mui/material";
import Link from "next/link";

function Services(props) {
  return (
    <section className={styles.free}>
      <h1 className={styles.title}>
        Become a <span className={styles.title__stress}>member</span>
        .<br />
        Create <span className={styles.title__stress}>your shop</span> now.
      </h1>
      <Link href={"/register"}>
        <Button
          style={{
            backgroundColor: "black",
            color: "white",
            textTransform: "capitalize",
          }}
          variant="contained"
        >
          become a member
        </Button>
      </Link>
    </section>
  );
}

export default Services;
