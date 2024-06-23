import {
  CircularProgress,
  IconButton,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LoadingScreen from "../../components/shop/LoadingScreen";
import ShopLayout from "../../components/shop/ShopLayout";
import XAutoComplete from "../../components/ui-components/XAutoComplete";
import XButton from "../../components/ui-components/XButton";
import XPagination from "../../components/ui-components/XPagination";
import styles from "../../styles/shop/Products.module.scss";
import {
  calculateDiscount,
  deduceColor,
} from "../../utils/config/convertHelper";
import { getError } from "../../utils/shared/getError";
import { ResetIcon } from "../../utils/theme/icons";

function Products({ shop }) {
  const router = useRouter();
  const { category, searchTerm, sort } = router.query;

  const sortOptions = [
    { name: "Ascendant", value: "ascending" },
    { name: "Descendant", value: "descending" },
  ];

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  const isMobile = useMediaQuery("(max-width:800px)");

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [shopInfo, setShopInfo] = useState(null);
  const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (shop) {
      getShopInfo();
    } else {
      enqueueSnackbar("Lien de shop invalide", { variant: "error" });
      router.push("/");
    }
  }, []);

  useEffect(() => {
    if (router.isReady && shopInfo && !loadingCategories) getProducts();
  }, [router, router.query, page, shopInfo, categories]);

  const getShopInfo = async () => {
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: shop,
      });

      setShopInfo(data);
      setLoading(false);

      !categories.length && (await getCategories(data._id));
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      router.push("/");
    }
  };

  const getCategories = async (shopId) => {
    setLoadingCategories(true);
    try {
      const { data } = await axios.post("/api/admin/categories/get", {
        shop: shopId,
      });
      setCategories(data);
      setLoadingCategories(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoadingCategories(false);
    }
  };

  const getProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data } = await axios.post("/api/shop/get-products", {
        shopId: shopInfo._id,
        page: page + 1,
        searchTerm: searchTerm,
        category: categories.find((c) => c.name === category)?._id,
        sort: sort,
      });
      setProducts(data.products);
      setCount(data.count);
      setLoadingProducts(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoadingProducts(false);
    }
  };

  const onPaginationChange = (e, page) => {
    setPage(page - 1);
    window.scroll({ top: 0, behavior: "smooth" });
  };

  const filter = async (filterOption, filterValue) => {
    const pathname = router.pathname;
    let query = router.query;
    query = { ...query, [filterOption]: filterValue };
    router.push({
      pathname: shopInfo?.domainName.length ? "/products" : pathname,
      query: query,
    });
  };

  const addTocart = (shop, product) => {
    dispatch({
      type: "UPDATE_CARTS",
      payload: {
        shop,
        product: {
          ...product,
          qty: 1,
          price: product.discount
            ? calculateDiscount(product.price, product.discount)
            : product.price,
        },
      },
    });
    dispatch({ type: "TOGGLE_CART_PREVIEW" });
    enqueueSnackbar(`${product.designation} ajouté au panier`, {
      variant: "info",
    });
  };

  const checkVariants = (product) => {
    if (!product.variants?.length) {
      setSelectedVariant(null);
      setSelectedProduct(null);
      addTocart(shopInfo.name, product);
    } else {
      setSelectedProduct(product);
      isMobile &&
        setTimeout(() => {
          setSelectedVariant(null);
          setSelectedProduct(null);
        }, 5000);
    }
  };

  const resetSearch = (searchTerm) => {
    let query = router.query;

    query = { ...query, searchTerm: searchTerm };

    router.push(
      shopInfo?.domainName.length
        ? `/products?searchTerm=${searchTerm ? searchTerm : ""}`
        : `/${shopInfo.name}/products?searchTerm=${
            searchTerm ? searchTerm : ""
          }`
    );
  };

  const tagStyle = {
    color: shopInfo?.settings.primaryColor,
    border: `1px solid ${shopInfo?.settings.primaryColor}`,
  };

  const activeTagStyle = {
    color: shopInfo && deduceColor(shopInfo?.settings.primaryColor),
    backgroundColor: shopInfo?.settings.primaryColor,
  };

  const tagMouseOver = (e) => {
    e.target.style.backgroundColor = shopInfo?.settings.primaryColor;
    e.target.style.color = deduceColor(shopInfo?.settings.primaryColor);
  };

  const tagMouseLeave = (e) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.color = shopInfo?.settings.primaryColor;
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ShopLayout
          title={
            searchTerm?.length
              ? `Résultats de recherche pour "${searchTerm}"`
              : category?.length
              ? category[0].toUpperCase() + category.substring(1)
              : "Nos produits"
          }
          description={
            "Laissez-nous tenir votre café pendant que vous faites vos shopping !"
          }
          shopInfo={shopInfo}
        >
          <section className={styles.container}>
            <div
              className={styles.header}
              style={
                isMobile
                  ? {
                      flexDirection: "column-reverse",
                    }
                  : null
              }
            >
              <div
                className="row"
                style={
                  isMobile
                    ? {
                        flexDirection: "column-reverse",
                      }
                    : null
                }
              >
                <XPagination
                  page={page}
                  count={count}
                  onChange={onPaginationChange}
                />
                &nbsp;
                {searchTerm?.length ? (
                  <p
                    style={
                      isMobile
                        ? {
                            marginBottom: "-15px",
                          }
                        : null
                    }
                  >
                    Résultats Pour : {searchTerm}{" "}
                    <IconButton onClick={() => resetSearch()}>
                      <ResetIcon />
                    </IconButton>
                  </p>
                ) : null}
              </div>
              <div className={styles.filter}>
                {loadingCategories ? (
                  <CircularProgress
                    style={{ color: shopInfo.settings.primaryColor }}
                    size={"17px"}
                  />
                ) : (
                  <>
                    <XAutoComplete
                      placeholder="Catégorie"
                      options={categories}
                      value={
                        categories.find((c) => c.name === category)?.name || ""
                      }
                      optionDisplayExpr="name"
                      optionValueExpr="name"
                      onChange={(e, val) => {
                        filter("category", val?.name || "");
                      }}
                    />
                    &nbsp;
                    <XAutoComplete
                      placeholder="Trier Par Prix"
                      options={sortOptions}
                      value={sort}
                      optionDisplayExpr="name"
                      optionValueExpr="value"
                      onChange={(e, val) => {
                        filter("sort", val?.value || "");
                      }}
                    />
                  </>
                )}
              </div>
            </div>
            {loadingProducts ? (
              <Skeleton
                style={{ marginTop: "20px" }}
                variant="rectangular"
                width={"100%"}
                height={"calc(100vh - 250px)"}
              />
            ) : (
              <div className="grid-4">
                {products.map((product, index) => {
                  if (!(shopInfo.pack.type !== "PREMIUM" && index > 9)) {
                    return (
                      <div
                        className={styles.product}
                        style={{ alignItems: "flex-start" }}
                        key={product._id}
                      >
                        <Link
                          href={
                            shopInfo?.domainName.length
                              ? `/${product.slug}`
                              : `/${shopInfo.name}/${product.slug}`
                          }
                        >
                          <img
                            alt={product.designation}
                            src={
                              product.images[0]
                                ? `/api/images/${product.images[0]
                                    .split("/")
                                    .pop()}?width=200&height=200`
                                : "/images/image-placeholder.jpg"
                            }
                            onError={(e) => {
                              e.target.src = "/images/image-placeholder.jpg";
                            }}
                          />
                        </Link>
                        <p>{product.designation}</p>
                        {product.discount && product.discount !== 0 ? (
                          <p className={styles.oldPrice}>
                            {product.price.toLocaleString() + " DT"}
                          </p>
                        ) : null}
                        <p className={styles.price}>
                          {calculateDiscount(
                            product.price,
                            product.discount
                          ).toLocaleString() + " DT"}
                        </p>
                        <div
                          onMouseLeave={() => {
                            setSelectedVariant(null);
                            setSelectedProduct(null);
                          }}
                          className="variantPickerContainer"
                        >
                          <div
                            className={
                              product._id === selectedProduct?._id
                                ? `variantPicker variantPickerActive`
                                : `variantPicker`
                            }
                          >
                            {product.variants?.map((variant, key) => {
                              return (
                                <span
                                  style={
                                    selectedVariant === variant
                                      ? activeTagStyle
                                      : tagStyle
                                  }
                                  onMouseOver={
                                    selectedVariant === variant
                                      ? null
                                      : tagMouseOver
                                  }
                                  onMouseLeave={
                                    selectedVariant === variant
                                      ? null
                                      : tagMouseLeave
                                  }
                                  className="tag"
                                  key={key}
                                  onClick={() => {
                                    setSelectedVariant(variant);
                                    setTimeout(() => {
                                      addTocart(shopInfo.name, {
                                        ...product,
                                        designation: variant
                                          ? product.designation +
                                            " | " +
                                            variant
                                          : product.designation,
                                      });
                                      setSelectedProduct(null);
                                      setSelectedVariant(null);
                                    }, 100);
                                  }}
                                >
                                  {variant}
                                </span>
                              );
                            })}
                          </div>

                          <XButton
                            color={shopInfo.settings.primaryColor}
                            text={"Acheter"}
                            action={() => checkVariants(product)}
                          />
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
            <br />
            <div className={styles.header}>
              <XPagination
                page={page}
                count={count}
                onChange={onPaginationChange}
              />
            </div>
          </section>
        </ShopLayout>
      )}
    </>
  );
}
export default Products;

export function getServerSideProps(context) {
  return {
    props: { shop: context.params.shop },
  };
}
