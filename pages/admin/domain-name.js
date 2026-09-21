import { Button } from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import XModal from "../../components/ui-components/XModal";
import styles from "../../styles/admin/Dashboard.module.scss";
import { getError } from "../../utils/shared/getError";

function DomainName(props) {
  const { userInfo } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");
  const [domainName, setDomainName] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const updateDomainName = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/shop/update-domain-name", {
        shopId: userInfo.shop._id,
        domainName: domainName,
      });
      setLoading(false);
      cancelAction();
      enqueueSnackbar(data.message, { variant: "info" });
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const cancelAction = () => {
    setDomainName("");
    setAction("");
  };

  return (
    <AdminLayout>
      <DisconnectedGuard>
        <XModal
          loading={loading}
          open={action !== ""}
          onClose={cancelAction}
          formId={"domain_name_form"}
          cancelAction={cancelAction}
          size={ModalSizes.SMALL}
          title="Edit your domain name"
        >
          <form id="domain_name_form" onSubmit={updateDomainName}>
            <div className="labeledInput">
              <label>
                New domain name without http:// and without www (example:
                domain.com)
              </label>
              <input
                type="text"
                className="defaultInput"
                required
                onChange={(e) => setDomainName(e.target.value)}
              />
              <p>
                After changing the domain name, add this information
                to your DNS settings:
              </p>
              <br />
              <table className="fixedTable">
                <thead>
                  <tr>
                    <th>domain</th>
                    <th>ttl</th>
                    <th>type</th>
                    <th>target</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{domainName.length ? domainName : "example.com"}</td>
                    <td>0</td>
                    <td>A</td>
                    <td>76.76.21.21</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>
        </XModal>
        <section className={styles.container}>
          <div className={styles.controls} style={{ justifyContent: "center" }}>
            <h1>Domain name</h1>
          </div>
          {userInfo?.shop.pack.type === "FREE" ? (
            <>
              <p>
                you must be on the PREMIUM pack to benefit from a custom
                domain name!
              </p>
              <Link
                style={{ color: "blue", textDecoration: "underline" }}
                href={"/admin/account"}
              >
                Upgrade to PREMIUM now!
              </Link>
            </>
          ) : (
            <section align="center">
              <p style={{ textTransform: "unset", fontWeight: "500" }}>
                {userInfo?.shop?.domainName.length
                  ? "Domain name: " + userInfo?.shop?.domainName
                  : "Your shop is now available at: https://cyber-mall.tn/" +
                    userInfo?.shop.name}
              </p>
              <br />

              <Button
                variant="contained"
                style={{
                  background: "black",
                  color: "white",
                  height: "35px",
                }}
                onClick={() => setAction("UPDATE")}
              >
                Change the domain name
              </Button>
            </section>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default DomainName;
