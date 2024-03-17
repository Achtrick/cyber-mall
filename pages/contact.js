import React, { useState } from "react";
import ConnectedGuard from "../components/guards/connectedGuard";
import Layout from "../components/vitrine/Layout";
import styles from "../styles/vitrine/Contact.module.scss";
import Link from "next/link";
import { Button, CircularProgress } from "@mui/material";
import { getError } from "../utils/shared/getError";
import { useSnackbar } from "notistack";
import axios from "axios";

function Contact(props) {
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const { message, email, subject, phone } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendMail = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/contact", formData);
      enqueueSnackbar(data.message, { variant: "success" });
      setLoading(false);
      setFormData({
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

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
          <form id="email" onSubmit={sendMail}>
            <div className="labeledInput">
              <label>email</label>
              <input
                onChange={onChange}
                value={email}
                className="defaultInput"
                type="email"
                name="email"
                required
              />
            </div>
            <div className="labeledInput">
              <label>phone</label>
              <input
                onChange={onChange}
                value={phone}
                className="defaultInput"
                type="tel"
                name="phone"
                required
              />
            </div>
            <div className="labeledInput">
              <label>subject</label>

              <input
                onChange={onChange}
                value={subject}
                className="defaultInput"
                type="text"
                name="subject"
                required
              />
            </div>
            <div className="labeledInput">
              <label>message</label>
              <textarea
                style={{ height: "105px" }}
                onChange={onChange}
                value={message}
                className="defaultInput"
                name="message"
                required
              />
            </div>
            <Button
              type="submit"
              form="email"
              style={{
                backgroundColor: "black",
                color: "white",
                textTransform: "capitalize",
                width: "100px",
              }}
              variant="contained"
            >
              {loading ? <CircularProgress color="white" size={25} /> : "Send"}
            </Button>
          </form>
        </section>
      </Layout>
    </ConnectedGuard>
  );
}

export default Contact;
