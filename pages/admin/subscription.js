import { Skeleton } from "@mui/material";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminActions, ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import XModal from "../../components/ui-components/XModal";
import styles from "../../styles/admin/Dashboard.module.scss";

function Subscription(props) {
  const { userInfo } = useSelector((state) => state.auth);
  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  return (
    <AdminLayout>
      <DisconnectedGuard>
        <section className={styles.container}>
          <div className={styles.controls}>
            <h1>Subscription</h1>
          </div>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"calc(100vh - 200px)"}
            />
          ) : (
            <section></section>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Subscription;
