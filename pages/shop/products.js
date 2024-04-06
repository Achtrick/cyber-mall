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
import { calculateDiscount } from "../../utils/config/convertHelper";
import { getError } from "../../utils/shared/getError";
import { ResetIcon } from "../../utils/theme/icons";

function Products() {
  const router = useRouter();
  const { shop, category, searchTerm, sort } = router.query;

  const sortOptions = [{ name: "ascending" }, { name: "descending" }];

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

  useEffect(() => {
    if (router.isReady && router.query) {
      if (shop) {
        getShopInfo();
      } else {
        enqueueSnackbar("Lien de shop invalide", { variant: "error" });
        router.push("/");
      }
    }
  }, [router]);

  useEffect(() => {
    if (router.isReady && shopInfo && !loadingCategories) getProducts();
  }, [router, page, shopInfo, categories]);

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
    router.push({ pathname: pathname, query: query });
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
    enqueueSnackbar(`${product.designation} ajouté au panier`, {
      variant: "info",
    });
  };

  const resetSearch = (searchTerm) => {
    const pathname = router.pathname;
    let query = router.query;

    query = { ...query, searchTerm: searchTerm };
    if (pathname.includes("products")) {
      router.push({ pathname: pathname, query: query });
    } else {
      router.push(
        `/shop/products/?shop=${shopInfo.name}&searchTerm=${
          searchTerm ? searchTerm : ""
        }`
      );
    }
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
          image={"/logo-512.png"}
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
                      optionValueExpr="name"
                      onChange={(e, val) => {
                        filter("sort", val?.name || "");
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
                          href={`product/?shop=${shopInfo.name}&id=${product._id}`}
                        >
                          <img
                            alt={product.designation}
                            src={
                              product.images[0]
                                ? `/api/images/${product.images[0]
                                    .split("/")
                                    .pop()}`
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
                        <XButton
                          color={shopInfo.settings.primaryColor}
                          text={"Acheter"}
                          action={() => {
                            addTocart(shop, product);
                          }}
                        />
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
