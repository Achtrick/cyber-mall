import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";
import styles from "../../styles/vitrine/BecomeMember.module.scss";

function BecomeMember(props) {
  return (
    <section className={styles.container}>
      <h1 className={styles.title}>
        Become a <span className={styles.title__stress}>member</span>
        .<br />
        Create <span className={styles.title__stress}>your shop</span> now.
      </h1>
      <Link href={"/register-shop"}>
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

export default BecomeMember;
