import { Button, CircularProgress } from "@mui/material";
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
        description={"Nous contacter pour répondre à vos questions."}
        image={"/images/contact_animated.gif"}
      >
        <section className={styles.container}>
          <p data-aos="fade-up" data-aos-offset="100">
            Prenez contact avec nous{" "}
          </p>
          <p data-aos="fade-up" data-aos-offset="100">
            nous serions ravis de répondre à vos questions et d&apos;entendre
            vos suggestions !
          </p>
          <hr />
          <br />
          <form id="email" onSubmit={sendMail}>
            <div
              data-aos="fade-up"
              data-aos-offset="100"
              data-aos-delay="500"
              className="labeledInput"
            >
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
            <div
              data-aos="fade-up"
              data-aos-offset="100"
              data-aos-delay="700"
              className="labeledInput"
            >
              <label>téléphone</label>
              <input
                onChange={onChange}
                value={phone}
                className="defaultInput"
                type="tel"
                name="phone"
                required
              />
            </div>
            <div
              data-aos="fade-up"
              data-aos-offset="100"
              data-aos-delay="900"
              className="labeledInput"
            >
              <label>sujet</label>

              <input
                onChange={onChange}
                value={subject}
                className="defaultInput"
                type="text"
                name="subject"
                required
              />
            </div>
            <div
              data-aos="fade-up"
              data-aos-offset="100"
              data-aos-delay="1100"
              className="labeledInput"
            >
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
            <div data-aos="fade-up" data-aos-offset="100">
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
                {loading ? (
                  <CircularProgress color="white" size={25} />
                ) : (
                  "Envoyer"
                )}
              </Button>
            </div>
          </form>
        </section>
      </Layout>
    </ConnectedGuard>
  );
}

export default Contact;
