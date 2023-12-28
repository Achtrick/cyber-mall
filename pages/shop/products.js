import { Skeleton } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../../components/shop/LoadingScreen";
import ShopLayout from "../../components/shop/ShopLayout";
import XPagination from "../../components/ui-components/XPagination";
import XAutoComplete from "../../components/ui-components/XAutoComplete";
import styles from "../../styles/shop/Products.module.scss";
import { getError } from "../../utils/shared/getError";
import Link from "next/link";
import { calculateDiscount } from "../../utils/config/convertHelper";
import XButton from "../../components/ui-components/XButton";

function Products(props) {
  const router = useRouter();
  const { shop, category, searchTerm, sort } = router.query;

  const { enqueueSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [shopInfo, setShopInfo] = useState(null);
  const [architecture, setArchitecture] = useState({});
  const [categories, setCategories] = useState([]);

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (shop) getShopInfo();
  }, [shop]);

  useEffect(() => {
    if (router.isReady && shopInfo && categories.length) getProducts();
  }, [router, page, shopInfo, categories]);

  const getShopInfo = async () => {
    try {
      const { data } = await axios.post("/api/shop/getInfo", {
        shopName: shop,
      });

      setShopInfo(data);
      setArchitecture(data.architecture);
      setLoading(false);

      !categories.length && (await getCategories(data._id));
    } catch (error) {
      console.log(error);
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
      console.log(data.products);
      setCount(data.count);
      setLoadingProducts(false);
    } catch (error) {
      enqueueSnackbar(getError(error), { variant: "error" });
      setLoadingProducts(false);
    }
  };

  const onPaginationChange = (e, page) => {
    setPage(page - 1);
  };

  const filter = async (filterOption, filterValue) => {
    const pathname = router.pathname;
    let query = router.query;

    query = { ...query, [filterOption]: filterValue };

    router.push({ pathname: pathname, query: query });
  };

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ShopLayout shopInfo={shopInfo}>
          <section className={styles.container}>
            <div className={styles.header}>
              <XPagination
                page={page}
                count={count}
                onChange={onPaginationChange}
              />
              <div className={styles.filter}>
                <XAutoComplete
                  placeholder="category"
                  options={categories}
                  value={categories.find((c) => c.name === category)?._id || ""}
                  optionDisplayExpr="name"
                  optionValueExpr="name"
                  onChange={(e, val) => {
                    filter("category", val?.name || "");
                  }}
                />
                &nbsp;
                <XAutoComplete
                  placeholder="sort by price"
                  options={[
                    { name: "ascending", value: 1 },
                    { name: "descending", value: -1 },
                  ]}
                  value={sort}
                  optionDisplayExpr="name"
                  optionValueExpr="value"
                  onChange={(e, val) => {
                    filter("sort", val?.value || "");
                  }}
                />
              </div>
            </div>
            {loadingProducts ? (
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={"calc(100vh - 200px)"}
              />
            ) : (
              <div className="grid-4">
                {products.map((product) => {
                  return (
                    <div className={styles.product} key={product._id}>
                      <Link
                        href={`product/?shop=${shopInfo.name}&id=${product._id}`}
                      >
                        <img
                          alt={product.designation}
                          src={product.images[0]}
                        />
                      </Link>
                      <p>{product.designation}</p>
                      {product.discount && product.discount !== 0 ? (
                        <p className={styles.oldPrice}>
                          {product.price + " DT"}
                        </p>
                      ) : null}
                      <p className={styles.price}>
                        {calculateDiscount(product.price, product.discount) +
                          " DT"}
                      </p>
                      <XButton
                        color={shopInfo.settings.primaryColor}
                        text={"add to cart"}
                        action={() => {
                          console.log("add to cart");
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </ShopLayout>
      )}
    </>
  );
}
export default Products;
