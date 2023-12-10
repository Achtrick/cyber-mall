import { IconButton, Skeleton } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminActions, ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import styles from "../../styles/admin/Dashboard.module.scss";
import { getError } from "../../utils/shared/getError";
import { AddIcon, CloseIcon } from "../../utils/theme/icons";
import { compressImage } from "../../utils/config/convertHelper";
import XModal from "../../components/ui-components/XModal";
import { useSelector } from "react-redux";

function categories() {
  const { userInfo } = useSelector((state) => state.auth);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [action, setAction] = useState("");

  const [category, setCategory] = useState({
    name: "",
    description: "",
    icon: "",
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!categories.length) {
      getCategories();
    }
  }, []);

  const getCategories = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/categories/get", {
        shop: userInfo.shop._id,
      });
      setCategories(data);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const onChange = async (e) => {
    if (e.target.name === "icon") {
      let icon = e.target.files[0];
      const base64 = await compressImage(icon);
      icon = base64;
      setCategory({
        ...category,
        icon: icon,
      });
    } else {
      setCategory({ ...category, [e.target.name]: e.target.value });
    }
  };

  const deleteBackground = () => {
    setCategory({
      ...category,
      icon: "",
    });
  };

  const addCategory = async (e) => {
    e.preventDefault();
    console.log(category);
    setModalLoading(true);
    try {
      const { data } = await axios.post("/api/admin/categories/add", {
        shop: userInfo.shop._id,
        ...category,
      });
      enqueueSnackbar(data.message, { variant: "success" });
      setModalLoading(false);
      cancelAction();
      getCategories();
    } catch (error) {
      setModalLoading(false);
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const cancelAction = () => {
    setCategory({
      name: "",
      description: "",
      icon: "",
    });
    setAction("");
  };

  return (
    <AdminLayout>
      <DisconnectedGuard>
        <XModal
          loading={modalLoading}
          open={action !== ""}
          onClose={() => setAction("")}
          formId={"add_product_category"}
          cancelAction={cancelAction}
          size={ModalSizes.MEDIUM}
          title={"add category"}
        >
          <form id="add_product_category" onSubmit={addCategory}>
            <div className="labeledInput">
              <label>name</label>
              <input
                value={category.name}
                className="defaultInput"
                type="text"
                required
                name="name"
                onChange={onChange}
              />
            </div>
            <div className="labeledInput">
              <label>description</label>
              <textarea
                value={category.description}
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
              <label>icon</label>
              {category.icon !== "" && (
                <div className={styles.imagesContainer}>
                  <div className={styles.imgPreview}>
                    <div className={styles.closeIcon}>
                      <IconButton
                        style={{ width: "30px", height: "30px" }}
                        onClick={() => deleteBackground()}
                      >
                        <CloseIcon />
                      </IconButton>
                    </div>
                    <img alt={category.name} src={category.icon} />
                  </div>
                </div>
              )}
              <input
                id="icon"
                hidden
                type="file"
                accept="image/*"
                name="icon"
                max="3"
                onChange={onChange}
              />
              <IconButton>
                <label
                  style={{ cursor: "pointer", width: "25px", height: "25px" }}
                  htmlFor="icon"
                >
                  <AddIcon></AddIcon>
                </label>
              </IconButton>
            </div>
          </form>
        </XModal>
        <section className={styles.container}>
          <h1>Categories</h1>
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
                  <th>name</th>
                  <th>description</th>
                  <th>actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => {
                  return (
                    <tr key={category._id}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
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

export default categories;
