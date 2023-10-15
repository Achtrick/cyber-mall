import React, { useEffect, useState } from "react";
import Layout from "../components/vitrine/Layout";
import styles from "../styles/vitrine/RegisterShop.module.scss";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { getError } from "../utils/shared/getError";
import { useDispatch } from "react-redux";
import ConnectedGuard from "../components/guards/connectedGuard";

function LoginShop(props) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("api/auth/login", formData);
      dispatch({ type: "USER_LOGIN", payload: data });
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  return (
    <ConnectedGuard>
      <Layout>
        <section className={styles.container}>
          <section className={styles.form}>
            <h1>login</h1>
            <form id="form" onSubmit={login}>
              <input
                className="defaultInput"
                required
                onChange={onChange}
                type="email"
                name="email"
                placeholder="email"
              ></input>
              <input
                className="defaultInput"
                required
                onChange={onChange}
                type="password"
                name="password"
                placeholder="password"
              ></input>
              <br />
              <Button
                type="submit"
                form="form"
                style={{
                  background: "black",
                  color: "white",
                  height: "35px",
                  width: "100px",
                }}
                variant="contained"
              >
                {loading ? (
                  <CircularProgress style={{ color: "white" }} size={20} />
                ) : (
                  "login"
                )}
              </Button>
            </form>
          </section>
        </section>
      </Layout>
    </ConnectedGuard>
  );
}

export default LoginShop;
