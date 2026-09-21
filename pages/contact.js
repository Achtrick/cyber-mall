import { CircularProgress } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import ConnectedGuard from "../components/guards/connectedGuard";
import Layout from "../components/vitrine/Layout";
import styles from "../styles/vitrine/Contact.module.scss";
import { getError } from "../utils/shared/getError";

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
      <Layout
        title={"Contact"}
        description={"Contact us and we will answer your questions."}
        image={"/images/contact.svg"}
      >
        <section className={styles.container}>
          <div className={styles.card}>
            <aside className={styles.aside}>
              <h1 data-aos="fade-up" data-aos-offset="100">
                Get in touch with us
              </h1>
              <p data-aos="fade-up" data-aos-offset="100" data-aos-delay="150">
                We would be happy to answer your questions and hear your
                suggestions!
              </p>
              <img
                data-aos="fade-up"
                data-aos-offset="100"
                data-aos-delay="300"
                alt="Contact Cyber-Mall"
                src="/images/contact.svg"
              />
            </aside>
            <form id="email" className={styles.form} onSubmit={sendMail}>
              <div className={styles.grid}>
                <div className="labeledInput">
                  <label>email</label>
                  <input
                    onChange={onChange}
                    value={email}
                    className="defaultInput"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
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
                    placeholder="Your phone number"
                    required
                  />
                </div>
              </div>
              <div className="labeledInput">
                <label>subject</label>
                <input
                  onChange={onChange}
                  value={subject}
                  className="defaultInput"
                  type="text"
                  name="subject"
                  placeholder="How can we help?"
                  required
                />
              </div>
              <div className="labeledInput">
                <label>message</label>
                <textarea
                  onChange={onChange}
                  value={message}
                  className="defaultInput"
                  name="message"
                  placeholder="Tell us a bit more..."
                  required
                />
              </div>
              <button
                type="submit"
                form="email"
                className="btn btn-primary"
                style={{ minWidth: "140px", minHeight: "42px" }}
                disabled={loading}
              >
                {loading ? <CircularProgress color="inherit" size={20} /> : "Send message"}
              </button>
            </form>
          </div>
        </section>
      </Layout>
    </ConnectedGuard>
  );
}

export default Contact;
