import { IconButton, Skeleton } from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminActions, ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import XAutoComplete from "../../components/ui-components/XAutoComplete";
import XModal from "../../components/ui-components/XModal";
import XPagination from "../../components/ui-components/XPagination";
import styles from "../../styles/admin/Dashboard.module.scss";
import { compressImage, getThumbnail } from "../../utils/config/convertHelper";
import { getError } from "../../utils/shared/getError";
import {
  AddIcon,
  ChangeCircleIcon,
  DeleteIcon,
  ModeEditIcon,
  SearchIcon,
} from "../../utils/theme/icons";

function Inventory(props) {
  let executeSearchTimeout;

  const { userInfo } = useSelector((state) => state.auth);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [action, setAction] = useState("");
  const [images, setImages] = useState([]);

  const [product, setProduct] = useState({
    category: "",
    designation: "",
    description: "",
    price: 0,
    discount: 0,
    qty: 0,
    images: [],
  });

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    getCategories();
    getProducts();
  }, [page, searchTerm]);

  const getProducts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("/api/admin/products/get", {
        shop: userInfo.shop._id,
        page: page + 1,
        searchTerm: searchTerm,
      });
      setProducts(data.products);
      setCount(data.count);
      setLoading(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoading(false);
    }
  };

  const getCategories = async () => {
    setLoadingCategories(true);
    try {
      const { data } = await axios.post("/api/admin/categories/get", {
        shop: userInfo.shop._id,
      });
      setCategories(data);
      data.length && setProduct({ ...product, category: data[0]._id });
      setLoadingCategories(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoadingCategories(false);
    }
  };

  const onChange = async (e) => {
    if (e.target.name === "images") {
      let compressedImages = [];
      let imagesToUpload = [];

      const files = e.target.files;

      for (let image of files) {
        const base64 = await getThumbnail(image);
        const compressedImage = await compressImage(image);
        if (compressedImages.length < 3) {
          compressedImages.push(base64);
          imagesToUpload.push(compressedImage);
        } else {
          enqueueSnackbar("can't exceed 3 images per product.", {
            variant: "warning",
          });
        }
      }

      setImages(imagesToUpload);

      setProduct({
        ...product,
        images: compressedImages,
      });
    } else {
      setProduct({ ...product, [e.target.name]: e.target.value });
    }
  };

  const handleProduct = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    let result = null;

    let formData = new FormData();

    for (let image of images) {
      formData.append("images", image);
    }

    try {
      switch (action) {
        case AdminActions.ADD:
          const { data } = await axios.post("/api/upload", formData, {
            headers: { "content-type": "multipart/form-data" },
          });

          const uploads = [];

          for (let uploaded of data) {
            uploads.push("/uploads/" + uploaded.filename);
          }

          result = await axios.post("/api/admin/products/add", {
            shop: userInfo.shop._id,
            ...product,
            images: uploads,
          });

          setImages([]);
          break;
        case AdminActions.UPDATE:
          if (images.length) {
            const { data } = await axios.post("/api/upload", formData, {
              headers: { "content-type": "multipart/form-data" },
            });

            const uploads = [];

            for (let uploaded of data) {
              uploads.push("/uploads/" + uploaded.filename);
            }

            result = await axios.put("/api/admin/products/update", {
              ...product,
              images: uploads,
            });
          } else {
            result = await axios.put("/api/admin/products/update", {
              _id: product._id,
              category: product.category,
              designation: product.designation,
              description: product.description,
              price: product.price,
              discount: product.discount,
              qty: product.qty,
            });
          }
          setImages([]);
          break;
        case AdminActions.DELETE:
          result = await axios.delete(
            `/api/admin/products/delete/${product._id}`
          );
          setImages([]);
          break;
        default:
          break;
      }
      enqueueSnackbar(result.data.message, { variant: "success" });
      setModalLoading(false);
      cancelAction();
      getProducts();
    } catch (error) {
      setModalLoading(false);
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const cancelAction = () => {
    setProduct({
      category: "",
      designation: "",
      description: "",
      price: 0,
      discount: 0,
      qty: 0,
      images: [],
    });
    setAction("");
  };

  const onPaginationChange = (e, page) => {
    setPage(page - 1);
  };

  const onSearchTermChange = (e) => {
    clearTimeout(executeSearchTimeout);
    executeSearchTimeout = setTimeout(() => {
      setSearchTerm(e.target.value);
    }, 600);
  };

  return (
    <AdminLayout>
      <DisconnectedGuard>
        <XModal
          loading={modalLoading}
          open={action !== ""}
          onClose={cancelAction}
          confirmAction={action === AdminActions.DELETE ? handleProduct : null}
          formId={"product_category_form"}
          cancelAction={cancelAction}
          size={
            action === AdminActions.DELETE
              ? ModalSizes.SMALL
              : ModalSizes.MEDIUM
          }
          title={
            action === AdminActions.ADD
              ? "add product"
              : action === AdminActions.UPDATE
              ? "update product"
              : action === AdminActions.DELETE
              ? "delete product"
              : null
          }
        >
          {action === AdminActions.DELETE ? (
            <>
              <p>deleting &quot;{product.designation}&quot;.</p>
              <p>are you sure ?</p>
            </>
          ) : (
            <form id="product_category_form" onSubmit={handleProduct}>
              <div className="labeledInput">
                <label>category</label>
                <XAutoComplete
                  options={categories}
                  optionDisplayExpr={"name"}
                  optionValueExpr={"_id"}
                  attributeKey={"category"}
                  value={product.category}
                  formData={product}
                  setFormData={setProduct}
                  required={true}
                />
              </div>
              <div className="labeledInput">
                <label>designation</label>
                <input
                  className="defaultInput"
                  type="text"
                  required
                  name="designation"
                  onChange={onChange}
                  value={product.designation}
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
                  value={product.description}
                />
              </div>
              <div className="labeledInput">
                <label>images</label>
                <div className={styles.productImagesContainer}>
                  {product.images.map((image, index) => {
                    return (
                      <div key={index} className={styles.productImgPreview}>
                        <img
                          alt={index}
                          src={`/api/images/${image.split("/").pop()}`}
                          onError={(e) => {
                            e.target.src = image;
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
                <input
                  id="images"
                  hidden
                  type="file"
                  accept="image/*"
                  multiple
                  name="images"
                  onChange={onChange}
                />
                <IconButton color="success">
                  <label
                    style={{
                      cursor: "pointer",
                      width: "25px",
                      height: "25px",
                    }}
                    htmlFor="images"
                  >
                    {product.images.length ? <ChangeCircleIcon /> : <AddIcon />}
                  </label>
                </IconButton>
              </div>
              <div className="labeledInput">
                <label>price</label>
                <input
                  className="defaultInput"
                  type="number"
                  required
                  name="price"
                  min={0}
                  onChange={onChange}
                  value={product.price}
                />
              </div>
              <div className="labeledInput">
                <label>discount (%)</label>
                <input
                  className="defaultInput"
                  type="number"
                  min={0}
                  name="discount"
                  onChange={onChange}
                  value={product.discount}
                />
              </div>
              <div className="labeledInput">
                <label>quantity</label>
                <input
                  className="defaultInput"
                  type="number"
                  required
                  name="qty"
                  onChange={onChange}
                  value={product.qty}
                />
              </div>
            </form>
          )}
        </XModal>
        <section className={styles.container}>
          <div className={styles.controls}>
            <h1>Inventory</h1>
            <div className="row">
              <SearchIcon color="secondary" style={{ marginRight: "-30px" }} />
              <input
                style={{ paddingLeft: "30px" }}
                className="defaultInput"
                placeholder="Designation..."
                onChange={onSearchTermChange}
              />
            </div>
          </div>
          <div className={styles.controls}>
            <XPagination
              color="secondary"
              page={page}
              count={count}
              onChange={onPaginationChange}
            />
            <div className="row" style={{ justifyContent: "flex-end" }}>
              {loadingCategories
                ? null
                : !categories.length && (
                    <p>create categories to start adding products !</p>
                  )}
              <IconButton
                color="secondary"
                onClick={() => {
                  setAction(AdminActions.ADD);
                  setProduct({ ...product, category: categories[0]._id });
                }}
                icon="add"
                disabled={!categories.length}
              >
                <AddIcon />
              </IconButton>
            </div>
          </div>
          {loading ? (
            <Skeleton
              variant="rectangular"
              width={"100%"}
              height={"calc(100vh - 200px)"}
            />
          ) : (
            <section className="adminTableContainer">
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
                      <tr
                        className={
                          product.qty < 5
                            ? styles.error
                            : product.qty < 10
                            ? styles.warning
                            : null
                        }
                        key={product._id}
                      >
                        <td>{product.designation}</td>
                        <td>{product.description}</td>
                        <td>{product.price.toLocaleString() + " DT"}</td>
                        <td>{product.qty}</td>
                        <td>
                          <div className="centered-row">
                            <IconButton
                              color="warning"
                              onClick={() => {
                                setAction(AdminActions.UPDATE);
                                setProduct(product);
                              }}
                            >
                              <ModeEditIcon sx={{ width: "20px" }} />
                            </IconButton>
                            <IconButton
                              color="error"
                              onClick={() => {
                                setAction(AdminActions.DELETE);
                                setProduct(product);
                              }}
                            >
                              <DeleteIcon sx={{ width: "20px" }} />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Inventory;
