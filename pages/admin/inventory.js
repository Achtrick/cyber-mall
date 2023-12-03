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
import { AddIcon, CloseIcon } from "../../utils/theme/icons";
import { compressImage } from "../../utils/config/convertHelper";

function Inventory(props) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState("");

  const [product, setProduct] = useState({
    designation: "",
    description: "",
    price: "",
    qty: "",
    images: [],
  });

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

  const onChange = async (e) => {
    if (e.target.name === "images") {
      let compressedImages = [];
      const images = e.target.files;
      for (let image of images) {
        const base64 = await compressImage(image);
        compressedImages.push(base64);
      }
      setProduct({
        ...product,
        images: [...product.images, ...compressedImages],
      });
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const deleteImage = (imageToDelete) => {
    setProduct({
      ...product,
      images: product.images.filter((image) => image !== imageToDelete),
    });
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
          size={ModalSizes.MEDIUM}
          title={"add product"}
        >
          <form>
            <div className="labeledInput">
              <label>designation</label>
              <input
                className="defaultInput"
                type="text"
                required
                name="designation"
                onChange={onChange}
              />
            </div>
            <div className="labeledInput">
              <label>description</label>
              <textarea
                rows={3}
                style={{ height: "70px" }}
                className="defaultInput"
                type="text"
                required
                name="description"
                onChange={onChange}
              />
            </div>
            <div className="labeledInput">
              <label>images</label>
              {product.images.map((image, index) => {
                return (
                  <div key={index} className={styles.imgPreview}>
                    <div className={styles.closeIcon}>
                      <IconButton onClick={() => deleteImage(image)}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                    <img alt={index} src={image} />
                  </div>
                );
              })}
              <input
                id="images"
                hidden
                type="file"
                accept="image/*"
                multiple
                name="images"
                max="3"
                onChange={onChange}
              />
              <IconButton>
                <label
                  style={{ cursor: "pointer", width: "25px", height: "25px" }}
                  htmlFor="images"
                >
                  <AddIcon></AddIcon>
                </label>
              </IconButton>
            </div>
            <div className="labeledInput">
              <label>price</label>
              <input
                className="defaultInput"
                type="text"
                required
                name="price"
                onChange={onChange}
              />
            </div>
            <div className="labeledInput">
              <label>quantity</label>
              <input
                className="defaultInput"
                type="text"
                required
                name="qty"
                onChange={onChange}
              />
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
