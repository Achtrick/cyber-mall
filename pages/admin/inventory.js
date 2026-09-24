import { CircularProgress, Skeleton, useMediaQuery } from "@mui/material";
import axios from "axios";
import EmptyState from "../../components/ui-components/EmptyState";
import { useSnackbar } from "notistack";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminActions, ModalSizes } from "../../components/admin/ModalSettings";
import DisconnectedGuard from "../../components/guards/disconnectedGuard";
import XAutoComplete from "../../components/ui-components/XAutoComplete";
import XModal from "../../components/ui-components/XModal";
import XPagination from "../../components/ui-components/XPagination";
import XTag from "../../components/ui-components/XTag";
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
import { AddIcon, SearchIcon } from "../../utils/theme/icons";

function Inventory(props) {
  let executeSearchTimeout;

  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [tag, setTag] = useState("");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [action, setAction] = useState("");
  const [images, setImages] = useState([]);

  const [product, setProduct] = useState({
    category: "",
    designation: "",
    slug: "",
    description: "",
    variants: [],
    price: 0,
    discount: 0,
    qty: 0,
    images: [],
  });

  const { enqueueSnackbar } = useSnackbar();

  const isMobile = useMediaQuery("(max-width:800px)");

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
      checkExpirity(error, dispatch);
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
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoadingCategories(false);
    }
  };

  const onChange = async (e) => {
    if (e.target.name === "images") {
      setImagesLoading(true);
      let compressedImages = [];
      let imagesToUpload = [];

      const files = e.target.files;

      for (let image of files) {
        const base64 = await getThumbnail(image);
        const compressedImage = await compressImage(image);
        if (compressedImages.length < 6) {
          compressedImages.push(base64);
          imagesToUpload.push(compressedImage);
        } else {
          enqueueSnackbar("Do not exceed 6 images per product.", {
            variant: "warning",
          });
        }
      }

      setImages(imagesToUpload);

      setProduct({
        ...product,
        images: compressedImages,
      });
      setImagesLoading(false);
    } else {
      expandTextArea(e);
      setProduct({ ...product, [e.target.name]: e.target.value });
      setImagesLoading(false);
    }
  };

  const expandTextArea = (e) => {
    if (e.target.name === "description") {
      e.target.style.height = "auto";
      e.target.style.height = `${e.target.scrollHeight}px`;
    }
  };

  const addTag = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      e.stopPropagation();
      if (!product.variants.some((x) => x === e.target.value)) {
        setProduct({
          ...product,
          variants: [...product.variants, e.target.value],
        });
        setTag("");
      }
    }
  };

  const deleteTag = (entry) => {
    setProduct({
      ...product,
      variants: [...product.variants.filter((tag) => tag !== entry)],
    });
  };

  const handleProduct = async (e) => {
    e.preventDefault();
    setModalLoading(true);
    let result = null;

    try {
      switch (action) {
        case AdminActions.ADD:
          const data = await uploadImages(images);

          const uploads = [];

          for (let uploaded of data) {
            uploads.push("/uploads/" + uploaded.filename);
          }

          product.slug =
            product.designation.split(" ").join("-") +
            "-" +
            Date.now()
              .toString()
              .slice(
                Date.now().toString().length - 5,
                Date.now().toString().length
              );

          result = await axios.post("/api/admin/products/add", {
            shop: userInfo.shop._id,
            ...product,
            images: uploads,
          });

          setImages([]);
          break;
        case AdminActions.UPDATE:
          if (images.length) {
            const data = await uploadImages(images);

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
              slug: product.slug,
              description: product.description,
              variants: product.variants,
              price: product.price,
              discount: product.discount,
              qty: product.qty,
            });
          }
          setImages([]);
          break;
        case AdminActions.DELETE:
          result = await axios.post(`/api/admin/products/delete`, {
            productId: product._id,
          });
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
      checkExpirity(error, dispatch);
      enqueueSnackbar(getError(error), { variant: "error" });
    }
  };

  const cancelAction = () => {
    setProduct({
      category: "",
      designation: "",
      slug: "",
      description: "",
      variants: [],
      price: 0,
      discount: 0,
      qty: 0,
      images: [],
    });
    setTag("");
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
              : isMobile
              ? ModalSizes.BIG
              : ModalSizes.MEDIUM
          }
          title={
            action === AdminActions.ADD
              ? "add product"
              : action === AdminActions.UPDATE
              ? "edit product"
              : action === AdminActions.DELETE
              ? "delete product"
              : null
          }
        >
          {action === AdminActions.DELETE ? (
            <>
              <p>deleting &quot;{product.designation}&quot;.</p>
              <p>are you sure?</p>
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
                  className="defaultInput"
                  type="text"
                  name="description"
                  onChange={onChange}
                  onClick={expandTextArea}
                  value={product.description}
                />
              </div>
              <div className="labeledInput">
                <label>images</label>
                <br />
                <div className={styles.productImagesContainer}>
                  {imagesLoading ? (
                    <CircularProgress color="black" size={30} />
                  ) : (
                    product.images.map((image, index) => {
                      return (
                        <div key={index} className={styles.productImgPreview}>
                          <img
                            alt={index}
                            src={`/api/images/${image.split("/").pop()}`}
                            onError={(e) => {
                              e.target.src = isBase64(image)
                                ? image
                                : "/images/image-placeholder.jpg";
                            }}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
                <input
                  id="images"
                  hidden
                  type="file"
                  accept="image/*"
                  multiple={userInfo?.shop.pack.type === "PREMIUM"}
                  name="images"
                  onChange={onChange}
                />
                <label
                  className="btn btn-sm"
                  style={{ marginTop: "8px" }}
                  htmlFor="images"
                >
                  {imagesLoading
                    ? "Uploading..."
                    : product.images.length
                    ? "Change images"
                    : "Add images"}
                </label>
              </div>
              <div style={{ position: "relative" }} className="labeledInput">
                <label>
                  variants (sizes, colors ...)
                  {isMobile
                    ? ""
                    : " press 'enter' or ',' to confirm"}
                </label>
                <input
                  className="defaultInput"
                  type="tag"
                  name="variants"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyPress={addTag}
                />
                {isMobile && tag.length ? (
                  <span
                    className="addTag"
                    style={{ left: `${tag.length}px` }}
                    onClick={(e) => {
                      if (!product.variants.some((x) => x.label === tag)) {
                        setProduct({
                          ...product,
                          variants: [...product.variants, tag],
                        });
                        setTag("");
                      }
                    }}
                  >
                    <AddIcon />
                  </span>
                ) : null}
                {product.variants.length ? (
                  <XTag entries={product.variants} action={deleteTag} />
                ) : null}
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
            <h1>Products</h1>
            <div className={styles.searchBox}>
              <SearchIcon />
              <input
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
            <div className={styles.controlsEnd}>
              {!loadingCategories && !categories.length && (
                <p className={styles.controlsHint}>
                  Create a category first to start adding products.
                </p>
              )}
              <button
                className="btn btn-primary"
                onClick={() => {
                  if (userInfo) {
                    checkPremium(
                      userInfo,
                      products.length >= 10,
                      () => {
                        setAction(AdminActions.ADD);
                        setProduct({
                          ...product,
                          category: categories[0]._id,
                        });
                      },
                      enqueueSnackbar
                    )();
                  }
                }}
                disabled={!categories.length}
              >
                + Add product
              </button>
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
                    <th>image</th>
                    <th>designation</th>
                    <th>price</th>
                    <th>quantity</th>
                    <th>actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, index) => {
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
                        style={{
                          opacity:
                            userInfo?.shop.pack.type === "PREMIUM"
                              ? "1"
                              : index > 9
                              ? "0.5"
                              : "1",
                          pointerEvents:
                            userInfo?.shop.pack.type === "PREMIUM"
                              ? "all"
                              : index > 9
                              ? "none"
                              : "all",
                        }}
                      >
                        <td data-label="Image">
                          <img
                            className={styles.rowThumb}
                            alt={product.designation}
                            src={
                              product.images?.[0]
                                ? `/api/images/${product.images[0]
                                    .split("/")
                                    .pop()}?width=80&height=80`
                                : "/images/image-placeholder.jpg"
                            }
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = "/images/image-placeholder.jpg";
                            }}
                          />
                        </td>
                        <td data-label="Designation">{product.designation}</td>
                        <td data-label="Price">
                          {product.price.toLocaleString() +
                            " " +
                            userInfo?.shop.currency}
                        </td>
                        <td data-label="Qty">{product.qty}</td>
                        <td data-label="Actions">
                          <div className="btn-group">
                            {userInfo?.shop.pack.type !== "PREMIUM" &&
                            index > 9 ? (
                              <Link
                                href="/admin/account"
                                className="btn btn-sm"
                                style={{ pointerEvents: "auto" }}
                              >
                                Upgrade to unlock
                              </Link>
                            ) : (
                              <>
                                <button
                                  className="btn btn-sm"
                                  onClick={() => {
                                    setProduct(product);
                                    setAction(AdminActions.UPDATE);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() => {
                                    setProduct(product);
                                    setAction(AdminActions.DELETE);
                                  }}
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {!products.length ? (
                <EmptyState
                  art="box"
                  title="No products yet"
                  text="Use the + button to add your first product."
                />
              ) : null}
            </section>
          )}
        </section>
      </DisconnectedGuard>
    </AdminLayout>
  );
}

export default Inventory;
