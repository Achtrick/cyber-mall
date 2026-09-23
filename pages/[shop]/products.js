import {
  CircularProgress,
  Drawer,
  IconButton,
  Skeleton,
  useMediaQuery,
} from "@mui/material";
import axios from "axios";
import EmptyState from "../../components/ui-components/EmptyState";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LoadingScreen from "../../components/shop/LoadingScreen";
import OutOfStock from "../../components/shop/OutOfStock";
import ShopLayout from "../../components/shop/ShopLayout";
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
    { name: "Price: low to high", value: "ascending" },
    { name: "Price: high to low", value: "descending" },
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

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [draftCategory, setDraftCategory] = useState("");
  const [draftSort, setDraftSort] = useState("");

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (shop) {
      getShopInfo();
    } else {
      enqueueSnackbar("Invalid shop link", { variant: "error" });
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

  const applyFilters = (nextCategory, nextSort) => {
    const pathname = router.pathname;
    const query = { ...router.query, category: nextCategory, sort: nextSort };
    if (!nextCategory) delete query.category;
    if (!nextSort) delete query.sort;
    setPage(0);
    router.push({
      pathname: shopInfo?.domainName.length ? "/products" : pathname,
      query: query,
    });
  };

  const openFilters = () => {
    setDraftCategory(category || "");
    setDraftSort(sort || "");
    setFiltersOpen(true);
  };

  const activeFilterCount = (category ? 1 : 0) + (sort ? 1 : 0);

  const chipStyle = (active) => ({
    borderColor: shopInfo?.settings.primaryColor,
    backgroundColor: active ? shopInfo?.settings.primaryColor : "transparent",
    color: active
      ? deduceColor(shopInfo?.settings.primaryColor)
      : shopInfo?.settings.primaryColor,
  });

  // one chip group, rendered inside the sliding filter sheet on every screen size
  const renderFilterGroups = (selectedCategory, selectedSort, onPick) => (
    <>
      <div className={styles.filterGroup}>
        <h4>Category</h4>
        <div className={styles.chips}>
          <button
            type="button"
            className={styles.chip}
            style={chipStyle(!selectedCategory)}
            onClick={() => onPick("", selectedSort)}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              type="button"
              key={c._id}
              className={styles.chip}
              style={chipStyle(selectedCategory === c.name)}
              onClick={() => onPick(c.name, selectedSort)}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.filterGroup}>
        <h4>Sort by price</h4>
        <div className={styles.chips}>
          <button
            type="button"
            className={styles.chip}
            style={chipStyle(!selectedSort)}
            onClick={() => onPick(selectedCategory, "")}
          >
            Newest
          </button>
          {sortOptions.map((o) => (
            <button
              type="button"
              key={o.value}
              className={styles.chip}
              style={chipStyle(selectedSort === o.value)}
              onClick={() => onPick(selectedCategory, o.value)}
            >
              {o.name}
            </button>
          ))}
        </div>
      </div>
    </>
  );

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
    enqueueSnackbar(`${product.designation} added to cart`, {
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
              ? `Search results for "${searchTerm}"`
              : category?.length
              ? category[0].toUpperCase() + category.substring(1)
              : "Our products"
          }
          url={router.asPath.replace(/^\//, "")}
          description={
            "Let us keep your coffee warm while you shop!"
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
                    Results For : {searchTerm}{" "}
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
                  <button
                    type="button"
                    className={styles.filterButton}
                    style={{
                      borderColor: shopInfo.settings.primaryColor,
                      color: shopInfo.settings.primaryColor,
                    }}
                    onClick={openFilters}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      aria-hidden="true"
                    >
                      <path d="M4 6h10M20 6h0M4 12h2M12 12h8M4 18h9M20 18h0" />
                      <circle cx="16" cy="6" r="2" />
                      <circle cx="9" cy="12" r="2" />
                      <circle cx="16" cy="18" r="2" />
                    </svg>
                    Filters
                    {activeFilterCount ? (
                      <span
                        className={styles.filterCount}
                        style={{
                          backgroundColor: shopInfo.settings.primaryColor,
                          color: deduceColor(shopInfo.settings.primaryColor),
                        }}
                      >
                        {activeFilterCount}
                      </span>
                    ) : null}
                  </button>
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
                                    .pop()}?width=400&height=400`
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
                            {product.price.toLocaleString() +
                              " " +
                              shopInfo.currency}
                          </p>
                        ) : null}
                        <p className={styles.price}>
                          {calculateDiscount(
                            product.price,
                            product.discount
                          ).toLocaleString() +
                            " " +
                            shopInfo.currency}
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
                          {product.qty < 1 ? <OutOfStock /> : null}
                          <XButton
                            color={shopInfo.settings.primaryColor}
                            text={"Buy"}
                            action={() => checkVariants(product)}
                          />
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
            )}
            {!loadingProducts && !products.length ? (
              <EmptyState
                art="box"
                title="No products found"
                text="Try another category or clear your search to see everything in this shop."
              />
            ) : null}
            <br />
            <div className={styles.header}>
              <XPagination
                page={page}
                count={count}
                onChange={onPaginationChange}
              />
            </div>
          </section>
          <Drawer
            anchor="bottom"
            open={filtersOpen}
            onClose={() => setFiltersOpen(false)}
            sx={{ zIndex: 3000 }}
            PaperProps={{ className: styles.sheet }}
          >
            <div className={styles.grabber} />
            <div className={styles.sheetHeader}>
              <h3>Filters</h3>
              <button
                type="button"
                className={styles.sheetClose}
                aria-label="Close filters"
                onClick={() => setFiltersOpen(false)}
              >
                &times;
              </button>
            </div>
            <div className={styles.sheetBody}>
              {renderFilterGroups(draftCategory, draftSort, (c, so) => {
                setDraftCategory(c);
                setDraftSort(so);
              })}
            </div>
            <div className={styles.sheetFooter}>
              <button
                type="button"
                className={styles.sheetClear}
                onClick={() => {
                  setDraftCategory("");
                  setDraftSort("");
                }}
              >
                Clear all
              </button>
              <button
                type="button"
                className={styles.sheetApply}
                style={{
                  backgroundColor: shopInfo?.settings.primaryColor,
                  color: deduceColor(shopInfo?.settings.primaryColor),
                }}
                onClick={() => {
                  applyFilters(draftCategory, draftSort);
                  setFiltersOpen(false);
                }}
              >
                Show results
              </button>
            </div>
          </Drawer>
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
