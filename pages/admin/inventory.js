import AddIcon from "@mui/icons-material/Add";
import { IconButton, Skeleton } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import Modal from "../../components/admin/Modal";
import { AdminActions, ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import styles from "../../styles/admin/Dashboard.module.scss";
import { getError } from "../../utils/shared/getError";

function Inventory(props) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const getProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/products/get");
      setProducts(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <AdminLayout>
      <DisconnectedGuard>
        <Modal
          open={action !== ""}
          onClose={() => setAction("")}
          size={ModalSizes.BIG}
          title={"add product"}
        >
          <form>
            <div className="labeledInput">
              <label>designation</label>
              <input className="defaultInput" type="text" required />
            </div>
            <div className="labeledInput">
              <label>description</label>
              <input className="defaultInput" type="text" required />
            </div>
            <div className="labeledInput">
              <label>price</label>
              <input className="defaultInput" type="text" required />
            </div>
            <div className="labeledInput">
              <label>quantity</label>
              <input className="defaultInput" type="text" required />
            </div>
          </form>
        </Modal>
        <section className={styles.container}>
          <div className={styles.controls}>
            <IconButton onClick={() => setAction(AdminActions.ADD)} icon="add">
              <AddIcon color="black" />
            </IconButton>
          </div>
          {loading ? (
            <Skeleton variant="rectangular" width={"100%"} height={"50vh"} />
          ) : (
            <table className="defaultTable">
              <thead>
                <tr>
                  <th>designation</th>
                  <th>description</th>
                  <th>price</th>
                  <th>quantity</th>
                  <th>actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  return (
                    <tr key={product._id}>
                      <td>{product.designation}</td>
                      <td>{product.description}</td>
                      <td>{product.price}</td>
                      <td>{product.qty}</td>
                      <td>
                        <IconButton></IconButton>
                        <IconButton></IconButton>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Inventory;
