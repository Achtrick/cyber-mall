import { Button } from "@mui/material";
import Link from "next/link";
import React from "react";
import styles from "../../styles/vitrine/BecomeMember.module.scss";

function BecomeMember(props) {
  return (
    <section className={styles.container}>
      <h1 data-aos="fade-up" data-aos-offset="100" className={styles.title}>
        Devenir <span className={styles.title__stress}>membre</span>
        .<br />
        Créer <span className={styles.title__stress}>Votre shop</span>{" "}
        maintenant.
      </h1>
      <Link href={"/register"}>
        <Button
          data-aos="fade-up"
          data-aos-offset="100"
          style={{
            backgroundColor: "black",
            color: "white",
            textTransform: "capitalize",
          }}
          variant="contained"
        >
          Devenir Membre
        </Button>
      </Link>
    </section>
  );
}

export default BecomeMember;
