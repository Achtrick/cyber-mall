import { IconButton, Skeleton } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminActions, ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import XModal from "../../components/ui-components/XModal";
import styles from "../../styles/admin/Dashboard.module.scss";
import {
  compressImage,
  getThumbnail,
  isBase64,
} from "../../utils/config/convertHelper";
import { getError } from "../../utils/shared/getError";
import {
  AddIcon,
  CategoryIcon,
  DeleteIcon,
  ModeEditIcon,
} from "../../utils/theme/icons";

function Categories() {
  const { userInfo } = useSelector((state) => state.auth);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [action, setAction] = useState("");
  const [images, setImages] = useState("");

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
      setImages(await compressImage(icon));
      const base64 = await getThumbnail(icon);
      icon = base64;
      setCategory({
        ...category,
        icon: icon,
      });
    } else {
      setCategory({ ...category, [e.target.name]: e.target.value });
    }
  };

  const handleCategory = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    let result = null;

    let formData = new FormData();
    formData.append("images", images);

    try {
      switch (action) {
        case AdminActions.ADD:
          if (images === "") {
            setModalLoading(false);
            return enqueueSnackbar("category image is required", {
              variant: "error",
            });
          }
          const { data } = await axios.post("/api/upload", formData, {
            headers: { "content-type": "multipart/form-data" },
          });

          result = await axios.post("/api/admin/categories/add", {
            shop: userInfo.shop._id,
            ...category,
            icon: "/uploads/" + data[0].filename,
          });
          setImages("");
          break;
        case AdminActions.UPDATE:
          if (images !== "") {
            const { data } = await axios.post("/api/upload", formData, {
              headers: { "content-type": "multipart/form-data" },
            });
            result = await axios.put("/api/admin/categories/update", {
              ...category,
              icon: "/uploads/" + data[0].filename,
            });
          } else {
            result = await axios.put("/api/admin/categories/update", {
              _id: category._id,
              name: category.name,
              description: category.description,
            });
          }
          setImages("");
          break;
        case AdminActions.DELETE:
          result = await axios.delete(
            `/api/admin/categories/delete/${category._id}`
          );
          setImages("");
          break;
        default:
          break;
      }
      enqueueSnackbar(result.data.message, { variant: "success" });
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
    setImages("");
  };

  return (
    <AdminLayout>
      <DisconnectedGuard>
        <XModal
          loading={modalLoading}
          open={action !== ""}
          onClose={cancelAction}
          confirmAction={action === AdminActions.DELETE ? handleCategory : null}
          formId={"product_category_form"}
          cancelAction={cancelAction}
          size={
            action === AdminActions.DELETE
              ? ModalSizes.SMALL
              : ModalSizes.MEDIUM
          }
          title={
            action === AdminActions.ADD
              ? "add category"
              : action === AdminActions.UPDATE
              ? "update category"
              : action === AdminActions.DELETE
              ? "delete category"
              : null
          }
        >
          {action === AdminActions.DELETE ? (
            <>
              <p>
                if you delete &quot;{category.name}&quot; category all of the
                products under it will be deleted.
              </p>
              <p>are you sure ?</p>
            </>
          ) : (
            <form id="product_category_form" onSubmit={handleCategory}>
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
                <label>icon (recommended resolution (250px * 250px))</label>
                {category.icon !== "" && (
                  <div className={styles.productImagesContainer}>
                    <div className={styles.productImgPreview}>
                      <img
                        alt={category.name}
                        src={`/api/images/${category.icon.split("/").pop()}`}
                        onError={(e) => {
                          e.target.src = isBase64(category.icon)
                            ? category.icon
                            : "/images/category.svg";
                        }}
                      />
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
          )}
        </XModal>
        <section className={styles.container}>
          <h1>Categories</h1>
          <div className={styles.controls}>{/* search */}</div>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"calc(100vh - 200px)"}
            />
          ) : (
            <div className="grid-5">
              {categories.map((category) => {
                return (
                  <div className="card" key={category._id}>
                    <img
                      className="icon"
                      alt={category.name}
                      src={`/api/images/${category.icon.split("/").pop()}`}
                      onError={(e) => {
                        e.target.src = isBase64(category.icon)
                          ? category.icon
                          : "/images/category.svg";
                      }}
                    />

                    <p>{category.name}</p>
                    <div className="centered-row">
                      <IconButton
                        color="warning"
                        onClick={() => {
                          setAction(AdminActions.UPDATE);
                          setCategory(category);
                        }}
                      >
                        <ModeEditIcon sx={{ width: "20px" }} />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setAction(AdminActions.DELETE);
                          setCategory(category);
                        }}
                      >
                        <DeleteIcon sx={{ width: "20px" }} />
                      </IconButton>
                    </div>
                  </div>
                );
              })}
              <div className="card" key={category._id}>
                <IconButton
                  color="success"
                  sx={{ width: "40px", height: "40px" }}
                  onClick={() => setAction(AdminActions.ADD)}
                  icon="add"
                >
                  <AddIcon />
                </IconButton>
              </div>
            </div>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Categories;
