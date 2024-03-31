import { Edit } from "@mui/icons-material";
import { CircularProgress, IconButton, Skeleton, Tooltip } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
import { checkExpirity } from "../../utils/shared/checkExpirity";
import { checkPremium } from "../../utils/shared/checkPremium";
import { getError } from "../../utils/shared/getError";
import { AddIcon, DeleteIcon, ModeEditIcon } from "../../utils/theme/icons";

function Categories() {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [action, setAction] = useState("");
  const [images, setImages] = useState("");
  const [imagesLoading, setImagesLoading] = useState(false);

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
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const onChange = async (e) => {
    if (e.target.name === "icon") {
      setImagesLoading(true);
      let icon = e.target.files[0];
      setImages(await compressImage(icon));
      const base64 = await getThumbnail(icon);
      icon = base64;
      setCategory({
        ...category,
        icon: icon,
      });
      setImagesLoading(false);
    } else {
      setCategory({ ...category, [e.target.name]: e.target.value });
      setImagesLoading(false);
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
            return enqueueSnackbar("l'image de la catégorie est requise", {
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
      checkExpirity(error, dispatch);
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
              ? "ajouter catégorie"
              : action === AdminActions.UPDATE
              ? "modifier catégorie"
              : action === AdminActions.DELETE
              ? "supprimer catégorie"
              : null
          }
        >
          {action === AdminActions.DELETE ? (
            <>
              <p>
                si vous supprimez la catégorie &quot;{category.name}&quot; ,
                tous les les produits en dessous seront supprimés.
              </p>
              <p>êtes-vous sûr ?</p>
            </>
          ) : (
            <form id="product_category_form" onSubmit={handleCategory}>
              <div className="labeledInput">
                <label>nom</label>
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
                <label>icon (résolution recommandée (250px * 250px))</label>
                <br />
                {imagesLoading ? (
                  <CircularProgress color="black" size={30} />
                ) : (
                  category.icon !== "" && (
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
                  )
                )}
                <input
                  id="icon"
                  hidden
                  type="file"
                  accept="image/*"
                  name="icon"
                  onChange={onChange}
                />
                <Tooltip
                  title={
                    category.icon.length ? "Modifier Image" : "Ajouter Image"
                  }
                >
                  <IconButton
                    color={category.icon.length ? "warning" : "secondary"}
                  >
                    <label
                      style={{
                        cursor: "pointer",
                        width: "25px",
                        height: "25px",
                      }}
                      htmlFor="icon"
                    >
                      {!imagesLoading ? (
                        category.icon.length ? (
                          <Edit />
                        ) : (
                          <AddIcon />
                        )
                      ) : null}
                    </label>
                  </IconButton>
                </Tooltip>
              </div>
            </form>
          )}
        </XModal>
        <section className={styles.container}>
          <h1>Catégories</h1>
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
                      <Tooltip title="Modifier">
                        <IconButton
                          color="warning"
                          onClick={() => {
                            setAction(AdminActions.UPDATE);
                            setCategory(category);
                          }}
                        >
                          <ModeEditIcon sx={{ width: "20px" }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Supprimer">
                        <IconButton
                          color="error"
                          onClick={() => {
                            setAction(AdminActions.DELETE);
                            setCategory(category);
                          }}
                        >
                          <DeleteIcon sx={{ width: "20px" }} />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
              <div className="card" key={category._id}>
                <IconButton
                  color="secondary"
                  sx={{ width: "40px", height: "40px" }}
                  onClick={() => {
                    if (userInfo) {
                      checkPremium(
                        userInfo,
                        categories.length >= 5,
                        () => {
                          setAction(AdminActions.ADD);
                        },
                        enqueueSnackbar
                      )();
                    }
                  }}
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
