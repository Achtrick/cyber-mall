import { Skeleton } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import LoadingScreen from "../../components/shop/LoadingScreen";
import ShopLayout from "../../components/shop/ShopLayout";
import XPagination from "../../components/ui-components/XPagination";
import styles from "../../styles/shop/Products.module.scss";
import { getError } from "../../utils/shared/getError";

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

  return (
    <>
      {loading ? (
        <LoadingScreen />
      ) : (
        <ShopLayout shopInfo={shopInfo}>
          <section className={styles.container}>
            <XPagination
              page={page}
              count={count}
              onChange={onPaginationChange}
            />
            <p>count:{count}</p>
            {loadingProducts ? (
              <Skeleton
                variant="rectangular"
                width={"100%"}
                height={"calc(100vh - 200px)"}
              />
            ) : (
              <p>loaded products</p>
            )}
          </section>
        </ShopLayout>
      )}
    </>
  );
}
export default Products;
