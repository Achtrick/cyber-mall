import {
  CircularProgress,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import EmptyState from "../../components/ui-components/EmptyState";
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
import { uploadImages } from "../../utils/shared/uploadImages";

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

  const isMobile = useMediaQuery("(max-width:800px)");

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
      expandTextArea(e);
      setCategory({ ...category, [e.target.name]: e.target.value });
      setImagesLoading(false);
    }
  };

  const expandTextArea = (e) => {
    if (e.target.name === "description") {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const handleCategory = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    let result = null;

    try {
      switch (action) {
        case AdminActions.ADD:
          if (images === "") {
            setModalLoading(false);
            return enqueueSnackbar("the category image is required", {
              variant: "error",
            });
          }
          const data = await uploadImages([images]);

          result = await axios.post("/api/admin/categories/add", {
            shop: userInfo.shop._id,
            ...category,
            icon: "/uploads/" + data[0].filename,
          });
          setImages("");
          break;
        case AdminActions.UPDATE:
          if (images !== "") {
            const data = await uploadImages([images]);
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
          result = await axios.post(`/api/admin/categories/delete`, {
            categoryId: category._id,
          });
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
              : isMobile
              ? ModalSizes.BIG
              : ModalSizes.MEDIUM
          }
          title={
            action === AdminActions.ADD
              ? "add category"
              : action === AdminActions.UPDATE
              ? "edit category"
              : action === AdminActions.DELETE
              ? "delete category"
              : null
          }
        >
          {action === AdminActions.DELETE ? (
            <>
              <p>
                if you delete the category &quot;{category.name}&quot; ,
                all the products under it will be deleted.
              </p>
              <p>are you sure?</p>
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
                  className="defaultInput"
                  type="text"
                  name="description"
                  onChange={onChange}
                  onClick={expandTextArea}
                />
              </div>
              <div className="labeledInput">
                <label>icon (recommended resolution (250px * 250px))</label>
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
                <label
                  className="btn btn-sm"
                  style={{ marginTop: "8px" }}
                  htmlFor="icon"
                >
                  {imagesLoading
                    ? "Uploading..."
                    : category.icon.length
                    ? "Change image"
                    : "Add image"}
                </label>
              </div>
            </form>
          )}
        </XModal>
        <section className={styles.container}>
          <h1>Categories</h1>
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
                    <div className="btn-group">
                      <button
                        className="btn btn-sm"
                        onClick={() => {
                          setAction(AdminActions.UPDATE);
                          setCategory(category);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => {
                          setAction(AdminActions.DELETE);
                          setCategory(category);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
              <div className="card" key={category._id}>
                <button
                  className="btn btn-primary"
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
                >
                  + Add category
                </button>
              </div>
            </div>
          )}
          {!loading && !categories.length ? (
            <EmptyState
              art="box"
              title="No categories yet"
              text="Use the + button to create your first category."
            />
          ) : null}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Categories;
