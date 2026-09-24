import { Language } from "@mui/icons-material";
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
import { SITE_URL } from "../../utils/config/site";
import { getError } from "../../utils/shared/getError";

function DomainName(props) {
  const { userInfo } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");
  const [domainName, setDomainName] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const isPremium = userInfo?.shop.pack.type !== "FREE";
  const hasCustomDomain = !!userInfo?.shop?.domainName?.length;

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
                value={domainName}
                onChange={(e) => setDomainName(e.target.value.toLowerCase())}
              />
            </div>
            <p className={styles.dnsHint}>
              After changing the domain name, add this record to your DNS
              settings:
            </p>
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
                  <td style={{ textTransform: "lowercase" }}>
                    {domainName.length ? domainName : "example.com"}
                  </td>
                  <td>0</td>
                  <td>A</td>
                  <td>213.186.33.5</td>
                </tr>
              </tbody>
            </table>
          </form>
        </XModal>
        <section className={styles.container}>
          <div className={styles.controls}>
            <h1>Domain name</h1>
          </div>

          <div className={styles.domainCard}>
            <div className={styles.domainIcon}>
              <Language />
            </div>

            {!isPremium ? (
              <>
                <p className={styles.domainStatus}>
                  Custom domain names are a premium feature
                </p>
                <p className={styles.domainSub}>
                  Upgrade to premium to connect your own domain name to your
                  shop.
                </p>
                <Link href="/admin/account" className="btn btn-primary">
                  Upgrade to premium
                </Link>
              </>
            ) : (
              <>
                <p className={styles.domainStatus}>
                  {hasCustomDomain ? userInfo.shop.domainName : "No custom domain connected yet"}
                </p>
                <p className={styles.domainSub}>
                  {hasCustomDomain ? (
                    <span className={styles.connectedPill}>Connected</span>
                  ) : (
                    <>Your shop is available at {SITE_URL}/{userInfo?.shop.name}</>
                  )}
                </p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setAction("UPDATE")}
                >
                  {hasCustomDomain ? "Change the domain name" : "Connect a domain name"}
                </button>
              </>
            )}
          </div>
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default DomainName;
