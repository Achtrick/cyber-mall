import React, { useEffect, useState } from "react";
import Layout from "../components/vitrine/Layout";
import styles from "../styles/vitrine/RegisterShop.module.scss";
import { Button, CircularProgress } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { getError } from "../utils/shared/getError";
import { useDispatch } from "react-redux";
import ConnectedGuard from "../components/guards/connectedGuard";

function RegisterShop(props) {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    shopName: "",
  });

  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const register = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (formData.password !== formData.confirmPassword) {
      setLoading(false);
      return enqueueSnackbar("passwords doesn't match", { variant: "warning" });
    }
    try {
      const { data } = await axios.post("api/auth/register-admin", formData);
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
            <h1>create your shop</h1>
            <form id="form" onSubmit={register}>
              <input
                className="defaultInput"
                required
                onChange={onChange}
                type="text"
                name="firstName"
                placeholder="first name"
              ></input>
              <input
                className="defaultInput"
                required
                onChange={onChange}
                type="text"
                name="lastName"
                placeholder="last name"
              ></input>
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
              <input
                className="defaultInput"
                required
                onChange={onChange}
                type="password"
                name="confirmPassword"
                placeholder="confirm password"
              ></input>
              <input
                className="defaultInput"
                required
                onChange={onChange}
                type="text"
                name="shopName"
                placeholder="shop name"
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
                  "register"
                )}
              </Button>
            </form>
          </section>
        </section>
      </Layout>
    </ConnectedGuard>
  );
}

export default RegisterShop;
