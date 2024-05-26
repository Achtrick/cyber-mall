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
          title="Modifier votre nom de domaine"
        >
          <form id="domain_name_form" onSubmit={updateDomainName}>
            <div className="labeledInput">
              <label>Nouveau Nom de domaine</label>
              <input
                type="text"
                className="defaultInput"
                required
                onChange={(e) => setDomainName(e.target.value)}
              />
              <p>
                Après modification de nom de domaine ajouter ces informations
                dans votre espace DNS:
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
                    <td>196.203.89.103</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>
        </XModal>
        <section className={styles.container}>
          <div className={styles.controls} style={{ justifyContent: "center" }}>
            <h1>Nom de domaine</h1>
          </div>
          {userInfo?.shop.pack.type === "FREE" ? (
            <>
              <p>
                vous devez etre sous pack PREMIUM pour bénéficiez de nom de
                domaine personnalisé !
              </p>
              <Link
                style={{ color: "blue", textDecoration: "underline" }}
                href={"/admin/account"}
              >
                Passer à PREMIUM maintenant !
              </Link>
            </>
          ) : (
            <section align="center">
              <p style={{ textTransform: "unset", fontWeight: "500" }}>
                {userInfo?.shop.domainName.length
                  ? "Nom de domaine: " + userInfo?.shop.domainName
                  : "Votre shop est maitenant accessible sous le lien : https://cyber-mall.tn/" +
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
                Changer le nom de domaine
              </Button>
            </section>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default DomainName;
