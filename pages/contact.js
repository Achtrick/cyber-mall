import React from "react";
import ConnectedGuard from "../components/guards/connectedGuard";
import Layout from "../components/vitrine/Layout";
import styles from "../styles/vitrine/Contact.module.scss";
import Link from "next/link";
import { Button } from "@mui/material";

function Contact(props) {
  return (
    <ConnectedGuard>
      <Layout>
        <section className={styles.container}>
          <p>Get in touch with us </p>
          <p>
            we would love to answer your questions and hear your suggestions !
          </p>
          <hr />
          <br />
          <form>
            <div className="labeledInput">
              <label>email</label>
              <input className="defaultInput" type="email" name="email" />
            </div>
            <div className="labeledInput">
              <label>phone</label>
              <input className="defaultInput" type="tel" name="phone" />
            </div>
            <div className="labeledInput">
              <label>subject</label>

              <input className="defaultInput" type="text" name="subject" />
            </div>
            <div className="labeledInput">
              <label>message</label>
              <textarea
                style={{ height: "105px" }}
                className="defaultInput"
                name="message"
              />
            </div>
            <Button
              style={{
                backgroundColor: "black",
                color: "white",
                textTransform: "capitalize",
              }}
              variant="contained"
            >
              Send
            </Button>
          </form>
        </section>
      </Layout>
    </ConnectedGuard>
  );
}

export default Contact;
